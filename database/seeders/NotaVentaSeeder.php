<?php

namespace Database\Seeders;

use App\Models\NotaVenta;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotaVentaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear 50 notas de venta completadas de los últimos 6 meses
        NotaVenta::factory()
            ->count(50)
            ->completada()
            ->create();

        // Crear 20 notas de venta completadas de este año
        NotaVenta::factory()
            ->count(20)
            ->completada()
            ->esteAnio()
            ->create();

        // Crear 10 notas de venta completadas de este mes
        NotaVenta::factory()
            ->count(10)
            ->completada()
            ->esteMes()
            ->create();

        // Crear algunas notas pendientes
        NotaVenta::factory()
            ->count(5)
            ->pendiente()
            ->create();
    }
}
