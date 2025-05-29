<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class VentasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Cliente::all();
        $productos = Producto::all();

        if ($clientes->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay suficientes datos base. Ejecuta primero ClienteSeeder y ProductoSeeder.');
            return;
        }

        // Crear ventas de los últimos 6 meses
        for ($mes = 5; $mes >= 0; $mes--) {
            $fecha = Carbon::now()->subMonths($mes);
            $ventasEnMes = rand(15, 30); // Entre 15 y 30 ventas por mes

            for ($i = 0; $i < $ventasEnMes; $i++) {
                $fechaVenta = $fecha->copy()->addDays(rand(0, 28));
                $cliente = $clientes->random();

                // Calcular total simulado basado en productos aleatorios
                $cantidadProductos = rand(1, 6);
                $total = 0;
                
                for ($j = 0; $j < $cantidadProductos; $j++) {
                    $producto = $productos->random();
                    $cantidad = rand(1, 5);
                    $total += $cantidad * $producto->precio_venta;
                }

                // Crear nota de venta simple
                $notaVenta = NotaVenta::create([
                    'fecha' => $fechaVenta,
                    'total' => $total,
                    'estado' => $this->getRandomEstado(),
                    'observaciones' => $this->getRandomObservacion(),
                ]);

                // Crear detalles de venta para productos aleatorios
                for ($j = 0; $j < $cantidadProductos; $j++) {
                    $producto = $productos->random();
                    $cantidad = rand(1, 5);
                    $precioUnitario = $producto->precio_venta;
                    $totalLinea = $cantidad * $precioUnitario;

                    // Verificar si ya existe este producto en esta venta
                    $detalleExistente = DetalleVenta::where('nota_venta_id', $notaVenta->id)
                        ->where('producto_id', $producto->id)
                        ->first();

                    if (!$detalleExistente) {
                        DetalleVenta::create([
                            'nota_venta_id' => $notaVenta->id,
                            'producto_id' => $producto->id,
                            'cantidad' => $cantidad,
                            'precio_unitario' => $precioUnitario,
                            'total' => $totalLinea,
                        ]);
                    }
                }
            }
        }

        $this->command->info('✅ Ventas creadas: ' . NotaVenta::count() . ' ventas con ' . DetalleVenta::count() . ' detalles');
    }

    private function getRandomEstado(): string
    {
        $estados = ['pendiente', 'completada', 'cancelada'];
        $pesos = [15, 75, 10]; // Más ventas completadas

        return $this->getWeightedRandom($estados, $pesos);
    }

    private function getRandomObservacion(): ?string
    {
        $observaciones = [
            null,
            'Cliente frecuente',
            'Entrega urgente',
            'Producto con descuento especial',
            'Venta promocional',
            'Cliente preferencial',
            'Entrega a domicilio',
            'Pago contra entrega',
        ];

        return $observaciones[array_rand($observaciones)];
    }

    private function getWeightedRandom(array $items, array $weights): string
    {
        $totalWeight = array_sum($weights);
        $randomWeight = rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($items as $i => $item) {
            $currentWeight += $weights[$i];
            if ($randomWeight <= $currentWeight) {
                return $item;
            }
        }
        
        return $items[0];
    }
} 