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
        $productos = Producto::all();

        if ($productos->isEmpty()) {
            echo "No hay productos disponibles. Ejecuta ProductoSeeder primero.\n";
            return;
        }

        foreach ($notasVenta as $notaVenta) {
            // Cada nota de venta tendrá entre 1 y 5 productos
            $numProductos = rand(1, 5);
            $productosSeleccionados = $productos->random($numProductos);
            $totalVenta = 0;

            foreach ($productosSeleccionados as $producto) {
                $cantidad = rand(1, 3);
                $precioUnitario = $producto->precio_venta;
                $total = $cantidad * $precioUnitario;
                $totalVenta += $total;

                DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'total' => $total,
                ]);
            }

            // Actualizar el total de la nota de venta
            $notaVenta->update(['total' => $totalVenta]);
        }
    }
}
