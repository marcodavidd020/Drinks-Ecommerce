<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class SpatieRolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar cache de permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Crear permisos
        $this->createPermissions();
        
        // 2. Crear roles
        $this->createRoles();
        
        // 3. Asignar permisos a roles
        $this->assignPermissionsToRoles();
        
        // 4. Asignar roles a usuarios existentes
        $this->assignRolesToUsers();
        
        $this->command->info('✅ Sistema de roles y permisos de Spatie configurado correctamente');
    }

    private function createPermissions(): void
    {
        $permissions = [
            // Usuarios
            ['name' => 'ver usuarios', 'category' => 'usuarios'],
            ['name' => 'crear usuarios', 'category' => 'usuarios'],
            ['name' => 'editar usuarios', 'category' => 'usuarios'],
            ['name' => 'eliminar usuarios', 'category' => 'usuarios'],
            ['name' => 'gestionar usuarios', 'category' => 'usuarios'],
            
            // Clientes
            ['name' => 'ver clientes', 'category' => 'clientes'],
            ['name' => 'crear clientes', 'category' => 'clientes'],
            ['name' => 'editar clientes', 'category' => 'clientes'],
            ['name' => 'eliminar clientes', 'category' => 'clientes'],
            ['name' => 'gestionar clientes', 'category' => 'clientes'],
            
            // Productos
            ['name' => 'ver productos', 'category' => 'productos'],
            ['name' => 'crear productos', 'category' => 'productos'],
            ['name' => 'editar productos', 'category' => 'productos'],
            ['name' => 'eliminar productos', 'category' => 'productos'],
            ['name' => 'gestionar productos', 'category' => 'productos'],
            
            // Categorías
            ['name' => 'ver categorias', 'category' => 'categorias'],
            ['name' => 'crear categorias', 'category' => 'categorias'],
            ['name' => 'editar categorias', 'category' => 'categorias'],
            ['name' => 'eliminar categorias', 'category' => 'categorias'],
            ['name' => 'gestionar categorias', 'category' => 'categorias'],
            
            // Proveedores
            ['name' => 'ver proveedores', 'category' => 'proveedores'],
            ['name' => 'crear proveedores', 'category' => 'proveedores'],
            ['name' => 'editar proveedores', 'category' => 'proveedores'],
            ['name' => 'eliminar proveedores', 'category' => 'proveedores'],
            ['name' => 'gestionar proveedores', 'category' => 'proveedores'],
            
            // Ventas
            ['name' => 'ver ventas', 'category' => 'ventas'],
            ['name' => 'crear ventas', 'category' => 'ventas'],
            ['name' => 'editar ventas', 'category' => 'ventas'],
            ['name' => 'eliminar ventas', 'category' => 'ventas'],
            ['name' => 'gestionar ventas', 'category' => 'ventas'],
            
            // Compras
            ['name' => 'ver compras', 'category' => 'compras'],
            ['name' => 'crear compras', 'category' => 'compras'],
            ['name' => 'editar compras', 'category' => 'compras'],
            ['name' => 'eliminar compras', 'category' => 'compras'],
            ['name' => 'gestionar compras', 'category' => 'compras'],
            
            // Promociones
            ['name' => 'ver promociones', 'category' => 'promociones'],
            ['name' => 'crear promociones', 'category' => 'promociones'],
            ['name' => 'editar promociones', 'category' => 'promociones'],
            ['name' => 'eliminar promociones', 'category' => 'promociones'],
            ['name' => 'gestionar promociones', 'category' => 'promociones'],
            
            // Inventario
            ['name' => 'ver inventario', 'category' => 'inventario'],
            ['name' => 'ajustar inventario', 'category' => 'inventario'],
            ['name' => 'gestionar inventario', 'category' => 'inventario'],
            
            // Sistema
            ['name' => 'ver dashboard', 'category' => 'sistema'],
            ['name' => 'gestionar roles', 'category' => 'sistema'],
            ['name' => 'gestionar permisos', 'category' => 'sistema'],
            ['name' => 'acceso admin', 'category' => 'sistema'],
            ['name' => 'ver reportes', 'category' => 'sistema'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                ['guard_name' => 'web']
            );
        }

        $this->command->info('   • Permisos creados: ' . count($permissions));
    }

    private function createRoles(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrador del sistema con acceso completo'
            ],
            [
                'name' => 'cliente',
                'description' => 'Cliente del sistema con acceso a compras'
            ],
            [
                'name' => 'vendedor',
                'description' => 'Vendedor con acceso a ventas, productos y clientes'
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(
                ['name' => $roleData['name']],
                ['guard_name' => 'web']
            );
        }

        $this->command->info('   • Roles creados: ' . count($roles));
    }

    private function assignPermissionsToRoles(): void
    {
        $rolePermissions = [
            'admin' => [
                // Acceso completo a todo
                'gestionar usuarios', 'crear usuarios', 'editar usuarios', 'eliminar usuarios', 'ver usuarios',
                'gestionar clientes', 'crear clientes', 'editar clientes', 'eliminar clientes', 'ver clientes',
                'gestionar productos', 'crear productos', 'editar productos', 'eliminar productos', 'ver productos',
                'gestionar categorias', 'crear categorias', 'editar categorias', 'eliminar categorias', 'ver categorias',
                'gestionar proveedores', 'crear proveedores', 'editar proveedores', 'eliminar proveedores', 'ver proveedores',
                'gestionar ventas', 'crear ventas', 'editar ventas', 'eliminar ventas', 'ver ventas',
                'gestionar compras', 'crear compras', 'editar compras', 'eliminar compras', 'ver compras',
                'gestionar promociones', 'crear promociones', 'editar promociones', 'eliminar promociones', 'ver promociones',
                'gestionar inventario', 'ajustar inventario', 'ver inventario',
                'ver dashboard', 'gestionar roles', 'gestionar permisos', 'acceso admin', 'ver reportes'
            ],
            
            'vendedor' => [
                // Permisos de ventas y gestión operativa
                'ver clientes', 'crear clientes', 'editar clientes',
                'gestionar productos', 'crear productos', 'editar productos', 'ver productos',
                'gestionar categorias', 'crear categorias', 'editar categorias', 'ver categorias',
                'gestionar proveedores', 'crear proveedores', 'editar proveedores', 'ver proveedores',
                'gestionar ventas', 'crear ventas', 'editar ventas', 'ver ventas',
                'gestionar compras', 'crear compras', 'editar compras', 'ver compras',
                'gestionar inventario', 'ajustar inventario', 'ver inventario',
                'gestionar promociones', 'crear promociones', 'editar promociones', 'ver promociones',
                'ver dashboard', 'ver reportes'
            ],
            
            'cliente' => [
                // Acceso mínimo, solo para compras
                'ver productos', 'ver promociones'
            ]
        ];

        foreach ($rolePermissions as $roleName => $permissions) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $role->syncPermissions($permissions);
                $this->command->info("   • Permisos asignados al rol '{$roleName}': " . count($permissions));
            }
        }
    }

    private function assignRolesToUsers(): void
    {
        // Asignar rol admin al primer usuario (generalmente el super admin)
        $firstUser = User::first();
        if ($firstUser && !$firstUser->hasAnyRole(['admin', 'cliente', 'vendedor'])) {
            $firstUser->assignRole('admin');
            $this->command->info("   • Rol 'admin' asignado al usuario: {$firstUser->email}");
        }

        // Reasignar roles obsoletos a equivalentes modernos
        $users = User::all();
        foreach ($users as $user) {
            $rolesActuales = $user->roles->pluck('name')->toArray();
            $rolesObsoletos = ['empleado', 'organizador', 'almacenista'];
            
            // Si tiene roles obsoletos, asignar vendedor
            if (array_intersect($rolesObsoletos, $rolesActuales)) {
                // Remover roles obsoletos uno por uno
                foreach ($rolesObsoletos as $rolObsoleto) {
                    if ($user->hasRole($rolObsoleto)) {
                        $user->removeRole($rolObsoleto);
                    }
                }
                // Asignar vendedor si no lo tiene ya
                if (!$user->hasRole('vendedor')) {
                    $user->assignRole('vendedor');
                }
                $this->command->info("   • Usuario {$user->email}: roles obsoletos cambiados a 'vendedor'");
            }
            
            // Si no tiene ningún rol, asignar cliente por defecto
            if ($user->roles->isEmpty()) {
                $user->assignRole('cliente');
                $this->command->info("   • Usuario {$user->email}: asignado rol 'cliente' por defecto");
            }
        }

        $this->command->info('   • Reasignación de roles completada');
    }
} 