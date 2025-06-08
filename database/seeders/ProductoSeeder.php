<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primero verificamos si existen categorías, si no, creamos algunas
        if (Categoria::count() === 0) {
            Categoria::create(['nombre' => 'Refrescos', 'descripcion' => 'Bebidas gasificadas y refrescos']);
            Categoria::create(['nombre' => 'Jugos Naturales', 'descripcion' => 'Jugos de frutas naturales']);
            Categoria::create(['nombre' => 'Aguas', 'descripcion' => 'Aguas minerales y saborizadas']);
            Categoria::create(['nombre' => 'Bebidas Energéticas', 'descripcion' => 'Bebidas energizantes y deportivas']);
            Categoria::create(['nombre' => 'Bebidas Calientes', 'descripcion' => 'Café, té y bebidas calientes']);
            Categoria::create(['nombre' => 'Cervezas', 'descripcion' => 'Cervezas nacionales e importadas']);
            Categoria::create(['nombre' => 'Vinos', 'descripcion' => 'Vinos tintos, blancos y rosados']);
        }

        $categorias = Categoria::all();

        // Solo crear productos si no existen ya
        if (Producto::count() > 0) {
            return;
        }

        $productos = [
            // Refrescos
            ['cod_producto' => 'REF001', 'nombre' => 'Coca-Cola 350ml', 'precio_compra' => 1200, 'precio_venta' => 2500, 'descripcion' => 'Refresco de cola clásico 350ml'],
            ['cod_producto' => 'REF002', 'nombre' => 'Pepsi 500ml', 'precio_compra' => 1500, 'precio_venta' => 3000, 'descripcion' => 'Refresco de cola 500ml'],
            ['cod_producto' => 'REF003', 'nombre' => 'Sprite 350ml', 'precio_compra' => 1200, 'precio_venta' => 2500, 'descripcion' => 'Refresco de limón 350ml'],
            
            // Jugos Naturales
            ['cod_producto' => 'JUG001', 'nombre' => 'Jugo de Naranja Natural 1L', 'precio_compra' => 2500, 'precio_venta' => 5000, 'descripcion' => 'Jugo de naranja 100% natural'],
            ['cod_producto' => 'JUG002', 'nombre' => 'Jugo de Mango 500ml', 'precio_compra' => 2000, 'precio_venta' => 4000, 'descripcion' => 'Jugo de mango tropical'],
            ['cod_producto' => 'JUG003', 'nombre' => 'Jugo Multifrutas 1L', 'precio_compra' => 2800, 'precio_venta' => 5500, 'descripcion' => 'Mezcla de frutas tropicales'],
            
            // Aguas
            ['cod_producto' => 'AGU001', 'nombre' => 'Agua Mineral 500ml', 'precio_compra' => 800, 'precio_venta' => 1800, 'descripcion' => 'Agua mineral natural'],
            ['cod_producto' => 'AGU002', 'nombre' => 'Agua Saborizada Limón 600ml', 'precio_compra' => 1000, 'precio_venta' => 2200, 'descripcion' => 'Agua con sabor a limón'],
            
            // Bebidas Energéticas
            ['cod_producto' => 'ENE001', 'nombre' => 'Red Bull 250ml', 'precio_compra' => 3500, 'precio_venta' => 7000, 'descripcion' => 'Bebida energizante original'],
            ['cod_producto' => 'ENE002', 'nombre' => 'Monster Energy 473ml', 'precio_compra' => 4000, 'precio_venta' => 8000, 'descripcion' => 'Bebida energética sabor original'],
            
            // Bebidas Calientes
            ['cod_producto' => 'CAL001', 'nombre' => 'Café Instantáneo Premium', 'precio_compra' => 8000, 'precio_venta' => 15000, 'descripcion' => 'Café soluble premium 100g'],
            ['cod_producto' => 'CAL002', 'nombre' => 'Té Verde Orgánico', 'precio_compra' => 5000, 'precio_venta' => 10000, 'descripcion' => 'Té verde en bolsitas x20'],
            
            // Cervezas
            ['cod_producto' => 'CER001', 'nombre' => 'Cerveza Nacional 330ml', 'precio_compra' => 2000, 'precio_venta' => 4500, 'descripcion' => 'Cerveza rubia nacional'],
            ['cod_producto' => 'CER002', 'nombre' => 'Cerveza Premium 355ml', 'precio_compra' => 3000, 'precio_venta' => 6000, 'descripcion' => 'Cerveza premium importada'],
            
            // Vinos
            ['cod_producto' => 'VIN001', 'nombre' => 'Vino Tinto Reserva 750ml', 'precio_compra' => 15000, 'precio_venta' => 35000, 'descripcion' => 'Vino tinto reserva especial'],
        ];

        foreach ($productos as $producto) {
            $categoria = $categorias->random();
            Producto::create([
                'cod_producto' => $producto['cod_producto'],
                'nombre' => $producto['nombre'],
                'precio_compra' => $producto['precio_compra'],
                'precio_venta' => $producto['precio_venta'],
                'descripcion' => $producto['descripcion'],
                'categoria_id' => $categoria->id,
            ]);
        }
    }
}
