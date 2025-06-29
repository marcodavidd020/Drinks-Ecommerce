<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use App\Enums\PermissionEnum;

class PermisoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = (int) $request->get('per_page', 10);

        $query = Permission::query()
            ->withCount('roles')
            ->when($search, function ($query) use ($search) {
                return $query->where('name', 'like', "%{$search}%");
            });

        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        $permissions = $query->paginate($perPage);

        // Transformar datos para incluir información adicional
        $permissions->getCollection()->transform(function ($permission) {
            // Intentar obtener la etiqueta del enum si existe
            $permissionEnum = PermissionEnum::tryFrom($permission->name);
            $label = $permissionEnum ? $permissionEnum->label() : ucfirst(str_replace('-', ' ', $permission->name));
            
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $label,
                'roles_count' => $permission->roles_count ?? 0,
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
                'guard_name' => $permission->guard_name,
            ];
        });

        // Obtener permisos agrupados para mostrar categorías
        $groupedPermissions = PermissionEnum::groupedPermissions();

        return Inertia::render('Admin/Permissions', [
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $groupedPermissions = PermissionEnum::groupedPermissions();

        return Inertia::render('Admin/Permissions/Create', [
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        try {
            // Crear el permiso
            Permission::create([
                'name' => $validated['name'],
                'guard_name' => 'web',
            ]);

            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permiso creado exitosamente.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear el permiso: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission): Response
    {
        $permission->load('roles');

        // Intentar obtener la etiqueta del enum si existe
        $permissionEnum = PermissionEnum::tryFrom($permission->name);
        $label = $permissionEnum ? $permissionEnum->label() : ucfirst(str_replace('-', ' ', $permission->name));

        return Inertia::render('Admin/Permissions/Show', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $label,
                'guard_name' => $permission->guard_name,
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
                'roles' => $permission->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission): Response
    {
        // Intentar obtener la etiqueta del enum si existe
        $permissionEnum = PermissionEnum::tryFrom($permission->name);
        $label = $permissionEnum ? $permissionEnum->label() : ucfirst(str_replace('-', ' ', $permission->name));

        $groupedPermissions = PermissionEnum::groupedPermissions();

        return Inertia::render('Admin/Permissions/Edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $label,
                'guard_name' => $permission->guard_name,
            ],
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name,' . $permission->id],
        ]);

        try {
            // Actualizar el permiso
            $permission->update([
                'name' => $validated['name'],
            ]);

            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permiso actualizado exitosamente.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar el permiso: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        // Verificar que no sea uno de los permisos del sistema
        $systemPermissions = PermissionEnum::values();
        
        if (in_array($permission->name, $systemPermissions)) {
            return redirect()->route('admin.permissions.index')
                ->with('error', 'No se pueden eliminar los permisos del sistema.');
        }

        try {
            $permission->delete();

            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permiso eliminado exitosamente.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al eliminar el permiso: ' . $e->getMessage()]);
        }
    }

    /**
     * Synchronize permissions with enum values
     */
    public function syncPermissions(): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $enumPermissions = PermissionEnum::values();
            $existingPermissions = Permission::pluck('name')->toArray();

            // Crear permisos que faltan
            $missingPermissions = array_diff($enumPermissions, $existingPermissions);
            foreach ($missingPermissions as $permissionName) {
                Permission::create([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
            }

            DB::commit();

            $createdCount = count($missingPermissions);
            $message = $createdCount > 0 
                ? "Se crearon {$createdCount} permisos faltantes." 
                : "Todos los permisos están sincronizados.";

            return redirect()->route('admin.permissions.index')
                ->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al sincronizar permisos: ' . $e->getMessage()]);
        }
    }
} 