<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios que serán clientes
        $clientesData = [
            [
                'nombre' => 'Juan Pérez',
                'email' => 'juan.perez@example.com',
                'celular' => '+1234567890',
                'genero' => 'masculino',
                'nit' => '12345678-9'
            ],
            [
                'nombre' => 'María González',
                'email' => 'maria.gonzalez@example.com',
                'celular' => '+1234567891',
                'genero' => 'femenino',
                'nit' => '98765432-1'
            ],
            [
                'nombre' => 'Carlos Rodríguez',
                'email' => 'carlos.rodriguez@example.com',
                'celular' => '+1234567892',
                'genero' => 'masculino',
                'nit' => '11111111-1'
            ],
            [
                'nombre' => 'Ana Martínez',
                'email' => 'ana.martinez@example.com',
                'celular' => '+1234567893',
                'genero' => 'femenino',
                'nit' => '22222222-2'
            ],
            [
                'nombre' => 'Luis López',
                'email' => 'luis.lopez@example.com',
                'celular' => '+1234567894',
                'genero' => 'masculino',
                'nit' => '33333333-3'
            ]
        ];

        foreach ($clientesData as $clienteData) {
            // Crear el usuario
            $user = User::create([
                'nombre' => $clienteData['nombre'],
                'email' => $clienteData['email'],
                'celular' => $clienteData['celular'],
                'genero' => $clienteData['genero'],
                'password' => bcrypt('password123'),
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]);

            // Asignar rol de cliente
            $user->assignRole(RoleEnum::CLIENTE->value);

            // Crear el registro de cliente
            Cliente::create([
                'user_id' => $user->id,
                'nit' => $clienteData['nit'],
            ]);
        }

        // Crear algunos clientes adicionales con factory
        User::factory()
            ->count(10)
            ->create()
            ->each(function (User $user) {
                $user->assignRole(RoleEnum::CLIENTE->value);
                
                Cliente::create([
                    'user_id' => $user->id,
                    'nit' => fake()->unique()->numerify('########-#'),
                ]);
            });
    }
}
