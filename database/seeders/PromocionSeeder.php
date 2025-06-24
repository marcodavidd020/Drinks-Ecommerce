<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Promocion;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PromocionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener productos disponibles
        $productos = Producto::all();

        if ($productos->isEmpty()) {
            $this->command->warn('No hay productos disponibles para crear promociones. Ejecuta ProductoSeeder primero.');
            return;
        }

        // Crear promociones específicas para cada producto
        $promocionesData = [
            [
                'nombre' => 'Black Friday Coca-Cola',
                'fecha_inicio' => Carbon::now()->subDays(30),
                'fecha_fin' => Carbon::now()->addDays(5),
                'descuento' => '30% de descuento',
                'producto_codigo' => 'REF001'
            ],
            [
                'nombre' => 'Descuento Jugo de Mango',
                'fecha_inicio' => Carbon::now()->subDays(15),
                'fecha_fin' => Carbon::now()->addDays(15),
                'descuento' => '25% de descuento',
                'producto_codigo' => 'JUG002'
            ],
            [
                'nombre' => 'Promoción Agua Mineral',
                'fecha_inicio' => Carbon::now()->subDays(5),
                'fecha_fin' => Carbon::now()->addDays(25),
                'descuento' => 'Compra 2 lleva 3',
                'producto_codigo' => 'AGU001'
            ],
            [
                'nombre' => 'Oferta Red Bull',
                'fecha_inicio' => Carbon::now()->addDays(10),
                'fecha_fin' => Carbon::now()->addDays(40),
                'descuento' => '$5 de descuento',
                'producto_codigo' => 'ENE001'
            ],
            [
                'nombre' => 'Happy Hour Cerveza',
                'fecha_inicio' => Carbon::now()->subDays(20),
                'fecha_fin' => Carbon::now()->subDays(5),
                'descuento' => '2x1 en cerveza nacional',
                'producto_codigo' => 'CER001'
            ],
            [
                'nombre' => 'Promoción Vino Premium',
                'fecha_inicio' => Carbon::now()->addDays(5),
                'fecha_fin' => Carbon::now()->addDays(35),
                'descuento' => '15% de descuento en vinos',
                'producto_codigo' => 'VIN001'
            ],
        ];

        $count = 0;
        foreach ($promocionesData as $promocionData) {
            // Buscar producto por código
            $producto = $productos->where('cod_producto', $promocionData['producto_codigo'])->first();
            
            if ($producto && !Promocion::where('nombre', $promocionData['nombre'])->exists()) {
                Promocion::create([
                    'nombre' => $promocionData['nombre'],
                    'fecha_inicio' => $promocionData['fecha_inicio'],
                    'fecha_fin' => $promocionData['fecha_fin'],
                    'descuento' => $promocionData['descuento'],
                    'producto_id' => $producto->id,
                ]);
                $count++;
            }
        }

        // Crear promociones adicionales para productos restantes
        $productosRestantes = $productos->whereNotIn('cod_producto', array_column($promocionesData, 'producto_codigo'));
        
        foreach ($productosRestantes->take(5) as $producto) {
            if (!Promocion::where('producto_id', $producto->id)->exists()) {
                Promocion::create([
                    'nombre' => 'Promoción Especial ' . $producto->nombre,
                    'fecha_inicio' => Carbon::now()->subDays(rand(1, 30)),
                    'fecha_fin' => Carbon::now()->addDays(rand(10, 60)),
                    'descuento' => rand(10, 40) . '% de descuento',
                    'producto_id' => $producto->id,
                ]);
                $count++;
            }
        }

        $this->command->info("✅ {$count} promociones creadas exitosamente!");
        $this->command->info('   - Promociones activas, pendientes y vencidas');
        $this->command->info('   - Cada promoción asociada a un producto específico');
    }
} 