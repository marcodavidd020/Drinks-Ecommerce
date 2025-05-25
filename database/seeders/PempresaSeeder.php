<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Pempresa;
use Illuminate\Database\Seeder;

class PempresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear empresas de bebidas
        $empresas = [
            [
                'razon_social' => 'Distribuidora de Bebidas Nacionales S.A.S.',
                'nit' => '900123456-1',
                'telefono' => '601234567',
                'direccion' => 'Carrera 15 #85-32, Bogotá',
                'email' => 'ventas@bebidasnacionales.com',
                'representante_legal' => 'Carlos Eduardo Martínez',
            ],
            [
                'razon_social' => 'Importadora Premium de Licores Ltda.',
                'nit' => '800987654-2',
                'telefono' => '605987654',
                'direccion' => 'Calle 72 #10-15, Medellín',
                'email' => 'contacto@licorpremium.com',
                'representante_legal' => 'María Fernanda López',
            ],
            [
                'razon_social' => 'Jugos y Refrescos del Valle S.A.',
                'nit' => '900555777-3',
                'telefono' => '602555777',
                'direccion' => 'Avenida 6 #25-40, Cali',
                'email' => 'info@jugosdelvalle.com',
                'representante_legal' => 'Juan Pablo Rodríguez',
            ],
            [
                'razon_social' => 'Cervecería Artesanal Andina S.A.S.',
                'nit' => '900888999-4',
                'telefono' => '604888999',
                'direccion' => 'Zona Industrial Norte, Barranquilla',
                'email' => 'ventas@cervezaandina.com',
                'representante_legal' => 'Ana Carolina Herrera',
            ],
            [
                'razon_social' => 'Aguas Minerales del Pacífico Ltda.',
                'nit' => '800777666-5',
                'telefono' => '607777666',
                'direccion' => 'Carrera 10 #45-67, Buenaventura',
                'email' => 'comercial@aguaspacifico.com',
                'representante_legal' => 'Roberto Alejandro Silva',
            ],
        ];

        foreach ($empresas as $empresa) {
            Pempresa::create($empresa);
        }

        // Crear empresas adicionales usando factory
        Pempresa::factory(5)->create();
    }
}
