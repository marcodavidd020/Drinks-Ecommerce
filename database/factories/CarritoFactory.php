<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Cliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Carrito>
 */
class CarritoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cliente_id' => Cliente::factory(),
            'fecha' => $this->faker->date(),
            'total' => $this->faker->randomFloat(2, 0, 500),
            'estado' => $this->faker->randomElement(['activo', 'procesado', 'abandonado']),
        ];
    }

    /**
     * Estado activo
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activo',
        ]);
    }

    /**
     * Estado procesado
     */
    public function procesado(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'procesado',
        ]);
    }
}
