<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cod_producto' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'nombre' => $this->faker->words(3, true),
            'precio_compra' => $this->faker->randomFloat(2, 10, 100),
            'precio_venta' => $this->faker->randomFloat(2, 15, 150),
            'imagen' => $this->faker->imageUrl(640, 480, 'products'),
            'descripcion' => $this->faker->sentence(),
            'categoria_id' => Categoria::factory(),
        ];
    }
}
