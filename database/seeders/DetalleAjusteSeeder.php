<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AjusteInventario;
use App\Models\Producto;
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
        $productos = Producto::all();

        if ($ajustes->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay ajustes de inventario o productos disponibles. Ejecuta primero los seeders correspondientes.');
            return;
        }

        $totalDetalles = 0;

        foreach ($ajustes as $ajuste) {
            // Cada ajuste afecta entre 1 y 8 productos
            $cantidadProductos = rand(1, 8);
            $productosSeleccionados = $productos->random($cantidadProductos);
            
            $totalAjuste = 0;

            foreach ($productosSeleccionados as $producto) {
                $tipoAjuste = ['entrada', 'salida'][array_rand(['entrada', 'salida'])];
                $cantidad = $tipoAjuste === 'entrada' ? rand(5, 50) : rand(1, 20);
                $costoUnitario = $producto->precio_venta * 0.7; // 70% del precio de venta
                $total = $cantidad * $costoUnitario;
                
                // Si es salida, el total es negativo
                if ($tipoAjuste === 'salida') {
                    $total = -$total;
                }
                
                $totalAjuste += $total;

                DB::table('detalle_ajustes')->insert([
                    'ajuste_inventario_id' => $ajuste->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'tipo_ajuste' => $tipoAjuste,
                    'motivo' => $this->getRandomMotivo($tipoAjuste),
                    'costo_unitario' => $costoUnitario,
                    'total' => abs($total), // El total siempre es positivo en la tabla
                    'created_at' => $ajuste->created_at,
                    'updated_at' => $ajuste->updated_at,
                ]);

                $totalDetalles++;
            }

            // No actualizar monto_total ya que la columna no existe en la tabla
        }

        $this->command->info('✅ Detalles de ajuste creados: ' . $totalDetalles . ' detalles para ' . $ajustes->count() . ' ajustes');
    }

    private function getRandomMotivo(string $tipoAjuste): string
    {
        $motivos = [
            'entrada' => [
                'Reposición de inventario',
                'Productos encontrados en almacén',
                'Corrección por conteo físico',
                'Mercancía en buen estado encontrada',
                'Ajuste por diferencias de inventario',
                'Devolución de cliente en buen estado',
            ],
            'salida' => [
                'Producto vencido',
                'Mercancía dañada',
                'Pérdida por robo',
                'Producto defectuoso',
                'Corrección por sobrevaloración',
                'Merma por manipulación',
                'Ajuste por diferencias de inventario',
            ]
        ];

        $opciones = $motivos[$tipoAjuste];
        return $opciones[array_rand($opciones)];
    }
}
