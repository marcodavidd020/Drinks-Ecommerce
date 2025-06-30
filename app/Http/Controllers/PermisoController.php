<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
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
            return [
                'id' => $permission->id,
                'nombre' => $permission->name, // Mapear name a nombre para consistencia
                'name' => $permission->name,
                'roles_count' => $permission->roles_count ?? 0,
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
                'guard_name' => $permission->guard_name,
                'category' => $this->getPermissionCategory($permission->name),
                'is_system_permission' => $this->isSystemPermission($permission->name),
            ];
        });

        return Inertia::render('Admin/Permissions', [
            'permissions' => $permissions,
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
        return Inertia::render('Admin/Permissions/Create');
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

        return Inertia::render('Admin/Permissions/Show', [
            'permission' => [
                'id' => $permission->id,
                'nombre' => $permission->name, // Mapear para consistencia
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'created_at' => $permission->created_at->toISOString(),
                'updated_at' => $permission->updated_at->toISOString(),
                'category' => $this->getPermissionCategory($permission->name),
                'is_system_permission' => $this->isSystemPermission($permission->name),
                'roles' => $permission->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'nombre' => $role->name,
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
        return Inertia::render('Admin/Permissions/Edit', [
            'permission' => [
                'id' => $permission->id,
                'nombre' => $permission->name,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'is_system_permission' => $this->isSystemPermission($permission->name),
            ],
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
            // Solo permitir actualizar permisos que no son del sistema
            if (!$this->isSystemPermission($permission->name)) {
                $permission->update([
                    'name' => $validated['name'],
                ]);

                return redirect()->route('admin.permissions.index')
                    ->with('success', 'Permiso actualizado exitosamente.');
            } else {
                return redirect()->route('admin.permissions.index')
                    ->with('error', 'No se pueden modificar los permisos del sistema.');
            }
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar el permiso: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        // Verificar que no sea un permiso del sistema
        if ($this->isSystemPermission($permission->name)) {
            return redirect()->route('admin.permissions.index')
                ->with('error', 'No se pueden eliminar los permisos del sistema.');
        }

        try {
            DB::beginTransaction();

            // Verificar que no esté asignado a ningún rol
            if ($permission->roles()->count() > 0) {
                return redirect()->route('admin.permissions.index')
                    ->with('error', 'No se puede eliminar un permiso que está asignado a roles.');
            }

            $permission->delete();

            DB::commit();

            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permiso eliminado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar el permiso: ' . $e->getMessage()]);
        }
    }

    /**
     * Sincronizar permisos del enum con la base de datos
     */
    public function syncPermissions(): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $enumPermissions = PermissionEnum::values();
            $existingPermissions = Permission::pluck('name')->toArray();

            // Crear permisos que no existen
            $newPermissions = array_diff($enumPermissions, $existingPermissions);
            foreach ($newPermissions as $permissionName) {
                Permission::create([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
            }

            DB::commit();

            $count = count($newPermissions);
            $message = $count > 0 
                ? "Se sincronizaron {$count} permisos nuevos exitosamente."
                : "Todos los permisos ya están sincronizados.";

            return redirect()->route('admin.permissions.index')
                ->with('success', $message);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al sincronizar permisos: ' . $e->getMessage()]);
        }
    }

    /**
     * Categorizar permisos para mejor organización
     */
    private function getPermissionCategory(string $permission): string
    {
        if (str_contains($permission, 'usuario')) return 'Usuarios';
        if (str_contains($permission, 'cliente')) return 'Clientes';
        if (str_contains($permission, 'producto')) return 'Productos';
        if (str_contains($permission, 'categoria')) return 'Categorías';
        if (str_contains($permission, 'proveedor')) return 'Proveedores';
        if (str_contains($permission, 'venta')) return 'Ventas';
        if (str_contains($permission, 'compra')) return 'Compras';
        if (str_contains($permission, 'promocion')) return 'Promociones';
        if (str_contains($permission, 'inventario')) return 'Inventario';
        if (str_contains($permission, 'rol') || str_contains($permission, 'permiso')) return 'Sistema';
        if (str_contains($permission, 'carrito')) return 'Carrito';
        if (str_contains($permission, 'pqrs')) return 'PQRS';
        if (str_contains($permission, 'ajuste')) return 'Ajustes';
        if (str_contains($permission, 'dashboard') || str_contains($permission, 'reporte') || str_contains($permission, 'ecommerce')) return 'General';
        return 'Otros';
    }

    /**
     * Verificar si es un permiso del sistema
     */
    private function isSystemPermission(string $permission): bool
    {
        return in_array($permission, PermissionEnum::values());
    }
} 