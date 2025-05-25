<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Pempresa;
use App\Models\Pqrsona;
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
        $empresas = Pempresa::take(3)->get();
        
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

        // Crear proveedores personas usando algunas personas existentes
        $personas = Pqrsona::take(2)->get();
        
        foreach ($personas as $persona) {
            Proveedor::create([
                'nombre' => $persona->nombre_completo,
                'telefono' => $persona->telefono,
                'direccion' => $persona->direccion,
                'email' => $persona->email,
                'tipo' => 'persona',
                'proveedorable_id' => $persona->id,
                'proveedorable_type' => Pqrsona::class,
            ]);
        }

        // Crear proveedores adicionales usando factory
        Proveedor::factory(3)->empresa()->create();
        Proveedor::factory(2)->persona()->create();
    }
}
