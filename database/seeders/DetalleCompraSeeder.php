<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\NotaCompra;
use App\Models\ProductoAlmacen;
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
        $productosAlmacen = ProductoAlmacen::with('producto')->get();

        if ($notasCompra->isEmpty() || $productosAlmacen->isEmpty()) {
            $this->command->warn('No hay notas de compra o productos en almacén. Ejecuta NotaCompraSeeder e InventarioSeeder primero.');
            return;
        }

        $totalDetalles = 0;

        foreach ($notasCompra as $notaCompra) {
            $cantidadProductos = rand(2, 8);
            $productosSeleccionados = $productosAlmacen->random($cantidadProductos);
            
            $totalCompra = 0;

            foreach ($productosSeleccionados as $productoAlmacen) {
                $cantidad = rand(10, 100);
                $precioCompra = $productoAlmacen->producto->precio_venta * rand(50, 75) / 100;
                $total = $cantidad * $precioCompra;
                $totalCompra += $total;

                DB::table('detalle_compra')->insert([
                    'nota_compra_id' => $notaCompra->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $cantidad,
                    'precio' => $precioCompra,
                    'total' => $total,
                    'created_at' => $notaCompra->created_at,
                    'updated_at' => $notaCompra->updated_at,
                ]);

                $totalDetalles++;
            }

            $notaCompra->update(['total' => $totalCompra]);
        }

        $this->command->info('✅ Detalles de compra creados: ' . $totalDetalles . ' detalles para ' . $notasCompra->count() . ' notas de compra');
    }
}
