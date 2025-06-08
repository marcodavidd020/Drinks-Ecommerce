<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Pempresa;
use App\Models\Pqrsona;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proveedor>
 */
class ProveedorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->company(),
            'telefono' => $this->faker->phoneNumber(),
            'direccion' => $this->faker->address(),
            'email' => $this->faker->unique()->companyEmail(),
        ];
    }

    /**
     * Proveedor tipo persona
     */
    public function persona(): static
    {
        return $this->state(function (array $attributes) {
            $persona = Pqrsona::factory()->create();
            
            return [
                'nombre' => $persona->nombre_completo,
                'tipo' => 'persona',
                'proveedorable_id' => $persona->id,
                'proveedorable_type' => Pqrsona::class,
            ];
        });
    }

    /**
     * Proveedor tipo empresa
     */
    public function empresa(): static
    {
        return $this->state(function (array $attributes) {
            $empresa = Pempresa::factory()->create();
            
            return [
                'nombre' => $empresa->razon_social,
                'tipo' => 'empresa',
                'proveedorable_id' => $empresa->id,
                'proveedorable_type' => Pempresa::class,
            ];
        });
    }
}
