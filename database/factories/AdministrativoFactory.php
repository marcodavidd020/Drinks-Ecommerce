<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Administrativo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Administrativo>
 */
class AdministrativoFactory extends Factory
{
    protected $model = Administrativo::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $cargos = [
            'Gerente General',
            'Gerente de Ventas',
            'Supervisor',
            'Coordinador',
            'Analista',
            'Asistente',
            'Especialista'
        ];

        return [
            'user_id' => User::factory(),
            'salario' => fake()->randomFloat(2, 1500, 5000),
            'cargo' => fake()->randomElement($cargos),
        ];
    }
}
