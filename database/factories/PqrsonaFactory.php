<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pqrsona>
 */
class PqrsonaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipos = ['peticion', 'queja', 'reclamo', 'sugerencia'];
        $estados = ['pendiente', 'resuelto'];
        $estado = $this->faker->randomElement($estados);
        
        return [
            'nombre' => $this->faker->firstName(),
            'apellido' => $this->faker->lastName(),
            'telefono' => $this->faker->phoneNumber(),
            'direccion' => $this->faker->address(),
            'email' => $this->faker->unique()->safeEmail(),
            'tipo' => $this->faker->randomElement($tipos),
            'descripcion' => $this->faker->paragraph(),
            'estado' => $estado,
            'fecha_creacion' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'fecha_respuesta' => $estado === 'resuelto' ? $this->faker->dateTimeBetween('-15 days', 'now')->format('Y-m-d') : null,
            'respuesta' => $estado === 'resuelto' ? $this->faker->paragraph() : null,
        ];
    }
}
