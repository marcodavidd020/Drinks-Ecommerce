<?php

namespace Database\Seeders;

use App\Models\Permiso;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permisos = [
            // Permisos de usuarios
            ['nombre' => 'ver_usuarios'],
            ['nombre' => 'crear_usuarios'],
            ['nombre' => 'editar_usuarios'],
            ['nombre' => 'eliminar_usuarios'],
            
            // Permisos de productos
            ['nombre' => 'ver_productos'],
            ['nombre' => 'crear_productos'],
            ['nombre' => 'editar_productos'],
            ['nombre' => 'eliminar_productos'],
            
            // Permisos de ventas
            ['nombre' => 'ver_ventas'],
            ['nombre' => 'crear_ventas'],
            ['nombre' => 'editar_ventas'],
            ['nombre' => 'eliminar_ventas'],
            
            // Permisos de compras
            ['nombre' => 'ver_compras'],
            ['nombre' => 'crear_compras'],
            ['nombre' => 'editar_compras'],
            ['nombre' => 'eliminar_compras'],
            
            // Permisos de promociones
            ['nombre' => 'ver_promociones'],
            ['nombre' => 'crear_promociones'],
            ['nombre' => 'editar_promociones'],
            ['nombre' => 'eliminar_promociones'],
            
            // Permisos de inventario
            ['nombre' => 'ver_inventario'],
            ['nombre' => 'ajustar_inventario'],
            
            // Permisos de reportes
            ['nombre' => 'ver_reportes'],
            ['nombre' => 'generar_reportes'],
            
            // Permisos administrativos
            ['nombre' => 'configurar_sistema'],
            ['nombre' => 'gestionar_roles'],
            ['nombre' => 'gestionar_permisos'],
        ];

        foreach ($permisos as $permiso) {
            Permiso::updateOrCreate(['nombre' => $permiso['nombre']], $permiso);
        }
        
        $this->command->info('✅ Permisos básicos del sistema creados exitosamente');
    }
}
