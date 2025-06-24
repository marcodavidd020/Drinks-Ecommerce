<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NotaCompra;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetalleCompraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notasCompra = NotaCompra::all();
        $productos = Producto::all();

        if ($notasCompra->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay notas de compra o productos disponibles. Ejecuta primero NotaCompraSeeder y ProductoSeeder.');
            return;
        }

        $totalDetalles = 0;

        foreach ($notasCompra as $notaCompra) {
            // Cada nota de compra tiene entre 2 y 8 productos diferentes
            $cantidadProductos = rand(2, 8);
            $productosSeleccionados = $productos->random($cantidadProductos);
            
            $totalCompra = 0;

            foreach ($productosSeleccionados as $producto) {
                $cantidad = rand(10, 100); // Cantidades de compra al por mayor
                $precioCompra = $producto->precio_venta * rand(50, 75) / 100; // 50-75% del precio de venta
                $total = $cantidad * $precioCompra;
                $totalCompra += $total;

                DB::table('detalle_compra')->insert([
                    'nota_compra_id' => $notaCompra->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio' => $precioCompra,
                    'total' => $total,
                    'created_at' => $notaCompra->created_at,
                    'updated_at' => $notaCompra->updated_at,
                ]);

                $totalDetalles++;
            }

            // Actualizar el total de la nota de compra basado en los detalles reales
            $notaCompra->update(['total' => $totalCompra]);
        }

        $this->command->info('✅ Detalles de compra creados: ' . $totalDetalles . ' detalles para ' . $notasCompra->count() . ' notas de compra');
    }
}
