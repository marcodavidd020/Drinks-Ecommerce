<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
        // Obtener estadísticas generales
        $stats = $this->getStats();

        // Obtener categorías con conteo de productos
        $categorias = $this->getCategorias();

        // Obtener productos destacados (últimos agregados o con más stock)
        $productosDestacados = $this->getProductosDestacados();

        // Obtener promociones activas
        $promociones = $this->getPromocionesActivas();

        // Obtener productos más vendidos
        $masVendidos = $this->getProductosMasVendidos();

        return Inertia::render('home', [
            'stats' => $stats,
            'categorias' => $categorias,
            'productosDestacados' => $productosDestacados,
            'promociones' => $promociones,
            'masVendidos' => $masVendidos,
        ]);
    }

    private function getStats()
    {
        try {
            return [
                'totalProductos' => DB::table('productos')->count(),
                'totalCategorias' => DB::table('categorias')->count(),
                'totalClientes' => DB::table('clientes')->count(),
                'totalVentas' => DB::table('notas_venta')
                    ->where('estado', 'completada')
                    ->count(),
            ];
        } catch (\Exception $e) {
            // Si hay error en las consultas, devolver valores por defecto
            return [
                'totalProductos' => 0,
                'totalCategorias' => 0,
                'totalClientes' => 0,
                'totalVentas' => 0,
            ];
        }
    }

    private function getCategorias()
    {
        try {
            return DB::table('categorias')
                ->leftJoin('productos', 'categorias.id', '=', 'productos.categoria_id')
                ->select(
                    'categorias.id',
                    'categorias.nombre',
                    'categorias.descripcion',
                    DB::raw('COUNT(productos.id) as productos_count')
                )
                ->groupBy('categorias.id', 'categorias.nombre', 'categorias.descripcion')
                ->orderBy('categorias.nombre')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            return [
                [
                    'id' => 1,
                    'nombre' => 'Productos Generales',
                    'descripcion' => 'Categoría general de productos',
                    'productos_count' => 0
                ]
            ];
        }
    }

    private function getProductosDestacados()
    {
        try {
            return DB::table('productos')
                ->leftJoin('categorias', 'productos.categoria_id', '=', 'categorias.id')
                ->leftJoin(
                    DB::raw('(SELECT producto_id, SUM(stock) as stock_total FROM producto_inventarios GROUP BY producto_id) as inventario'),
                    'productos.id',
                    '=',
                    'inventario.producto_id'
                )
                ->select(
                    'productos.id',
                    'productos.cod_producto',
                    'productos.nombre',
                    'productos.precio_compra',
                    'productos.precio_venta',
                    'productos.imagen',
                    'productos.descripcion',
                    'categorias.id as categoria_id',
                    'categorias.nombre as categoria_nombre',
                    DB::raw('COALESCE(inventario.stock_total, 0) as stock_total')
                )
                ->orderBy('productos.created_at', 'desc')
                ->limit(8)
                ->get()
                ->map(function ($producto) {
                    return [
                        'id' => $producto->id,
                        'cod_producto' => $producto->cod_producto,
                        'nombre' => $producto->nombre,
                        'precio_compra' => (float) $producto->precio_compra,
                        'precio_venta' => (float) $producto->precio_venta,
                        'imagen' => $producto->imagen,
                        'descripcion' => $producto->descripcion,
                        'categoria' => $producto->categoria_id ? [
                            'id' => $producto->categoria_id,
                            'nombre' => $producto->categoria_nombre
                        ] : null,
                        'stock_total' => (int) $producto->stock_total
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            return $this->getProductosDemo();
        }
    }

    private function getPromocionesActivas()
    {
        return [];
    }

    private function getProductosMasVendidos()
    {
        try {
            return DB::table('productos')
                ->leftJoin('categorias', 'productos.categoria_id', '=', 'categorias.id')
                ->leftJoin(
                    DB::raw('(SELECT producto_id, SUM(stock) as stock_total FROM producto_inventarios GROUP BY producto_id) as inventario'),
                    'productos.id',
                    '=',
                    'inventario.producto_id'
                )
                ->leftJoin(
                    DB::raw('(SELECT producto_id, SUM(cantidad) as total_vendido FROM detalle_ventas GROUP BY producto_id) as ventas'),
                    'productos.id',
                    '=',
                    'ventas.producto_id'
                )
                ->select(
                    'productos.id',
                    'productos.cod_producto',
                    'productos.nombre',
                    'productos.precio_compra',
                    'productos.precio_venta',
                    'productos.imagen',
                    'productos.descripcion',
                    'categorias.id as categoria_id',
                    'categorias.nombre as categoria_nombre',
                    DB::raw('COALESCE(inventario.stock_total, 0) as stock_total'),
                    DB::raw('COALESCE(ventas.total_vendido, 0) as total_vendido')
                )
                ->orderBy('total_vendido', 'desc')
                ->limit(8)
                ->get()
                ->map(function ($producto) {
                    return [
                        'id' => $producto->id,
                        'cod_producto' => $producto->cod_producto,
                        'nombre' => $producto->nombre,
                        'precio_compra' => (float) $producto->precio_compra,
                        'precio_venta' => (float) $producto->precio_venta,
                        'imagen' => $producto->imagen,
                        'descripcion' => $producto->descripcion,
                        'categoria' => $producto->categoria_id ? [
                            'id' => $producto->categoria_id,
                            'nombre' => $producto->categoria_nombre
                        ] : null,
                        'stock_total' => (int) $producto->stock_total,
                        'total_vendido' => (int) $producto->total_vendido
                    ];
                })
                ->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    private function getProductosDemo()
    {
        // Productos de demostración si no hay datos en la base
        return [
            [
                'id' => 1,
                'cod_producto' => 'DEMO001',
                'nombre' => 'Producto Demo 1',
                'precio_compra' => 15000,
                'precio_venta' => 25000,
                'imagen' => null,
                'descripcion' => 'Este es un producto de demostración',
                'categoria' => [
                    'id' => 1,
                    'nombre' => 'Demo'
                ],
                'stock_total' => 50
            ],
            [
                'id' => 2,
                'cod_producto' => 'DEMO002',
                'nombre' => 'Producto Demo 2',
                'precio_compra' => 20000,
                'precio_venta' => 35000,
                'imagen' => null,
                'descripcion' => 'Otro producto de demostración',
                'categoria' => [
                    'id' => 1,
                    'nombre' => 'Demo'
                ],
                'stock_total' => 25
            ]
        ];
    }
}
