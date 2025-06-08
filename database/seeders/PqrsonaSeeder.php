<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Pqrsona;
use Illuminate\Database\Seeder;

class PqrsonaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear PQRS relacionadas con tienda de bebidas
        $pqrs = [
            [
                'nombre' => 'Ana',
                'apellido' => 'Rodríguez',
                'telefono' => '3001234567',
                'direccion' => 'Calle 50 #12-34, Bogotá',
                'email' => 'ana.rodriguez@email.com',
                'tipo' => 'peticion',
                'descripcion' => 'Solicito información sobre bebidas sin alcohol disponibles para eventos corporativos.',
                'estado' => 'pendiente',
                'fecha_creacion' => now()->subDays(5)->toDateString(),
            ],
            [
                'nombre' => 'Carlos',
                'apellido' => 'Mendoza',
                'telefono' => '3109876543',
                'direccion' => 'Carrera 20 #45-67, Medellín',
                'email' => 'carlos.mendoza@email.com',
                'tipo' => 'queja',
                'descripcion' => 'Compré una caja de cervezas y varias botellas estaban vencidas. Necesito solución inmediata.',
                'estado' => 'pendiente',
                'fecha_creacion' => now()->subDays(3)->toDateString(),
            ],
            [
                'nombre' => 'María',
                'apellido' => 'González',
                'telefono' => '3205551234',
                'direccion' => 'Avenida 30 #78-90, Cali',
                'email' => 'maria.gonzalez@email.com',
                'tipo' => 'reclamo',
                'descripcion' => 'Pedí jugos naturales con entrega refrigerada y llegaron a temperatura ambiente, perdiendo calidad.',
                'estado' => 'resuelto',
                'fecha_creacion' => now()->subDays(10)->toDateString(),
                'fecha_respuesta' => now()->subDays(2)->toDateString(),
                'respuesta' => 'Hemos reemplazado su pedido y mejorado nuestro sistema de entrega refrigerada.',
            ],
            [
                'nombre' => 'Luis',
                'apellido' => 'Herrera',
                'telefono' => '3157778888',
                'direccion' => 'Calle 80 #15-25, Barranquilla',
                'email' => 'luis.herrera@email.com',
                'tipo' => 'sugerencia',
                'descripcion' => 'Sugiero incluir más variedad de bebidas energéticas orgánicas y bebidas funcionales.',
                'estado' => 'pendiente',
                'fecha_creacion' => now()->subDays(1)->toDateString(),
            ],
            [
                'nombre' => 'Sandra',
                'apellido' => 'Morales',
                'telefono' => '3169998877',
                'direccion' => 'Carrera 7 #20-15, Cartagena',
                'email' => 'sandra.morales@email.com',
                'tipo' => 'peticion',
                'descripcion' => 'Necesito cotización para suministro mensual de agua mineral para mi empresa.',
                'estado' => 'pendiente',
                'fecha_creacion' => now()->subDays(2)->toDateString(),
            ],
        ];

        foreach ($pqrs as $pqr) {
            Pqrsona::create($pqr);
        }

        // Crear PQRS adicionales usando factory
        Pqrsona::factory(6)->create();
    }
}
