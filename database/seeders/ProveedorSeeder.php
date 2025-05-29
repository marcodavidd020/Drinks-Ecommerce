<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Pempresa;
use App\Models\Ppersona;
use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear proveedores empresas usando las empresas existentes
        $empresas = Pempresa::all();
        
        foreach ($empresas as $empresa) {
            Proveedor::create([
                'nombre' => $empresa->razon_social,
                'telefono' => $empresa->telefono,
                'direccion' => $empresa->direccion,
                'email' => $empresa->email,
                'tipo' => 'empresa',
                'proveedorable_id' => $empresa->id,
                'proveedorable_type' => Pempresa::class,
            ]);
        }

        // Crear proveedores personas usando personas existentes con datos completos
        $personas = Ppersona::whereNotNull('telefono')
            ->whereNotNull('email')
            ->limit(10)
            ->get();
        
        foreach ($personas as $persona) {
            Proveedor::create([
                'nombre' => $persona->nombre_completo,
                'telefono' => $persona->telefono,
                'direccion' => $persona->direccion,
                'email' => $persona->email,
                'tipo' => 'persona',
                'proveedorable_id' => $persona->id,
                'proveedorable_type' => Ppersona::class,
            ]);
        }

        // Crear algunas personas adicionales que sean proveedores
        for ($i = 1; $i <= 5; $i++) {
            $persona = Ppersona::create([
                'nombre' => 'Proveedor Persona ' . $i,
                'apellido' => 'Apellido ' . $i,
                'telefono' => '300' . rand(1000000, 9999999),
                'direccion' => 'Dirección Proveedor ' . $i,
                'email' => 'proveedor' . $i . '@example.com',
                'tipo' => 'peticion',
                'descripcion' => 'Persona que también es proveedor',
                'estado' => 'resuelto',
                'fecha_creacion' => now()->subDays(rand(30, 180)),
            ]);

            Proveedor::create([
                'nombre' => $persona->nombre_completo,
                'telefono' => $persona->telefono,
                'direccion' => $persona->direccion,
                'email' => $persona->email,
                'tipo' => 'persona',
                'proveedorable_id' => $persona->id,
                'proveedorable_type' => Ppersona::class,
            ]);
        }

        // Crear algunas empresas adicionales que sean proveedores
        for ($i = 1; $i <= 3; $i++) {
            $empresa = Pempresa::create([
                'razon_social' => 'Empresa Proveedora ' . $i . ' S.A.S.',
                'nit' => '900' . rand(100000, 999999) . '-' . $i,
                'telefono' => '601' . rand(1000000, 9999999),
                'direccion' => 'Zona Industrial ' . $i . ', Calle ' . rand(10, 99),
                'email' => 'ventas@empresa' . $i . '.com',
                'representante_legal' => 'Representante ' . $i,
            ]);

            Proveedor::create([
                'nombre' => $empresa->razon_social,
                'telefono' => $empresa->telefono,
                'direccion' => $empresa->direccion,
                'email' => $empresa->email,
                'tipo' => 'empresa',
                'proveedorable_id' => $empresa->id,
                'proveedorable_type' => Pempresa::class,
            ]);
        }

        $this->command->info('✅ Proveedores creados: ' . Proveedor::count() . ' proveedores (personas y empresas)');
    }
}
