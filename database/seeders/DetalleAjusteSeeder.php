<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AjusteInventario;
use App\Models\ProductoAlmacen;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DetalleAjusteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ajustes = AjusteInventario::all();
        $productosAlmacen = ProductoAlmacen::with('producto')->get();

        if ($ajustes->isEmpty() || $productosAlmacen->isEmpty()) {
            $this->command->warn('No hay ajustes de inventario o productos en almacén. Ejecuta AjusteInventarioSeeder e InventarioSeeder.');
            return;
        }

        $totalDetalles = 0;

        foreach ($ajustes as $ajuste) {
            $cantidadProductos = rand(1, 5);
            $productosSeleccionados = $productosAlmacen->random($cantidadProductos);

            foreach ($productosSeleccionados as $productoAlmacen) {
                $tipoAjuste = ['entrada', 'salida'][rand(0, 1)];
                $cantidad = rand(1, 20);

                DB::table('detalle_ajuste')->insert([
                    'ajuste_inventario_id' => $ajuste->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $cantidad,
                    'tipo_ajuste' => $tipoAjuste,
                    'motivo' => 'Ajuste de inventario ' . ($tipoAjuste === 'entrada' ? 'por sobrante' : 'por pérdida'),
                    'costo_unitario' => $productoAlmacen->producto->precio_compra,
                    'total' => $cantidad * $productoAlmacen->producto->precio_compra,
                    'created_at' => $ajuste->created_at,
                    'updated_at' => $ajuste->updated_at,
                ]);

                $totalDetalles++;
            }
        }

        $this->command->info('✅ Detalles de ajuste creados: ' . $totalDetalles);
    }
}
