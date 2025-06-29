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

        // Definir todos los permisos
        $permissionsList = [
            // Usuarios
            'crear-usuarios', 'editar-usuarios', 'eliminar-usuarios', 'ver-usuarios',
            
            // Clientes
            'crear-clientes', 'editar-clientes', 'eliminar-clientes', 'ver-clientes',
            
            // Administrativos
            'crear-administrativos', 'editar-administrativos', 'eliminar-administrativos', 'ver-administrativos',
            
            // Roles y permisos
            'gestionar-roles', 'gestionar-permisos',
            
            // Productos e inventario
            'crear-productos', 'editar-productos', 'eliminar-productos', 'ver-productos', 'gestionar-inventario',
            
            // Categorías
            'crear-categorias', 'editar-categorias', 'eliminar-categorias', 'ver-categorias',
            
            // Proveedores
            'crear-proveedores', 'editar-proveedores', 'eliminar-proveedores', 'ver-proveedores',
            
            // Ventas
            'crear-ventas', 'editar-ventas', 'eliminar-ventas', 'ver-ventas',
            
            // Compras
            'crear-compras', 'editar-compras', 'eliminar-compras', 'ver-compras',
            
            // Carrito de compras
            'gestionar-carrito', 'realizar-compras',
            
            // PQRS
            'crear-pqrs', 'responder-pqrs', 'ver-pqrs',
            
            // Promociones
            'crear-promociones', 'editar-promociones', 'eliminar-promociones', 'ver-promociones',
            
            // Ajustes de inventario
            'crear-ajustes-inventario', 'aprobar-ajustes-inventario', 'ver-ajustes-inventario',
            
            // Generales del sistema
            'acceso-dashboard', 'ver-reportes', 'acceso-ecommerce',
        ];

        // Crear permisos solo si no existen
        foreach ($permissionsList as $permissionName) {
            if (!Permission::where('name', $permissionName)->exists()) {
                Permission::create(['name' => $permissionName]);
            }
        }

        // Crear roles solo si no existen
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $clienteRole = Role::firstOrCreate(['name' => 'cliente']);
        $empleadoRole = Role::firstOrCreate(['name' => 'empleado']);
        $vendedorRole = Role::firstOrCreate(['name' => 'vendedor']);
        $almacenistaRole = Role::firstOrCreate(['name' => 'almacenista']);

        // Asignar todos los permisos al admin
        $adminRole->givePermissionTo(Permission::all());

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
