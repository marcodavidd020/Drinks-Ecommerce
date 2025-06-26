<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Pempresa;
use App\Models\Persona;
use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear proveedores a partir de las empresas existentes
        $this->command->info('Creando proveedores desde Pempresas...');
        $empresas = Pempresa::all();
        foreach ($empresas as $empresa) {
            Proveedor::updateOrCreate(
                [
                    'proveedorable_id' => $empresa->id,
                    'proveedorable_type' => Pempresa::class,
                ],
                [
                'nombre' => $empresa->razon_social,
                'telefono' => $empresa->telefono,
                'direccion' => $empresa->direccion,
                'email' => $empresa->email,
                'tipo' => 'empresa',
                ]
            );
        }

        // Crear proveedores a partir de las personas existentes
        $this->command->info('Creando proveedores desde Personas...');
        $personas = Persona::limit(10)->get();
        foreach ($personas as $persona) {
            Proveedor::updateOrCreate(
                [
                'proveedorable_id' => $persona->id,
                'proveedorable_type' => Persona::class,
                ],
                [
                    'nombre' => $persona->nombre . ' ' . $persona->apellido,
                'telefono' => fake()->e164PhoneNumber(),
                'direccion' => fake()->address(),
                'email' => fake()->unique()->safeEmail(),
                'tipo' => 'persona',
                ]
            );
        }

        $this->command->info('✅ Proveedores creados: ' . Proveedor::count() . ' proveedores (personas y empresas)');
    }
}
