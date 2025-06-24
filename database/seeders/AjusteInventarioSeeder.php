<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AjusteInventario;
use App\Models\Administrativo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AjusteInventarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener un administrativo aleatorio usando el modelo
        $administrativo = Administrativo::first();

        if (!$administrativo) {
            $this->command->warn('No hay administrativos disponibles. Ejecuta primero los seeders correspondientes.');
            return;
        }

        $glosas = [
            'Ajuste por conteo físico mensual',
            'Corrección de diferencias de inventario',
            'Ajuste por productos vencidos',
            'Reposición de mercancía encontrada',
            'Ajuste por daños en almacén',
            'Corrección por errores de registro',
            'Ajuste por merma natural',
            'Reconteo de productos de alta rotación',
            'Ajuste por devoluciones de clientes',
            'Corrección de inventario inicial',
        ];

        // Crear ajustes de los últimos 4 meses
        for ($mes = 3; $mes >= 0; $mes--) {
            $fecha = Carbon::now()->subMonths($mes);
            $ajustesEnMes = rand(2, 6); // Entre 2 y 6 ajustes por mes

            for ($i = 0; $i < $ajustesEnMes; $i++) {
                $fechaAjuste = $fecha->copy()->addDays(rand(0, 28));
                
                AjusteInventario::create([
                    'administrativo_id' => $administrativo->id,
                    'fecha' => $fechaAjuste->toDateString(),
                    'glosa' => $glosas[array_rand($glosas)],
                    'created_at' => $fechaAjuste,
                    'updated_at' => $fechaAjuste,
                ]);
            }
        }

        $this->command->info('✅ Ajustes de inventario creados: ' . AjusteInventario::count() . ' registros');
    }
}
