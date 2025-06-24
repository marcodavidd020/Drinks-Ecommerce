<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Implementa el patrón register@/migrations para crear cliente con ID
     */
    public function run(): void
    {
        // Obtener roles
        $rolAdmin = DB::table('rol')->where('nombre', 'admin')->first();
        $rolCliente = DB::table('rol')->where('nombre', 'cliente')->first();
        $rolEmpleado = DB::table('rol')->where('nombre', 'empleado')->first();

        if (!$rolAdmin || !$rolCliente || !$rolEmpleado) {
            $this->command->error('❌ Los roles no están creados. Ejecuta RolSeeder primero.');
            return;
        }

        // Obtener todos los usuarios
        $users = DB::table('user')->get();

        foreach ($users as $user) {
            // Determinar rol basado en email o crear cliente automático
            $rolId = $this->determinarRol($user, $rolAdmin, $rolCliente, $rolEmpleado);
            
            // Insertar en user_rol si no existe
            $exists = DB::table('user_rol')
                ->where('user_id', $user->id)
                ->where('rol_id', $rolId)
                ->exists();

            if (!$exists) {
                DB::table('user_rol')->insert([
                    'user_id' => $user->id,
                    'rol_id' => $rolId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info("✅ Rol asignado a {$user->email}");
            }

            // Si es cliente, asegurar que existe en tabla clientes (register@/migrations pattern)
            if ($rolId == $rolCliente->id) {
                $this->crearClienteSiNoExiste($user);
            }
        }
    }

    /**
     * Determina el rol del usuario basado en su email
     */
    private function determinarRol($user, $rolAdmin, $rolCliente, $rolEmpleado)
    {
        $email = $user->email;
        
        if (str_contains($email, 'admin') || str_contains($email, 'sistema')) {
            return $rolAdmin->id;
        }
        
        if (str_contains($email, 'empleado') || str_contains($email, 'staff')) {
            return $rolEmpleado->id;
        }
        
        // Por defecto, asignar rol cliente (register@/migrations pattern)
        return $rolCliente->id;
    }

    /**
     * Crear cliente si no existe (patrón register@/migrations)
     */
    private function crearClienteSiNoExiste($user)
    {
        $exists = DB::table('cliente')->where('user_id', $user->id)->exists();
        
        if (!$exists) {
            DB::table('cliente')->insert([
                'user_id' => $user->id,
                'nit' => 'AUTO-' . $user->id, // NIT automático
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $this->command->info("🏪 Cliente creado automáticamente para {$user->email}");
        }
    }
}
