<?php

namespace Database\Seeders;

use App\Models\DetalleVenta;
use App\Models\NotaVenta;
use App\Models\Producto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DetalleVentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notasVenta = NotaVenta::where('estado', 'completada')->get();
        $productosAlmacen = \App\Models\ProductoAlmacen::with('producto')->get();

        if ($productosAlmacen->isEmpty()) {
            echo "No hay productos en almacén disponibles. Ejecuta InventarioSeeder primero.\n";
            return;
        }

        foreach ($notasVenta as $notaVenta) {
            // Cada nota de venta tendrá entre 1 y 5 productos
            $numProductos = rand(1, 5);
            $productosSeleccionados = $productosAlmacen->random($numProductos);
            $totalVenta = 0;

            foreach ($productosSeleccionados as $productoAlmacen) {
                $cantidad = rand(1, 3);
                $precioUnitario = $productoAlmacen->producto->precio_venta;
                $total = $cantidad * $precioUnitario;
                $totalVenta += $total;

                DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $cantidad,
                    'total' => $total,
                ]);
            }

            // Actualizar el total de la nota de venta
            $notaVenta->update(['total' => $totalVenta]);
        }
    }
}
