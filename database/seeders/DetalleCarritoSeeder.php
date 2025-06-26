<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Carrito;
use App\Models\ProductoAlmacen;
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
        $productosAlmacen = ProductoAlmacen::with('producto')->get();

        if ($carritos->isEmpty() || $productosAlmacen->isEmpty()) {
            $this->command->warn('No hay carritos o productos en almacén. Ejecuta CarritoSeeder e InventarioSeeder.');
            return;
        }

        $totalDetalles = 0;

        foreach ($carritos as $carrito) {
            $cantidadProductos = rand(1, 5);
            $productosSeleccionados = $productosAlmacen->random($cantidadProductos);
            
            $totalCarrito = 0;

            foreach ($productosSeleccionados as $productoAlmacen) {
                $cantidad = rand(1, 3); // Cantidades más realistas para un carrito
                $precioUnitario = $productoAlmacen->producto->precio_venta;
                $subtotal = $cantidad * $precioUnitario;
                $totalCarrito += $subtotal;

                DB::table('detalle_carrito')->insert([
                    'carrito_id' => $carrito->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotal,
                    'created_at' => $carrito->created_at,
                    'updated_at' => $carrito->updated_at,
                ]);

                $totalDetalles++;
            }

            $carrito->update(['total' => $totalCarrito]);
        }

        $this->command->info('✅ Detalles de carrito creados: ' . $totalDetalles . ' detalles para ' . $carritos->count() . ' carritos');
    }
}
