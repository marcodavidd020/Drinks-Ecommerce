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
                'name' => 'empleado',
                'description' => 'Empleado con acceso a operaciones principales'
            ],
            [
                'name' => 'cliente',
                'description' => 'Cliente del sistema con acceso limitado'
            ],
            [
                'name' => 'organizador',
                'description' => 'Organizador de eventos y promociones'
            ],
            [
                'name' => 'vendedor',
                'description' => 'Vendedor con acceso a ventas y clientes'
            ],
            [
                'name' => 'almacenista',
                'description' => 'Encargado del inventario y almacén'
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
            
            'empleado' => [
                // Operaciones principales del negocio
                'ver clientes', 'crear clientes', 'editar clientes',
                'gestionar productos', 'crear productos', 'editar productos', 'ver productos',
                'gestionar categorias', 'crear categorias', 'editar categorias', 'ver categorias',
                'gestionar proveedores', 'crear proveedores', 'editar proveedores', 'ver proveedores',
                'gestionar compras', 'crear compras', 'editar compras', 'ver compras',
                'gestionar inventario', 'ajustar inventario', 'ver inventario',
                'ver dashboard'
            ],
            
            'organizador' => [
                // Enfoque en clientes, ventas y promociones
                'gestionar clientes', 'crear clientes', 'editar clientes', 'ver clientes',
                'ver productos', 'editar productos',
                'gestionar ventas', 'crear ventas', 'ver ventas',
                'gestionar promociones', 'crear promociones', 'editar promociones', 'eliminar promociones', 'ver promociones',
                'ver dashboard', 'ver reportes'
            ],
            
            'vendedor' => [
                // Enfoque en ventas y atención al cliente
                'ver clientes', 'crear clientes', 'editar clientes',
                'ver productos',
                'gestionar ventas', 'crear ventas', 'ver ventas',
                'ver promociones',
                'ver dashboard'
            ],
            
            'almacenista' => [
                // Enfoque en inventario y productos
                'ver productos', 'editar productos',
                'gestionar inventario', 'ajustar inventario', 'ver inventario',
                'ver compras',
                'ver dashboard'
            ],
            
            'cliente' => [
                // Acceso mínimo, solo visualización de productos
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
        // Solo asignar roles si los usuarios no tienen roles ya asignados
        $usersWithoutRoles = User::doesntHave('roles')->get();
        
        if ($usersWithoutRoles->isEmpty()) {
            $this->command->info('   • Todos los usuarios ya tienen roles asignados');
            return;
        }

        // Asignar rol de cliente por defecto a usuarios sin roles
        foreach ($usersWithoutRoles as $user) {
            $user->assignRole('cliente');
        }

        $this->command->info('   • Usuarios sin roles asignados como clientes: ' . $usersWithoutRoles->count());
        
        // Asignar primer usuario como admin si no hay ningún admin
        $admins = User::role('admin')->count();
        if ($admins === 0) {
            $firstUser = User::first();
            if ($firstUser) {
                $firstUser->syncRoles(['admin']);
                $this->command->info("   • Primer usuario asignado como admin: {$firstUser->email}");
            }
        }
    }
} 