<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permisos = [
            // Permisos de usuarios
            ['nombre' => 'ver_usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_usuarios', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_usuarios', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de productos
            ['nombre' => 'ver_productos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_productos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_productos', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_productos', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de ventas
            ['nombre' => 'ver_ventas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_ventas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_ventas', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_ventas', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de compras
            ['nombre' => 'ver_compras', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_compras', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_compras', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_compras', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de promociones
            ['nombre' => 'ver_promociones', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'crear_promociones', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'editar_promociones', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'eliminar_promociones', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de inventario
            ['nombre' => 'ver_inventario', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'ajustar_inventario', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos de reportes
            ['nombre' => 'ver_reportes', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'generar_reportes', 'created_at' => now(), 'updated_at' => now()],
            
            // Permisos administrativos
            ['nombre' => 'configurar_sistema', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'gestionar_roles', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'gestionar_permisos', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('permiso')->insert($permisos);
        
        $this->command->info('✅ Permisos básicos del sistema creados exitosamente');
    }
}
