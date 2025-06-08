<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Administrativo;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdministrativoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuarios que serán administrativos
        $administrativosData = [
            [
                'nombre' => 'Roberto Sánchez',
                'email' => 'roberto.sanchez@empresa.com',
                'celular' => '+1234567800',
                'genero' => 'masculino',
                'salario' => 3500.00,
                'cargo' => 'Gerente General'
            ],
            [
                'nombre' => 'Carmen Jiménez',
                'email' => 'carmen.jimenez@empresa.com',
                'celular' => '+1234567801',
                'genero' => 'femenino',
                'salario' => 3000.00,
                'cargo' => 'Gerente de Ventas'
            ],
            [
                'nombre' => 'Diego Morales',
                'email' => 'diego.morales@empresa.com',
                'celular' => '+1234567802',
                'genero' => 'masculino',
                'salario' => 2800.00,
                'cargo' => 'Supervisor de Inventario'
            ],
            [
                'nombre' => 'Patricia Ruiz',
                'email' => 'patricia.ruiz@empresa.com',
                'celular' => '+1234567803',
                'genero' => 'femenino',
                'salario' => 2500.00,
                'cargo' => 'Coordinadora de Atención al Cliente'
            ],
            [
                'nombre' => 'Miguel Torres',
                'email' => 'miguel.torres@empresa.com',
                'celular' => '+1234567804',
                'genero' => 'masculino',
                'salario' => 2200.00,
                'cargo' => 'Asistente Administrativo'
            ]
        ];

        foreach ($administrativosData as $administrativoData) {
            // Crear el usuario
            $user = User::create([
                'nombre' => $administrativoData['nombre'],
                'email' => $administrativoData['email'],
                'celular' => $administrativoData['celular'],
                'genero' => $administrativoData['genero'],
                'password' => bcrypt('admin123'),
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]);

            // Asignar rol de empleado por defecto
            $user->assignRole(RoleEnum::EMPLEADO->value);

            // Si es gerente, asignar rol de admin
            if (str_contains(strtolower($administrativoData['cargo']), 'gerente')) {
                $user->assignRole(RoleEnum::ADMIN->value);
            }

            // Crear el registro de administrativo
            Administrativo::create([
                'user_id' => $user->id,
                'salario' => $administrativoData['salario'],
                'cargo' => $administrativoData['cargo'],
            ]);
        }

        // Crear algunos administrativos adicionales con factory
        $cargos = [
            'Analista de Sistemas',
            'Contador',
            'Auxiliar Contable',
            'Recepcionista',
            'Coordinador de Logística',
            'Especialista en Marketing',
            'Analista de Recursos Humanos'
        ];

        User::factory()
            ->count(7)
            ->create()
            ->each(function (User $user, int $index) use ($cargos) {
                $user->assignRole(RoleEnum::EMPLEADO->value);
                
                Administrativo::create([
                    'user_id' => $user->id,
                    'salario' => fake()->randomFloat(2, 1500, 4000),
                    'cargo' => $cargos[$index] ?? 'Empleado General',
                ]);
            });
    }
}
