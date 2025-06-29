<?php

namespace Database\Factories;

use App\Models\NotaVenta;
use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotaVenta>
 */
class NotaVentaFactory extends Factory
{
    protected $model = NotaVenta::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fecha = fake()->dateTimeBetween('-6 months', 'now');
        $total = fake()->numberBetween(50000, 2000000);
        
        return [
            'cliente_id' => Cliente::factory(),
            'fecha' => $fecha,
            'total' => $total,
            'estado' => fake()->randomElement(['pendiente', 'completada', 'cancelada']),
            'observaciones' => fake()->optional()->sentence(),
            'created_at' => $fecha,
            'updated_at' => $fecha,
        ];
    }

    public function completada()
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'completada',
            ];
        });
    }

    public function pendiente()
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'pendiente',
            ];
        });
    }

    public function esteAnio()
    {
        return $this->state(function (array $attributes) {
            $fecha = fake()->dateTimeThisYear();
            return [
                'fecha' => $fecha,
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ];
        });
    }

    public function esteMes()
    {
        return $this->state(function (array $attributes) {
            $fecha = fake()->dateTimeThisMonth();
            return [
                'fecha' => $fecha,
                'created_at' => $fecha,
                'updated_at' => $fecha,
            ];
        });
    }
}
