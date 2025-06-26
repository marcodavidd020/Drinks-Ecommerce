<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Producto;
use App\Models\ProductoAlmacen;
use App\Models\Almacen;
use Illuminate\Database\Seeder;

class TiendaBebidasSeeder extends Seeder
{
    /**
     * Seeder específico para una tienda de bebidas con productos adicionales
     */
    public function run(): void
    {
        // Obtener categorías existentes
        $categorias = Categoria::all()->keyBy('nombre');
        $almacenes = Almacen::all();

        // Productos adicionales para la tienda de bebidas
        $productosAdicionales = [
            // Más Refrescos
            ['cod_producto' => 'REF004', 'nombre' => 'Fanta Naranja 350ml', 'precio_compra' => 1.20, 'precio_venta' => 2.50, 'descripcion' => 'Refresco sabor naranja', 'categoria' => 'Refrescos'],
            ['cod_producto' => 'REF005', 'nombre' => 'Seven Up 500ml', 'precio_compra' => 1.50, 'precio_venta' => 3.00, 'descripcion' => 'Refresco de lima-limón', 'categoria' => 'Refrescos'],
            ['cod_producto' => 'REF006', 'nombre' => 'Pepsi Light 350ml', 'precio_compra' => 1.30, 'precio_venta' => 2.70, 'descripcion' => 'Refresco de cola light', 'categoria' => 'Refrescos'],
            ['cod_producto' => 'REF007', 'nombre' => 'Dr Pepper 355ml', 'precio_compra' => 1.80, 'precio_venta' => 3.50, 'descripcion' => 'Refresco sabor único', 'categoria' => 'Refrescos'],

            // Más Jugos Naturales
            ['cod_producto' => 'JUG004', 'nombre' => 'Jugo de Piña 1L', 'precio_compra' => 2.80, 'precio_venta' => 5.50, 'descripcion' => 'Jugo de piña tropical', 'categoria' => 'Jugos Naturales'],
            ['cod_producto' => 'JUG005', 'nombre' => 'Jugo de Maracuyá 500ml', 'precio_compra' => 2.20, 'precio_venta' => 4.50, 'descripcion' => 'Jugo de maracuyá natural', 'categoria' => 'Jugos Naturales'],
            ['cod_producto' => 'JUG006', 'nombre' => 'Néctar de Durazno 1L', 'precio_compra' => 2.00, 'precio_venta' => 4.20, 'descripcion' => 'Néctar de durazno', 'categoria' => 'Jugos Naturales'],
            ['cod_producto' => 'JUG007', 'nombre' => 'Jugo Verde Detox 500ml', 'precio_compra' => 3.50, 'precio_venta' => 7.00, 'descripcion' => 'Jugo verde detoxificante', 'categoria' => 'Jugos Naturales'],

            // Más Aguas
            ['cod_producto' => 'AGU003', 'nombre' => 'Agua Mineral con Gas 500ml', 'precio_compra' => 1.00, 'precio_venta' => 2.50, 'descripcion' => 'Agua mineral gasificada', 'categoria' => 'Aguas'],
            ['cod_producto' => 'AGU004', 'nombre' => 'Agua Saborizada Fresa 600ml', 'precio_compra' => 1.20, 'precio_venta' => 2.80, 'descripcion' => 'Agua con sabor a fresa', 'categoria' => 'Aguas'],
            ['cod_producto' => 'AGU005', 'nombre' => 'Agua Alcalina 1L', 'precio_compra' => 2.00, 'precio_venta' => 4.50, 'descripcion' => 'Agua alcalina premium', 'categoria' => 'Aguas'],

            // Más Bebidas Energéticas
            ['cod_producto' => 'ENE003', 'nombre' => 'Burn Energy 250ml', 'precio_compra' => 3.00, 'precio_venta' => 6.50, 'descripcion' => 'Bebida energética tropical', 'categoria' => 'Bebidas Energéticas'],
            ['cod_producto' => 'ENE004', 'nombre' => 'Gatorade 591ml', 'precio_compra' => 2.50, 'precio_venta' => 5.00, 'descripcion' => 'Bebida deportiva isotónica', 'categoria' => 'Bebidas Energéticas'],
            ['cod_producto' => 'ENE005', 'nombre' => 'Powerade 500ml', 'precio_compra' => 2.20, 'precio_venta' => 4.50, 'descripcion' => 'Bebida deportiva rehidratante', 'categoria' => 'Bebidas Energéticas'],

            // Más Bebidas Calientes
            ['cod_producto' => 'CAL003', 'nombre' => 'Chocolate Caliente Premium', 'precio_compra' => 6.00, 'precio_venta' => 12.00, 'descripcion' => 'Chocolate en polvo premium', 'categoria' => 'Bebidas Calientes'],
            ['cod_producto' => 'CAL004', 'nombre' => 'Té de Manzanilla', 'precio_compra' => 4.00, 'precio_venta' => 8.50, 'descripcion' => 'Té de manzanilla relajante', 'categoria' => 'Bebidas Calientes'],
            ['cod_producto' => 'CAL005', 'nombre' => 'Café Espresso en Cápsulas', 'precio_compra' => 12.00, 'precio_venta' => 25.00, 'descripcion' => 'Cápsulas de café espresso x10', 'categoria' => 'Bebidas Calientes'],

            // Más Cervezas
            ['cod_producto' => 'CER003', 'nombre' => 'Cerveza Light 355ml', 'precio_compra' => 2.20, 'precio_venta' => 4.80, 'descripcion' => 'Cerveza light baja en calorías', 'categoria' => 'Cervezas'],
            ['cod_producto' => 'CER004', 'nombre' => 'Cerveza Artesanal IPA 330ml', 'precio_compra' => 4.00, 'precio_venta' => 8.50, 'descripcion' => 'Cerveza artesanal India Pale Ale', 'categoria' => 'Cervezas'],
            ['cod_producto' => 'CER005', 'nombre' => 'Cerveza Sin Alcohol 355ml', 'precio_compra' => 2.50, 'precio_venta' => 5.20, 'descripcion' => 'Cerveza sin alcohol', 'categoria' => 'Cervezas'],

            // Más Vinos y Licores
            ['cod_producto' => 'VIN003', 'nombre' => 'Vino Blanco Sauvignon 750ml', 'precio_compra' => 12.00, 'precio_venta' => 28.00, 'descripcion' => 'Vino blanco seco', 'categoria' => 'Vinos y Licores'],
            ['cod_producto' => 'VIN004', 'nombre' => 'Vino Rosado 750ml', 'precio_compra' => 10.00, 'precio_venta' => 24.00, 'descripcion' => 'Vino rosado afrutado', 'categoria' => 'Vinos y Licores'],
            ['cod_producto' => 'VIN005', 'nombre' => 'Ron Premium 750ml', 'precio_compra' => 25.00, 'precio_venta' => 55.00, 'descripcion' => 'Ron añejo premium', 'categoria' => 'Vinos y Licores'],
            ['cod_producto' => 'VIN006', 'nombre' => 'Vodka Premium 750ml', 'precio_compra' => 20.00, 'precio_venta' => 45.00, 'descripcion' => 'Vodka destilado premium', 'categoria' => 'Vinos y Licores'],
            ['cod_producto' => 'VIN007', 'nombre' => 'Ginebra London Dry 750ml', 'precio_compra' => 18.00, 'precio_venta' => 40.00, 'descripcion' => 'Ginebra London Dry premium', 'categoria' => 'Vinos y Licores'],
        ];

        foreach ($productosAdicionales as $productoData) {
            // Verificar si el producto ya existe
            if (Producto::where('cod_producto', $productoData['cod_producto'])->exists()) {
                continue;
            }

            $categoria = $categorias->get($productoData['categoria']);
            if (!$categoria) {
                continue;
            }

            $producto = Producto::create([
                'cod_producto' => $productoData['cod_producto'],
                'nombre' => $productoData['nombre'],
                'precio_compra' => $productoData['precio_compra'],
                'precio_venta' => $productoData['precio_venta'],
                'descripcion' => $productoData['descripcion'],
                'categoria_id' => $categoria->id,
            ]);

            // Crear inventario para este producto en todos los almacenes
            foreach ($almacenes as $almacen) {
                ProductoAlmacen::create([
                    'producto_id' => $producto->id,
                    'almacen_id' => $almacen->id,
                    'stock' => fake()->numberBetween(15, 150),
                ]);
            }
        }

        $this->command->info('✅ Productos adicionales de bebidas creados exitosamente');
        $this->command->info('📦 Total de productos ahora: ' . Producto::count());
    }
} 