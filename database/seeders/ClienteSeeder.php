<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('👥 Poblando Clientes...');

        // Crear usuarios clientes específicos
        $clientes = [
            [
                'nombre' => 'Juan Pérez Cliente',
                'email' => 'cliente1@example.com',
                'password' => Hash::make('cliente123'),
                'celular' => '+591 70987654',
                'genero' => 'masculino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'nit' => '12345678-9'
            ],
            [
                'nombre' => 'María González VIP',
                'email' => 'cliente2@example.com',
                'password' => Hash::make('cliente123'),
                'celular' => '+591 70876543',
                'genero' => 'femenino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'nit' => '98765432-1'
            ],
            [
                'nombre' => 'Carlos Rodríguez Empresa',
                'email' => 'cliente3@example.com',
                'password' => Hash::make('cliente123'),
                'celular' => '+591 70765432',
                'genero' => 'masculino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'nit' => '11111111-1'
            ],
            [
                'nombre' => 'Ana Martínez Frecuente',
                'email' => 'cliente4@example.com',
                'password' => Hash::make('cliente123'),
                'celular' => '+591 70654321',
                'genero' => 'femenino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'nit' => '22222222-2'
            ],
            [
                'nombre' => 'Luis López Regular',
                'email' => 'cliente5@example.com',
                'password' => Hash::make('cliente123'),
                'celular' => '+591 70543210',
                'genero' => 'masculino',
                'estado' => 'activo',
                'email_verified_at' => now(),
                'nit' => '33333333-3'
            ]
        ];

        foreach ($clientes as $clienteData) {
            // Verificar si el usuario ya existe
            $existingUser = User::where('email', $clienteData['email'])->first();
            
            if (!$existingUser) {
                // Crear usuario
                $userData = $clienteData;
                $nit = $userData['nit'];
                unset($userData['nit']);
                
                $user = User::create($userData);
                
                // Crear registro de cliente
                Cliente::create([
                    'user_id' => $user->id,
                    'nit' => $nit,
                ]);
                
                // Asignar rol usando Spatie
                $user->assignRole('cliente');
                
                $this->command->info("   • Cliente creado: {$user->nombre}");
            } else {
                $this->command->info("   • Usuario ya existe: {$clienteData['email']}");
            }
        }

        // Crear clientes adicionales con Factory
        $clientesAdicionales = 15; // Total de clientes adicionales
        
        for ($i = 0; $i < $clientesAdicionales; $i++) {
            $user = User::factory()->create([
                'estado' => 'activo'
            ]);
            
            Cliente::factory()->create([
                'user_id' => $user->id,
            ]);
            
            // Asignar rol usando Spatie
            $user->assignRole('cliente');
        }

        $this->command->info('   ✅ Clientes poblados correctamente');
    }
}
