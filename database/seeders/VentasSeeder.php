<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\ProductoAlmacen;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VentasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🔍 Iniciando VentasSeeder...');

        $clientes = Cliente::all();
        $productosAlmacen = ProductoAlmacen::with('producto')->get();

        $this->command->info('📊 Clientes encontrados: ' . $clientes->count());
        $this->command->info('📦 Productos en almacén encontrados: ' . $productosAlmacen->count());

        if ($clientes->isEmpty() || $productosAlmacen->isEmpty()) {
            $this->command->warn('No hay suficientes datos base. Ejecuta ClienteSeeder e InventarioSeeder primero.');
            return;
        }

        $totalVentas = 0;
        $totalDetalles = 0;

        DB::transaction(function () use ($clientes, $productosAlmacen, &$totalVentas, &$totalDetalles) {
            // Crear ventas de los últimos 6 meses
            for ($mes = 1; $mes >= 0; $mes--) {
                $fecha = Carbon::now()->subMonths($mes);
                $ventasEnMes = rand(15, 30); // Entre 15 y 30 ventas por mes

                $this->command->info("📅 Creando {$ventasEnMes} ventas para el mes " . $fecha->format('Y-m'));

                for ($i = 0; $i < $ventasEnMes; $i++) {
                    $fechaVenta = $fecha->copy()->addDays(rand(0, 28));

                    // Calcular total simulado basado en productos aleatorios
                    $cantidadProductos = rand(1, 6);
                    $total = 0;
                    $productosVenta = $productosAlmacen->random($cantidadProductos);

                    foreach ($productosVenta as $productoAlmacen) {
                        $cantidad = rand(1, 5);
                        $total += $cantidad * $productoAlmacen->producto->precio_venta;
                    }

                    // Crear nota de venta
                    $notaVenta = NotaVenta::create([
                        'cliente_id' => $clientes->random()->id,
                        'fecha' => $fechaVenta,
                        'total' => $total,
                        'estado' => $this->getRandomEstado(),
                        'observaciones' => $this->getRandomObservacion(),
                    ]);

                    $totalVentas++;

                    // Crear detalles de venta para los productos seleccionados
                    foreach ($productosVenta as $productoAlmacen) {
                        $cantidad = rand(1, 5);
                        $precioUnitario = $productoAlmacen->producto->precio_venta;
                        $totalLinea = $cantidad * $precioUnitario;

                        DetalleVenta::create([
                            'nota_venta_id' => $notaVenta->id,
                            'producto_almacen_id' => $productoAlmacen->id,
                            'cantidad' => $cantidad,
                            'total' => $totalLinea,
                        ]);

                        $totalDetalles++;
                    }
                }
            }
        });

        $this->command->info('✅ Ventas creadas: ' . $totalVentas . ' ventas con ' . $totalDetalles . ' detalles');
        $this->command->info('🔍 Verificando en BD: ' . NotaVenta::count() . ' ventas y ' . DetalleVenta::count() . ' detalles');
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
            'Venta mayorista',
            'Cliente corporativo',
            'Promoción aplicada',
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
