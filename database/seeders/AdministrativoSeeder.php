<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Administrativo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class AdministrativoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('👨‍💼 Poblando Administrativos...');

        // Crear usuarios administrativos específicos
        $administrativos = [
            [
                'nombre' => 'Juan Carlos Administrador',
                'email' => 'admin@empresa.com',
                'password' => Hash::make('admin123'),
                'celular' => '+591 70123456',
                'genero' => 'masculino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'admin_data' => [
                    'cargo' => 'Administrador General',
                    'salario' => 8500.00,
                ],
                'role' => 'admin'
            ],
            [
                'nombre' => 'María Elena Gestora',
                'email' => 'empleado1@empresa.com',
                'password' => Hash::make('empleado123'),
                'celular' => '+591 70234567',
                'genero' => 'femenino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'admin_data' => [
                    'cargo' => 'Jefe de Operaciones',
                    'salario' => 6500.00,
                ],
                'role' => 'admin'
            ],
            [
                'nombre' => 'Carlos Organización',
                'email' => 'organizador@empresa.com',
                'password' => Hash::make('organizador123'),
                'celular' => '+591 70345678',
                'genero' => 'masculino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'admin_data' => [
                    'cargo' => 'Coordinador de Eventos',
                    'salario' => 5500.00,
                ],
                'role' => 'vendedor'
            ]
        ];

        foreach ($administrativos as $adminData) {
            // Verificar si el usuario ya existe
            $existingUser = User::where('email', $adminData['email'])->first();
            
            if (!$existingUser) {
                // Crear usuario
                $userData = $adminData;
                unset($userData['admin_data'], $userData['role']);
                
                $user = User::create($userData);
                
                // Crear registro administrativo
                Administrativo::create([
                    'user_id' => $user->id,
                    'cargo' => $adminData['admin_data']['cargo'],
                    'salario' => $adminData['admin_data']['salario'],
                ]);
                
                // Asignar rol usando Spatie
                $user->assignRole($adminData['role']);
                
                $this->command->info("   • Administrativo creado: {$user->nombre} ({$adminData['role']})");
            } else {
                $this->command->info("   • Usuario ya existe: {$adminData['email']}");
            }
        }

        // Crear administrativos adicionales con Factory
        $roles = ['admin', 'vendedor'];
        $cargos = [
            'admin' => ['Supervisor de Ventas', 'Jefe de Almacén', 'Contador', 'Asistente Administrativo'],
            'vendedor' => ['Coordinador de Marketing', 'Gestor de Eventos', 'Especialista en Promociones', 'Vendedor Senior']
        ];

        for ($i = 0; $i < 8; $i++) {
            $role = $roles[array_rand($roles)];
            $cargo = $cargos[$role][array_rand($cargos[$role])];
            
            $user = User::factory()->create([
                'estado' => 'activo'
            ]);
            
            Administrativo::factory()->create([
                'user_id' => $user->id,
                'cargo' => $cargo,
            ]);
            
            // Asignar rol usando Spatie
            $user->assignRole($role);
        }

        $this->command->info('   ✅ Administrativos poblados correctamente');
    }
}
