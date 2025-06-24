<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Administrativo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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

        $empleadoRole = DB::table('rol')->where('nombre', 'empleado')->first();
        $adminRole = DB::table('rol')->where('nombre', 'admin')->first();

        foreach ($administrativosData as $administrativoData) {
            // Verificar si el usuario ya existe
            if (User::where('email', $administrativoData['email'])->exists()) {
                continue;
            }

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

            // Asignar rol apropiado
            $roleToAssign = $empleadoRole;
            if (str_contains(strtolower($administrativoData['cargo']), 'gerente')) {
                $roleToAssign = $adminRole;
            }

            if ($roleToAssign) {
                DB::table('user_rol')->insert([
                    'user_id' => $user->id,
                    'rol_id' => $roleToAssign->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Crear el registro de administrativo
            Administrativo::create([
                'user_id' => $user->id,
                'salario' => $administrativoData['salario'],
                'cargo' => $administrativoData['cargo'],
            ]);
        }

        // Crear algunos administrativos adicionales con factory (solo si no hay suficientes)
        $totalAdministrativos = Administrativo::count();
        $administrativosQueCrear = max(0, 12 - $totalAdministrativos); // Objetivo: 12 administrativos en total
        
        if ($administrativosQueCrear > 0) {
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
                ->count($administrativosQueCrear)
                ->create()
                ->each(function (User $user, int $index) use ($cargos, $empleadoRole) {
                    // Asignar rol de empleado
                    if ($empleadoRole) {
                        DB::table('user_rol')->insert([
                            'user_id' => $user->id,
                            'rol_id' => $empleadoRole->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    
                    Administrativo::create([
                        'user_id' => $user->id,
                        'salario' => fake()->randomFloat(2, 1500, 4000),
                        'cargo' => $cargos[$index] ?? 'Empleado General',
                    ]);
                });
        }
    }
}
