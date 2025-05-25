<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos básicos para usuarios
        Permission::create(['name' => 'crear-usuarios']);
        Permission::create(['name' => 'editar-usuarios']);
        Permission::create(['name' => 'eliminar-usuarios']);
        Permission::create(['name' => 'ver-usuarios']);

        // Crear permisos para clientes
        Permission::create(['name' => 'crear-clientes']);
        Permission::create(['name' => 'editar-clientes']);
        Permission::create(['name' => 'eliminar-clientes']);
        Permission::create(['name' => 'ver-clientes']);

        // Crear permisos para administrativos
        Permission::create(['name' => 'crear-administrativos']);
        Permission::create(['name' => 'editar-administrativos']);
        Permission::create(['name' => 'eliminar-administrativos']);
        Permission::create(['name' => 'ver-administrativos']);

        // Crear permisos para roles y permisos
        Permission::create(['name' => 'gestionar-roles']);
        Permission::create(['name' => 'gestionar-permisos']);

        // Crear permisos para productos e inventario
        Permission::create(['name' => 'crear-productos']);
        Permission::create(['name' => 'editar-productos']);
        Permission::create(['name' => 'eliminar-productos']);
        Permission::create(['name' => 'ver-productos']);
        Permission::create(['name' => 'gestionar-inventario']);

        // Crear permisos para categorías
        Permission::create(['name' => 'crear-categorias']);
        Permission::create(['name' => 'editar-categorias']);
        Permission::create(['name' => 'eliminar-categorias']);
        Permission::create(['name' => 'ver-categorias']);

        // Crear permisos para proveedores
        Permission::create(['name' => 'crear-proveedores']);
        Permission::create(['name' => 'editar-proveedores']);
        Permission::create(['name' => 'eliminar-proveedores']);
        Permission::create(['name' => 'ver-proveedores']);

        // Crear permisos para ventas
        Permission::create(['name' => 'crear-ventas']);
        Permission::create(['name' => 'editar-ventas']);
        Permission::create(['name' => 'eliminar-ventas']);
        Permission::create(['name' => 'ver-ventas']);

        // Crear permisos para compras
        Permission::create(['name' => 'crear-compras']);
        Permission::create(['name' => 'editar-compras']);
        Permission::create(['name' => 'eliminar-compras']);
        Permission::create(['name' => 'ver-compras']);

        // Crear permisos para carrito de compras
        Permission::create(['name' => 'gestionar-carrito']);
        Permission::create(['name' => 'realizar-compras']);

        // Crear permisos para PQRS
        Permission::create(['name' => 'crear-pqrs']);
        Permission::create(['name' => 'responder-pqrs']);
        Permission::create(['name' => 'ver-pqrs']);

        // Crear permisos para promociones
        Permission::create(['name' => 'crear-promociones']);
        Permission::create(['name' => 'editar-promociones']);
        Permission::create(['name' => 'eliminar-promociones']);
        Permission::create(['name' => 'ver-promociones']);

        // Crear permisos para ajustes de inventario
        Permission::create(['name' => 'crear-ajustes-inventario']);
        Permission::create(['name' => 'aprobar-ajustes-inventario']);
        Permission::create(['name' => 'ver-ajustes-inventario']);

        // Crear permisos generales del sistema
        Permission::create(['name' => 'acceso-dashboard']);
        Permission::create(['name' => 'ver-reportes']);
        Permission::create(['name' => 'acceso-ecommerce']);

        // Crear roles
        $superAdminRole = Role::create(['name' => 'super-admin']);
        $adminRole = Role::create(['name' => 'admin']);
        $clienteRole = Role::create(['name' => 'cliente']);
        $empleadoRole = Role::create(['name' => 'empleado']);
        $vendedorRole = Role::create(['name' => 'vendedor']);
        $almacenistaRole = Role::create(['name' => 'almacenista']);

        // Asignar todos los permisos al super-admin
        $superAdminRole->givePermissionTo(Permission::all());

        // Asignar permisos al admin
        $adminRole->givePermissionTo([
            'crear-usuarios',
            'editar-usuarios',
            'ver-usuarios',
            'crear-clientes',
            'editar-clientes',
            'ver-clientes',
            'crear-administrativos',
            'editar-administrativos',
            'ver-administrativos',
            'crear-productos',
            'editar-productos',
            'ver-productos',
            'gestionar-inventario',
            'crear-categorias',
            'editar-categorias',
            'ver-categorias',
            'crear-proveedores',
            'editar-proveedores',
            'ver-proveedores',
            'ver-ventas',
            'ver-compras',
            'responder-pqrs',
            'ver-pqrs',
            'crear-promociones',
            'editar-promociones',
            'ver-promociones',
            'aprobar-ajustes-inventario',
            'ver-ajustes-inventario',
            'acceso-dashboard',
            'ver-reportes',
            'acceso-ecommerce',
        ]);

        // Asignar permisos al cliente
        $clienteRole->givePermissionTo([
            'ver-productos',
            'gestionar-carrito',
            'realizar-compras',
            'crear-pqrs',
            'acceso-dashboard',
            'acceso-ecommerce',
        ]);

        // Asignar permisos al empleado
        $empleadoRole->givePermissionTo([
            'ver-clientes',
            'editar-clientes',
            'ver-productos',
            'ver-ventas',
            'acceso-dashboard',
        ]);

        // Asignar permisos al vendedor
        $vendedorRole->givePermissionTo([
            'ver-clientes',
            'editar-clientes',
            'ver-productos',
            'crear-ventas',
            'editar-ventas',
            'ver-ventas',
            'gestionar-carrito',
            'ver-promociones',
            'acceso-dashboard',
            'acceso-ecommerce',
        ]);

        // Asignar permisos al almacenista
        $almacenistaRole->givePermissionTo([
            'ver-productos',
            'editar-productos',
            'gestionar-inventario',
            'ver-proveedores',
            'crear-compras',
            'editar-compras',
            'ver-compras',
            'crear-ajustes-inventario',
            'ver-ajustes-inventario',
            'acceso-dashboard',
        ]);
    }
}
