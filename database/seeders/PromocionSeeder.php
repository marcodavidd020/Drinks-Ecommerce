<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Promocion;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PromocionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener algunos productos para las promociones
        $productos = Producto::take(10)->get();

        if ($productos->isEmpty()) {
            $this->command->warn('No hay productos disponibles para crear promociones. Ejecuta ProductoSeeder primero.');
            return;
        }

        // Promoción 1: Black Friday
        $blackFriday = Promocion::create([
            'nombre' => 'Black Friday 2024',
            'fecha_inicio' => Carbon::now()->subDays(30),
            'fecha_fin' => Carbon::now()->addDays(5),
            'estado' => 'activa',
        ]);

        // Asociar productos con descuentos para Black Friday
        if ($productos->count() >= 4) {
            $blackFriday->productos()->attach($productos[0]->id, [
                'descuento_porcentaje' => 30.00,
                'descuento_fijo' => null,
            ]);

            $blackFriday->productos()->attach($productos[1]->id, [
                'descuento_porcentaje' => 25.00,
                'descuento_fijo' => null,
            ]);

            $blackFriday->productos()->attach($productos[2]->id, [
                'descuento_porcentaje' => null,
                'descuento_fijo' => 5000.00,
            ]);

            $blackFriday->productos()->attach($productos[3]->id, [
                'descuento_porcentaje' => 40.00,
                'descuento_fijo' => null,
            ]);
        }

        // Promoción 2: Navidad
        $navidad = Promocion::create([
            'nombre' => 'Promoción Navideña',
            'fecha_inicio' => Carbon::now()->addDays(20),
            'fecha_fin' => Carbon::now()->addDays(45),
            'estado' => 'activa',
        ]);

        // Asociar productos para Navidad
        if ($productos->count() >= 6) {
            $navidad->productos()->attach($productos[4]->id, [
                'descuento_porcentaje' => 20.00,
                'descuento_fijo' => null,
            ]);

            $navidad->productos()->attach($productos[5]->id, [
                'descuento_porcentaje' => null,
                'descuento_fijo' => 3000.00,
            ]);
        }

        // Promoción 3: Año Nuevo (futura)
        $anoNuevo = Promocion::create([
            'nombre' => 'Ofertas de Año Nuevo',
            'fecha_inicio' => Carbon::now()->addDays(60),
            'fecha_fin' => Carbon::now()->addDays(75),
            'estado' => 'activa',
        ]);

        // Asociar productos para Año Nuevo
        if ($productos->count() >= 8) {
            $anoNuevo->productos()->attach($productos[6]->id, [
                'descuento_porcentaje' => 15.00,
                'descuento_fijo' => null,
            ]);

            $anoNuevo->productos()->attach($productos[7]->id, [
                'descuento_porcentaje' => 35.00,
                'descuento_fijo' => null,
            ]);
        }

        // Promoción 4: Liquidación (vencida)
        $liquidacion = Promocion::create([
            'nombre' => 'Gran Liquidación de Verano',
            'fecha_inicio' => Carbon::now()->subDays(90),
            'fecha_fin' => Carbon::now()->subDays(60),
            'estado' => 'activa',
        ]);

        // Asociar productos para Liquidación
        if ($productos->count() >= 10) {
            $liquidacion->productos()->attach($productos[8]->id, [
                'descuento_porcentaje' => 50.00,
                'descuento_fijo' => null,
            ]);

            $liquidacion->productos()->attach($productos[9]->id, [
                'descuento_porcentaje' => null,
                'descuento_fijo' => 8000.00,
            ]);
        }

        // Promoción 5: Inactiva
        $inactiva = Promocion::create([
            'nombre' => 'Promoción Suspendida',
            'fecha_inicio' => Carbon::now()->subDays(10),
            'fecha_fin' => Carbon::now()->addDays(10),
            'estado' => 'inactiva',
        ]);

        // Asociar algunos productos a la promoción inactiva
        if ($productos->count() >= 3) {
            $inactiva->productos()->attach($productos[0]->id, [
                'descuento_porcentaje' => 10.00,
                'descuento_fijo' => null,
            ]);

            $inactiva->productos()->attach($productos[1]->id, [
                'descuento_porcentaje' => null,
                'descuento_fijo' => 2000.00,
            ]);
        }

        $this->command->info('✅ Promociones creadas exitosamente!');
        $this->command->info('   - Black Friday 2024 (activa)');
        $this->command->info('   - Promoción Navideña (pendiente)');
        $this->command->info('   - Ofertas de Año Nuevo (pendiente)');
        $this->command->info('   - Gran Liquidación de Verano (vencida)');
        $this->command->info('   - Promoción Suspendida (inactiva)');
    }
} 