<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\ProductoInventario;
use App\Models\Promocion;
use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Cliente;
use App\Models\User;

class HomeDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar datos existentes
        DB::table('detalle_venta')->delete();
        DB::table('nota_venta')->delete();
        DB::table('producto_inventario')->delete();
        DB::table('producto')->delete();
        DB::table('categoria')->delete();
        DB::table('promocion')->delete();

        // Crear categorías de bebidas
        $categorias = [
            [
                'nombre' => 'Jugos Naturales',
                'descripcion' => 'Jugos frescos y naturales de frutas selectas',
            ],
            [
                'nombre' => 'Gaseosas',
                'descripcion' => 'Bebidas gaseosas refrescantes de diferentes sabores',
            ],
            [
                'nombre' => 'Aguas',
                'descripcion' => 'Aguas puras, minerales y saborizadas',
            ],
            [
                'nombre' => 'Bebidas Energéticas',
                'descripcion' => 'Bebidas energizantes para activar tu día',
            ],
            [
                'nombre' => 'Café y Té',
                'descripcion' => 'Cafés premium y tés selectos',
            ],
            [
                'nombre' => 'Cocteles y Smoothies',
                'descripcion' => 'Cocteles sin alcohol y smoothies nutritivos',
            ]
        ];

        foreach ($categorias as $categoriaData) {
            Categoria::create($categoriaData);
        }

        // Obtener las categorías creadas
        $categoriasCreadas = Categoria::all();

        // Crear productos de bebidas
        $productos = [
            // Jugos Naturales
            ['nombre' => 'Jugo de Naranja Natural', 'categoria' => 'Jugos Naturales', 'precio_compra' => 3500, 'precio_venta' => 5000, 'stock' => 50],
            ['nombre' => 'Jugo de Mango', 'categoria' => 'Jugos Naturales', 'precio_compra' => 4000, 'precio_venta' => 5500, 'stock' => 30],
            ['nombre' => 'Jugo de Lulo', 'categoria' => 'Jugos Naturales', 'precio_compra' => 3800, 'precio_venta' => 5200, 'stock' => 25],
            ['nombre' => 'Jugo de Maracuyá', 'categoria' => 'Jugos Naturales', 'precio_compra' => 4200, 'precio_venta' => 5800, 'stock' => 40],
            
            // Gaseosas
            ['nombre' => 'Coca Cola 350ml', 'categoria' => 'Gaseosas', 'precio_compra' => 2000, 'precio_venta' => 3000, 'stock' => 100],
            ['nombre' => 'Pepsi 350ml', 'categoria' => 'Gaseosas', 'precio_compra' => 1900, 'precio_venta' => 2800, 'stock' => 80],
            ['nombre' => 'Sprite 350ml', 'categoria' => 'Gaseosas', 'precio_compra' => 2000, 'precio_venta' => 3000, 'stock' => 60],
            ['nombre' => 'Fanta Naranja 350ml', 'categoria' => 'Gaseosas', 'precio_compra' => 2000, 'precio_venta' => 3000, 'stock' => 45],
            
            // Aguas
            ['nombre' => 'Agua Cristal 500ml', 'categoria' => 'Aguas', 'precio_compra' => 800, 'precio_venta' => 1500, 'stock' => 200],
            ['nombre' => 'Agua Brisa 1L', 'categoria' => 'Aguas', 'precio_compra' => 1500, 'precio_venta' => 2500, 'stock' => 150],
            ['nombre' => 'Agua con Gas Bretaña', 'categoria' => 'Aguas', 'precio_compra' => 2200, 'precio_venta' => 3500, 'stock' => 35],
            
            // Bebidas Energéticas
            ['nombre' => 'Red Bull 250ml', 'categoria' => 'Bebidas Energéticas', 'precio_compra' => 4500, 'precio_venta' => 7000, 'stock' => 60],
            ['nombre' => 'Monster Energy 500ml', 'categoria' => 'Bebidas Energéticas', 'precio_compra' => 5000, 'precio_venta' => 8000, 'stock' => 40],
            ['nombre' => 'Speed Max 350ml', 'categoria' => 'Bebidas Energéticas', 'precio_compra' => 3000, 'precio_venta' => 5000, 'stock' => 50],
            
            // Café y Té
            ['nombre' => 'Café Americano', 'categoria' => 'Café y Té', 'precio_compra' => 2500, 'precio_venta' => 4000, 'stock' => 0], // Sin stock
            ['nombre' => 'Cappuccino', 'categoria' => 'Café y Té', 'precio_compra' => 3000, 'precio_venta' => 4500, 'stock' => 25],
            ['nombre' => 'Té Verde Helado', 'categoria' => 'Café y Té', 'precio_compra' => 2800, 'precio_venta' => 4200, 'stock' => 30],
            
            // Cocteles y Smoothies
            ['nombre' => 'Smoothie de Fresa', 'categoria' => 'Cocteles y Smoothies', 'precio_compra' => 4500, 'precio_venta' => 7000, 'stock' => 20],
            ['nombre' => 'Mojito Sin Alcohol', 'categoria' => 'Cocteles y Smoothies', 'precio_compra' => 5000, 'precio_venta' => 8000, 'stock' => 15],
            ['nombre' => 'Smoothie Tropical', 'categoria' => 'Cocteles y Smoothies', 'precio_compra' => 5200, 'precio_venta' => 8500, 'stock' => 18],
        ];

        foreach ($productos as $index => $productoData) {
            $categoria = $categoriasCreadas->where('nombre', $productoData['categoria'])->first();
            
            $producto = Producto::create([
                'cod_producto' => 'BEB' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                'nombre' => $productoData['nombre'],
                'descripcion' => 'Deliciosa bebida ' . strtolower($productoData['nombre']),
                'precio_compra' => $productoData['precio_compra'],
                'precio_venta' => $productoData['precio_venta'],
                'categoria_id' => $categoria->id,
            ]);

            // Crear almacén principal si no existe
            $almacen = DB::table('almacen')->where('nombre', 'Almacén Principal')->first();
            if (!$almacen) {
                $almacenId = DB::table('almacen')->insertGetId([
                    'nombre' => 'Almacén Principal',
                    'descripcion' => 'Almacén central de bebidas',
                    'ubicacion' => 'Bodega Central',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $almacenId = $almacen->id;
            }

            // Crear inventario
            ProductoInventario::create([
                'producto_id' => $producto->id,
                'almacen_id' => $almacenId,
                'stock' => $productoData['stock'],
            ]);
        }

        // Crear promociones de bebidas
        $promociones = [
            [
                'nombre' => '🍹 Combo Refrescante',
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addDays(30),
                'descuento' => '2 jugos naturales + 1 agua por $12.000',
            ],
            [
                'nombre' => '⚡ Happy Hour Energéticas',
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addDays(15),
                'descuento' => '20% de descuento en bebidas energéticas de 3pm a 6pm',
            ],
            [
                'nombre' => '🥤 Lleva 3 Paga 2',
                'fecha_inicio' => now()->subDays(5),
                'fecha_fin' => now()->addDays(25),
                'descuento' => 'En gaseosas 350ml, lleva 3 y paga solo 2',
            ],
        ];

        foreach ($promociones as $promocionData) {
            Promocion::create($promocionData);
        }

        // Crear cliente demo si no existe
        $userDemo = User::firstOrCreate(
            ['email' => 'cliente@demo.com'],
            [
                'nombre' => 'Cliente Demo',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $clienteDemo = Cliente::firstOrCreate(
            ['user_id' => $userDemo->id],
            [
                'nit' => 'DEMO' . $userDemo->id . '-' . rand(10, 99),
            ]
        );

        $this->command->info('✅ Datos de demostración para tienda de bebidas creados exitosamente!');
        $this->command->info('📊 Se crearon:');
        $this->command->info('   - ' . count($categorias) . ' categorías de bebidas');
        $this->command->info('   - ' . count($productos) . ' productos de bebidas');
        $this->command->info('   - ' . count($promociones) . ' promociones activas');
        $this->command->info('   - 1 cliente demo');
    }
}
