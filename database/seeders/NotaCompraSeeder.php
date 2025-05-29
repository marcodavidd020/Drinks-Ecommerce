<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NotaCompra;
use App\Models\Proveedor;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class NotaCompraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $proveedores = Proveedor::all();
        $productos = Producto::all();

        if ($proveedores->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay suficientes datos base. Ejecuta primero ProveedorSeeder y ProductoSeeder.');
            return;
        }

        // Crear notas de compra de los últimos 4 meses
        for ($mes = 3; $mes >= 0; $mes--) {
            $fecha = Carbon::now()->subMonths($mes);
            $comprasEnMes = rand(8, 15); // Entre 8 y 15 compras por mes

            for ($i = 0; $i < $comprasEnMes; $i++) {
                $fechaCompra = $fecha->copy()->addDays(rand(0, 28));
                $proveedor = $proveedores->random();
                
                // Calcular cantidad de productos y monto total
                $cantidadProductos = rand(2, 8);
                $montoTotal = 0;
                
                for ($j = 0; $j < $cantidadProductos; $j++) {
                    $producto = $productos->random();
                    $cantidad = rand(10, 100);
                    $precioCompra = $producto->precio_venta * 0.6; // 60% del precio de venta
                    $montoTotal += $cantidad * $precioCompra;
                }

                NotaCompra::create([
                    'proveedor_id' => $proveedor->id,
                    'fecha' => $fechaCompra,
                    'total' => $montoTotal,
                    'estado' => $this->getRandomEstado($fechaCompra),
                    'created_at' => $fechaCompra,
                    'updated_at' => $fechaCompra->copy()->addHours(rand(1, 24)),
                ]);
            }
        }

        $this->command->info('✅ Notas de compra creadas: ' . NotaCompra::count() . ' registros');
    }

    private function getRandomEstado(Carbon $fechaCreacion): string
    {
        $diasTranscurridos = Carbon::now()->diffInDays($fechaCreacion);
        
        if ($diasTranscurridos > 30) {
            // Compras antiguas: mayoría recibidas
            return ['recibida', 'recibida', 'cancelada'][array_rand(['recibida', 'recibida', 'cancelada'])];
        } elseif ($diasTranscurridos > 7) {
            // Compras recientes: algunas pendientes, algunas recibidas
            return ['pendiente', 'recibida'][array_rand(['pendiente', 'recibida'])];
        } else {
            // Compras muy recientes: mayoría pendientes
            return ['pendiente', 'pendiente', 'recibida'][array_rand(['pendiente', 'pendiente', 'recibida'])];
        }
    }
}
