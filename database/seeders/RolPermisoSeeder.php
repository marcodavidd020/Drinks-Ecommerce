<?php

namespace Database\Seeders;

use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolPermisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los roles y permisos
        $roles = Rol::all()->keyBy('nombre');
        $permisos = Permiso::all()->keyBy('nombre');

        if ($roles->isEmpty() || $permisos->isEmpty()) {
            $this->command->error('❌ Asegúrate de que RolSeeder y PermisoSeeder se ejecuten primero y contengan datos.');
            return;
        }

        // --- Asignación de permisos ---

        // ADMIN - Todos los permisos
        if ($roles->has('admin')) {
            $roles['admin']->permisos()->syncWithoutDetaching($permisos->pluck('id'));
            $this->command->info("   • Admin: " . $permisos->count() . " permisos (todos)");
        }

        // EMPLEADO - Permisos operativos
        if ($roles->has('empleado')) {
            $permisosEmpleado = $permisos->only([
                'ver_productos', 'crear_productos', 'editar_productos',
                'ver_ventas', 'crear_ventas', 'editar_ventas',
                'ver_compras', 'crear_compras',
                'ver_inventario', 'ajustar_inventario',
                'ver_promociones', 'crear_promociones', 'editar_promociones'
            ])->pluck('id');
            $roles['empleado']->permisos()->syncWithoutDetaching($permisosEmpleado);
            $this->command->info("   • Empleado: " . $permisosEmpleado->count() . " permisos operativos");
        }

        // CLIENTE - Permisos de lectura
        if ($roles->has('cliente')) {
            $permisosCliente = $permisos->only(['ver_productos', 'ver_promociones'])->pluck('id');
            $roles['cliente']->permisos()->syncWithoutDetaching($permisosCliente);
            $this->command->info("   • Cliente: " . $permisosCliente->count() . " permisos de lectura");
        }

        // ORGANIZADOR - Permisos de eventos
        if ($roles->has('organizador')) {
            $permisosOrganizador = $permisos->only([
                'ver_productos', 'ver_ventas', 'crear_ventas',
                'ver_promociones', 'crear_promociones', 'editar_promociones',
                'ver_reportes'
            ])->pluck('id');
            $roles['organizador']->permisos()->syncWithoutDetaching($permisosOrganizador);
            $this->command->info("   • Organizador: " . $permisosOrganizador->count() . " permisos de eventos");
        }

        $this->command->info('✅ Permisos asignados a roles exitosamente');
    }
}
