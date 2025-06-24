<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Carrito;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetalleCarritoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $carritos = Carrito::all();
        $productos = Producto::all();

        if ($carritos->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay carritos o productos disponibles. Ejecuta primero CarritoSeeder y ProductoSeeder.');
            return;
        }

        $totalDetalles = 0;

        foreach ($carritos as $carrito) {
            // Cada carrito tiene entre 1 y 5 productos
            $cantidadProductos = rand(1, 5);
            $productosSeleccionados = $productos->random($cantidadProductos);
            
            $totalCarrito = 0;

            foreach ($productosSeleccionados as $producto) {
                $cantidad = rand(1, 10);
                $precioUnitario = $producto->precio_venta;
                $subtotal = $cantidad * $precioUnitario;
                $totalCarrito += $subtotal;

                DB::table('detalle_carrito')->insert([
                    'carrito_id' => $carrito->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotal,
                    'created_at' => $carrito->created_at,
                    'updated_at' => $carrito->updated_at,
                ]);

                $totalDetalles++;
            }

            // Actualizar el total del carrito basado en los detalles
            $carrito->update(['total' => $totalCarrito]);
        }

        $this->command->info('✅ Detalles de carrito creados: ' . $totalDetalles . ' detalles para ' . $carritos->count() . ' carritos');
    }
}
