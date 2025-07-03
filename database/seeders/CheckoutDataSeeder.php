<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Direccion;
use App\Models\TipoPago;

class CheckoutDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌍 Creando direcciones de entrega...');
        
        // Crear direcciones de entrega
        $direcciones = [
            [
                'nombre' => 'Centro de la Ciudad',
                'longitud' => -68.1193,
                'latitud' => -16.5000,
                'referencia' => 'Plaza Murillo, cerca del Palacio de Gobierno'
            ],
            [
                'nombre' => 'Zona Sur - San Miguel',
                'longitud' => -68.0833,
                'latitud' => -16.5500,
                'referencia' => 'Av. Los Sargentos, cerca del Megacenter'
            ],
            [
                'nombre' => 'Zona Norte - El Alto',
                'longitud' => -68.1500,
                'latitud' => -16.5100,
                'referencia' => 'Ciudad Satélite, cerca del teleférico'
            ],
            [
                'nombre' => 'Zona Este - Equipetrol',
                'longitud' => -68.0500,
                'latitud' => -16.4800,
                'referencia' => 'Equipetrol Norte, cerca del centro comercial'
            ],
            [
                'nombre' => 'Zona Oeste - Cota Cota',
                'longitud' => -68.1000,
                'latitud' => -16.5200,
                'referencia' => 'Cota Cota, cerca de la Universidad'
            ]
        ];

        foreach ($direcciones as $direccionData) {
            Direccion::firstOrCreate(
                ['nombre' => $direccionData['nombre']],
                $direccionData
            );
        }

        $this->command->info('💳 Creando tipos de pago...');
        
        // Crear tipos de pago (solo 3 tipos: Tarjeta, QR, Tigo Money)
        $tiposPago = [
            ['tipo_pago' => 'Tarjeta'],
            ['tipo_pago' => 'QR'],
            ['tipo_pago' => 'Tigo Money']
        ];

        foreach ($tiposPago as $tipoPagoData) {
            TipoPago::firstOrCreate($tipoPagoData);
        }

        $this->command->info('✅ Datos de checkout creados exitosamente');
        $this->command->info('📍 Direcciones disponibles: ' . Direccion::count());
        $this->command->info('💳 Tipos de pago disponibles: ' . TipoPago::count());
    }
} 