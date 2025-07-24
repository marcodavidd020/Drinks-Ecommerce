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

class RolController extends Controller
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

        $query = Role::query()
            ->withCount(['permissions', 'users'])
            ->when($search, function ($query) use ($search) {
                return $query->where('name', 'like', "%{$search}%");
            });

        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        $roles = $query->paginate($perPage);

        // Transformar datos para incluir información adicional
        $roles->getCollection()->transform(function ($role) {
            return [
                'id' => $role->id,
                'nombre' => $role->name, // Mapear name a nombre para consistencia
                'name' => $role->name,
                'display_name' => $role->display_name,
                'description' => $role->description,
                'permissions_count' => $role->permissions_count ?? 0,
                'users_count' => $role->users_count ?? 0,
                'created_at' => $role->created_at ? $role->created_at->toISOString() : null,
                'updated_at' => $role->updated_at ? $role->updated_at->toISOString() : null,
                'is_system_role' => $role->is_system,
            ];
        });

        return Inertia::render('Admin/Roles', [
            'roles' => $roles,
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
        $permissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'nombre' => $permission->name, // Mapear para consistencia
                'guard_name' => $permission->guard_name,
                'category' => $this->getPermissionCategory($permission->name),
            ];
        });

        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'display_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'permissions' => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        try {
            DB::beginTransaction();

            // Crear el rol
            $role = Role::create([
                'name' => $validated['name'],
                'display_name' => $validated['display_name'],
                'description' => $validated['description'] ?? null,
                'is_system' => false, // Los roles creados manualmente no son del sistema
            ]);

            // Asignar permisos si se proporcionaron
            if (!empty($validated['permissions'])) {
                $permissions = Permission::whereIn('id', $validated['permissions'])->get();
                $role->syncPermissions($permissions->pluck('name')->toArray());
            }

            DB::commit();

            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear el rol: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): Response
    {
        $role->load(['permissions', 'users']);

        return Inertia::render('Admin/Roles/Show', [
            'role' => [
                'id' => $role->id,
                'nombre' => $role->name, // Mapear para consistencia
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'created_at' => $role->created_at ? $role->created_at->toISOString() : null,
                'updated_at' => $role->updated_at ? $role->updated_at->toISOString() : null,
                'users_count' => $role->users->count(),
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                        'nombre' => $permission->name,
                        'guard_name' => $permission->guard_name,
                        'category' => $this->getPermissionCategory($permission->name),
                    ];
                }),
                'users' => $role->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'nombre' => $user->nombre,
                        'email' => $user->email,
                    ];
                }),
                'is_system_role' => in_array($role->name, ['admin', 'cliente', 'vendedor']),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role): Response
    {
        $role->load('permissions');
        
        $permissions = Permission::all()->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'nombre' => $permission->name,
                'guard_name' => $permission->guard_name,
                'category' => $this->getPermissionCategory($permission->name),
            ];
        });

        return Inertia::render('Admin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'nombre' => $role->name,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('id')->toArray(),
                'is_system_role' => in_array($role->name, ['admin', 'cliente', 'vendedor']),
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'permissions' => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        try {
            DB::beginTransaction();

            // Actualizar el rol (solo si no es del sistema)
            if (!in_array($role->name, ['admin', 'cliente', 'vendedor'])) {
                $role->update([
                    'name' => $validated['name'],
                ]);
            }

            // Sincronizar permisos
            if (isset($validated['permissions'])) {
                $permissions = Permission::whereIn('id', $validated['permissions'])->get();
                $role->syncPermissions($permissions);
            } else {
                $role->syncPermissions([]);
            }

            DB::commit();

            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar el rol: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        // Verificar que no sea uno de los roles del sistema
        $systemRoles = ['admin', 'cliente', 'vendedor'];
        
        if (in_array($role->name, $systemRoles)) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'No se pueden eliminar los roles del sistema.');
        }

        try {
            DB::beginTransaction();

            // Verificar que no tenga usuarios asignados
            if ($role->users()->count() > 0) {
                return redirect()->route('admin.roles.index')
                    ->with('error', 'No se puede eliminar un rol que tiene usuarios asignados.');
            }

            $role->delete();

            DB::commit();

            return redirect()->route('admin.roles.index')
                ->with('success', 'Rol eliminado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar el rol: ' . $e->getMessage()]);
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
        return 'General';
    }
} 