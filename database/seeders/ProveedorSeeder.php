<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear proveedores de tipo 'empresa'
        $this->command->info('Creando proveedores de tipo Empresa...');
        $empresas = [
            [
                'razon_social' => 'Distribuidora de Bebidas Nacional S.A.', 
                'telefono' => '+57-1-2234567', 
                'email' => 'ventas@bebidasnacional.com'
            ],
            [
                'razon_social' => 'Importadora de Licores Premium', 
                'telefono' => '+57-1-2345678', 
                'email' => 'contacto@licorpremium.com'
            ],
        ];

        foreach ($empresas as $empresa) {
            Proveedor::updateOrCreate(
                ['email' => $empresa['email']],
                array_merge($empresa, ['tipo' => 'empresa'])
            );
        }

        // Crear proveedores de tipo 'persona'
        $this->command->info('Creando proveedores de tipo Persona...');
        for ($i = 0; $i < 10; $i++) {
            Proveedor::create([
                'tipo' => 'persona',
                'nombre' => fake()->firstName(),
                'apellido' => fake()->lastName(),
                'telefono' => fake()->e164PhoneNumber(),
                'email' => fake()->unique()->safeEmail(),
            ]);
        }

        $this->command->info('✅ Proveedores creados: ' . Proveedor::count());
    }
}
