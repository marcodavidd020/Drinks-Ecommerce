<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Almacen;
use App\Models\Categoria;
use App\Models\Direccion;
use App\Models\Producto;
use App\Models\ProductoAlmacen;
use App\Models\Promocion;
use App\Models\Proveedor;
use App\Models\TipoPago;
use Illuminate\Database\Seeder;

class InventarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear direcciones
        $direcciones = [
            ['nombre' => 'Centro de la Ciudad', 'longitud' => -68.1193, 'latitud' => -16.5000, 'referencia' => 'Plaza Murillo'],
            ['nombre' => 'Zona Sur', 'longitud' => -68.0731, 'latitud' => -16.5500, 'referencia' => 'Calacoto'],
            ['nombre' => 'El Alto', 'longitud' => -68.1500, 'latitud' => -16.5040, 'referencia' => 'Ciudad Satélite'],
        ];

        foreach ($direcciones as $direccionData) {
            // Verificar si ya existe
            if (!Direccion::where('nombre', $direccionData['nombre'])->exists()) {
                Direccion::create($direccionData);
            }
        }

        // Crear proveedores de bebidas
        $proveedores = [
            ['nombre' => 'Distribuidora de Bebidas Nacional S.A.', 'telefono' => '+57-1-2234567', 'direccion' => 'Av. El Dorado 1234', 'email' => 'ventas@bebidasnacional.com'],
            ['nombre' => 'Importadora de Licores Premium', 'telefono' => '+57-1-2345678', 'direccion' => 'Calle 72 # 10-15', 'email' => 'contacto@licorpremium.com'],
            ['nombre' => 'Jugos y Refrescos del Valle', 'telefono' => '+57-2-2456789', 'direccion' => 'Carrera 15 # 25-30', 'email' => 'info@jugosdelvalle.com'],
            ['nombre' => 'Cervecería Artesanal Andina', 'telefono' => '+57-4-2567890', 'direccion' => 'Zona Industrial Norte', 'email' => 'ventas@cervezaandina.com'],
        ];

        foreach ($proveedores as $proveedorData) {
            // Verificar si ya existe
            if (!Proveedor::where('nombre', $proveedorData['nombre'])->exists()) {
                Proveedor::create($proveedorData);
            }
        }

        // Crear categorías de bebidas
        $categorias = [
            ['nombre' => 'Refrescos', 'descripcion' => 'Bebidas gasificadas y refrescos'],
            ['nombre' => 'Jugos Naturales', 'descripcion' => 'Jugos de frutas naturales y néctares'],
            ['nombre' => 'Aguas', 'descripcion' => 'Aguas minerales, purificadas y saborizadas'],
            ['nombre' => 'Bebidas Energéticas', 'descripcion' => 'Bebidas energizantes y deportivas'],
            ['nombre' => 'Bebidas Calientes', 'descripcion' => 'Café, té, chocolate y bebidas calientes'],
            ['nombre' => 'Cervezas', 'descripcion' => 'Cervezas nacionales, importadas y artesanales'],
            ['nombre' => 'Vinos y Licores', 'descripcion' => 'Vinos, licores y bebidas alcohólicas premium'],
        ];

        foreach ($categorias as $categoriaData) {
            // Verificar si ya existe
            if (!Categoria::where('nombre', $categoriaData['nombre'])->exists()) {
                Categoria::create($categoriaData);
            }
        }

        // Crear almacenes especializados en bebidas
        $almacenes = [
            ['nombre' => 'Almacén Principal Bebidas', 'descripcion' => 'Almacén central con refrigeración especializada', 'ubicacion' => 'Zona Industrial Norte'],
            ['nombre' => 'Almacén Bebidas Frías', 'descripcion' => 'Almacén con cuartos fríos para bebidas', 'ubicacion' => 'Centro de Distribución'],
            ['nombre' => 'Almacén Vinos y Licores', 'descripcion' => 'Almacén climatizado para bebidas premium', 'ubicacion' => 'Zona Franca'],
        ];

        foreach ($almacenes as $almacenData) {
            // Verificar si ya existe
            if (!Almacen::where('nombre', $almacenData['nombre'])->exists()) {
                Almacen::create($almacenData);
            }
        }

        // Crear productos de bebidas - solo si no existen ya
        $productos = [
            // Refrescos
            ['cod_producto' => 'REF001', 'nombre' => 'Coca-Cola 350ml', 'precio_compra' => 1.20, 'precio_venta' => 2.50, 'descripcion' => 'Refresco de cola clásico 350ml', 'categoria_id' => 1],
            ['cod_producto' => 'REF002', 'nombre' => 'Pepsi 500ml', 'precio_compra' => 1.50, 'precio_venta' => 3.00, 'descripcion' => 'Refresco de cola 500ml', 'categoria_id' => 1],
            ['cod_producto' => 'REF003', 'nombre' => 'Sprite 350ml', 'precio_compra' => 1.20, 'precio_venta' => 2.50, 'descripcion' => 'Refresco de limón 350ml', 'categoria_id' => 1],
            
            // Jugos Naturales
            ['cod_producto' => 'JUG001', 'nombre' => 'Jugo de Naranja Natural 1L', 'precio_compra' => 2.50, 'precio_venta' => 5.00, 'descripcion' => 'Jugo de naranja 100% natural', 'categoria_id' => 2],
            ['cod_producto' => 'JUG002', 'nombre' => 'Jugo de Mango 500ml', 'precio_compra' => 2.00, 'precio_venta' => 4.00, 'descripcion' => 'Jugo de mango tropical', 'categoria_id' => 2],
            
            // Aguas
            ['cod_producto' => 'AGU001', 'nombre' => 'Agua Mineral 500ml', 'precio_compra' => 0.80, 'precio_venta' => 1.80, 'descripcion' => 'Agua mineral natural', 'categoria_id' => 3],
            ['cod_producto' => 'AGU002', 'nombre' => 'Agua Saborizada Limón 600ml', 'precio_compra' => 1.00, 'precio_venta' => 2.20, 'descripcion' => 'Agua con sabor a limón', 'categoria_id' => 3],
            
            // Bebidas Energéticas
            ['cod_producto' => 'ENE001', 'nombre' => 'Red Bull 250ml', 'precio_compra' => 3.50, 'precio_venta' => 7.00, 'descripcion' => 'Bebida energizante original', 'categoria_id' => 4],
            ['cod_producto' => 'ENE002', 'nombre' => 'Monster Energy 473ml', 'precio_compra' => 4.00, 'precio_venta' => 8.00, 'descripcion' => 'Bebida energética sabor original', 'categoria_id' => 4],
            
            // Bebidas Calientes
            ['cod_producto' => 'CAL001', 'nombre' => 'Café Instantáneo Premium', 'precio_compra' => 8.00, 'precio_venta' => 15.00, 'descripcion' => 'Café soluble premium 100g', 'categoria_id' => 5],
            ['cod_producto' => 'CAL002', 'nombre' => 'Té Verde Orgánico', 'precio_compra' => 5.00, 'precio_venta' => 10.00, 'descripcion' => 'Té verde en bolsitas x20', 'categoria_id' => 5],
            
            // Cervezas
            ['cod_producto' => 'CER001', 'nombre' => 'Cerveza Nacional 330ml', 'precio_compra' => 2.00, 'precio_venta' => 4.50, 'descripcion' => 'Cerveza rubia nacional', 'categoria_id' => 6],
            ['cod_producto' => 'CER002', 'nombre' => 'Cerveza Premium 355ml', 'precio_compra' => 3.00, 'precio_venta' => 6.00, 'descripcion' => 'Cerveza premium importada', 'categoria_id' => 6],
            
            // Vinos y Licores
            ['cod_producto' => 'VIN001', 'nombre' => 'Vino Tinto Reserva 750ml', 'precio_compra' => 15.00, 'precio_venta' => 35.00, 'descripcion' => 'Vino tinto reserva especial', 'categoria_id' => 7],
            ['cod_producto' => 'VIN002', 'nombre' => 'Whisky Premium 750ml', 'precio_compra' => 45.00, 'precio_venta' => 95.00, 'descripcion' => 'Whisky escocés premium', 'categoria_id' => 7],
        ];

        foreach ($productos as $productoData) {
            // Verificar si el producto ya existe por su código
            if (!Producto::where('cod_producto', $productoData['cod_producto'])->exists()) {
                Producto::create($productoData);
            }
        }

        // Crear inventario para cada producto en cada almacén
        $productos = Producto::all();
        $almacenes = Almacen::all();

        foreach ($productos as $producto) {
            foreach ($almacenes as $almacen) {
                // Verificar si ya existe este inventario
                if (!ProductoAlmacen::where('producto_id', $producto->id)
                      ->where('almacen_id', $almacen->id)
                      ->exists()) {
                    ProductoAlmacen::create([
                        'producto_id' => $producto->id,
                        'almacen_id' => $almacen->id,
                        'stock' => fake()->numberBetween(10, 100),
                    ]);
                }
            }
        }

        // Crear tipos de pago
        $tiposPago = [
            ['tipo_pago' => 'Efectivo'],
            ['tipo_pago' => 'Tarjeta de Débito'],
            ['tipo_pago' => 'Tarjeta de Crédito'],
            ['tipo_pago' => 'Transferencia Bancaria'],
            ['tipo_pago' => 'QR'],
        ];

        foreach ($tiposPago as $tipoPagoData) {
            // Verificar si ya existe
            if (!TipoPago::where('tipo_pago', $tipoPagoData['tipo_pago'])->exists()) {
                TipoPago::create($tipoPagoData);
            }
        }

        // Crear promociones específicas para productos
        $promociones = [
            [
                'nombre' => 'Happy Hour Coca-Cola',
                'fecha_inicio' => now()->subDays(10),
                'fecha_fin' => now()->addDays(20),
                'descuento' => '2x1 en Coca-Cola 350ml',
                'producto_codigo' => 'REF001'
            ],
            [
                'nombre' => 'Descuento Jugo de Naranja',
                'fecha_inicio' => now()->subDays(5),
                'fecha_fin' => now()->addDays(15),
                'descuento' => '25% de descuento en jugo de naranja',
                'producto_codigo' => 'JUG001'
            ],
            [
                'nombre' => 'Promoción Cerveza Nacional',
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addDays(30),
                'descuento' => 'Pack de 6 cervezas por el precio de 5',
                'producto_codigo' => 'CER001'
            ],
            [
                'nombre' => 'Descuento Vino Tinto',
                'fecha_inicio' => now()->subDays(3),
                'fecha_fin' => now()->addDays(25),
                'descuento' => '15% de descuento en vino tinto reserva',
                'producto_codigo' => 'VIN001'
            ],
        ];

        foreach ($promociones as $promocionData) {
            // Buscar el producto por código
            $producto = Producto::where('cod_producto', $promocionData['producto_codigo'])->first();
            
            if ($producto && !Promocion::where('nombre', $promocionData['nombre'])->exists()) {
                Promocion::create([
                    'nombre' => $promocionData['nombre'],
                    'fecha_inicio' => $promocionData['fecha_inicio'],
                    'fecha_fin' => $promocionData['fecha_fin'],
                    'descuento' => $promocionData['descuento'],
                    'producto_id' => $producto->id,
                ]);
            }
        }
    }
}
