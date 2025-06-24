<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolPermisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener roles
        $roles = DB::table('rol')->get()->keyBy('nombre');
        
        // Obtener permisos
        $permisos = DB::table('permiso')->get()->keyBy('nombre');
        
        if ($roles->isEmpty() || $permisos->isEmpty()) {
            $this->command->error('❌ Asegúrate de que RolSeeder y PermisoSeeder se ejecuten primero');
            return;
        }

        $rolPermisos = [];
        
        // ADMIN - Todos los permisos
        if ($roles->has('admin')) {
            foreach ($permisos as $permiso) {
                $rolPermisos[] = [
                    'rol_id' => $roles['admin']->id,
                    'permiso_id' => $permiso->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // EMPLEADO - Permisos limitados
        if ($roles->has('empleado')) {
            $permisosEmpleado = [
                'ver_productos', 'crear_productos', 'editar_productos',
                'ver_ventas', 'crear_ventas', 'editar_ventas',
                'ver_compras', 'crear_compras',
                'ver_inventario', 'ajustar_inventario',
                'ver_promociones', 'crear_promociones', 'editar_promociones'
            ];
            
            foreach ($permisosEmpleado as $nombrePermiso) {
                if ($permisos->has($nombrePermiso)) {
                    $rolPermisos[] = [
                        'rol_id' => $roles['empleado']->id,
                        'permiso_id' => $permisos[$nombrePermiso]->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        // CLIENTE - Permisos muy limitados
        if ($roles->has('cliente')) {
            $permisosCliente = [
                'ver_productos',
                'ver_promociones'
            ];
            
            foreach ($permisosCliente as $nombrePermiso) {
                if ($permisos->has($nombrePermiso)) {
                    $rolPermisos[] = [
                        'rol_id' => $roles['cliente']->id,
                        'permiso_id' => $permisos[$nombrePermiso]->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        // ORGANIZADOR - Permisos específicos para eventos
        if ($roles->has('organizador')) {
            $permisosOrganizador = [
                'ver_productos', 'ver_ventas', 'crear_ventas',
                'ver_promociones', 'crear_promociones', 'editar_promociones',
                'ver_reportes'
            ];
            
            foreach ($permisosOrganizador as $nombrePermiso) {
                if ($permisos->has($nombrePermiso)) {
                    $rolPermisos[] = [
                        'rol_id' => $roles['organizador']->id,
                        'permiso_id' => $permisos[$nombrePermiso]->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Insertar todas las relaciones
        if (!empty($rolPermisos)) {
            DB::table('rol_permiso')->insert($rolPermisos);
            $this->command->info('✅ Permisos asignados a roles exitosamente');
            $this->command->info('   • Admin: ' . count($permisos) . ' permisos (todos)');
            $this->command->info('   • Empleado: Permisos operativos');
            $this->command->info('   • Cliente: Permisos de lectura');
            $this->command->info('   • Organizador: Permisos de eventos');
        }
    }
}
