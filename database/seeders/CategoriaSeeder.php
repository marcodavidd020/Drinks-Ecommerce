<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear una categoría sin productos para probar la funcionalidad de eliminar
        Categoria::create([
            'nombre' => 'Categoría Sin Productos',
            'descripcion' => 'Esta categoría no tiene productos asociados y puede ser eliminada'
        ]);

        // Crear una categoría que ya tenga productos asociados
        $categoriaConProductos = Categoria::create([
            'nombre' => 'Categoría Con Productos',
            'descripcion' => 'Esta categoría tiene productos asociados y no puede ser eliminada'
        ]);

        // Crear un producto asociado a esta categoría
        if ($categoriaConProductos) {
            \App\Models\Producto::create([
                'nombre' => 'Producto de Prueba',
                'cod_producto' => 'TEST001',
                'descripcion' => 'Producto para probar la relación con categorías',
                'precio_compra' => 100,
                'precio_venta' => 150,
                'categoria_id' => $categoriaConProductos->id
            ]);
        }
    }
}
