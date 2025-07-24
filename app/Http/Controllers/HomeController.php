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

        // Obtener productos más vendidos
        $masVendidos = $this->getProductosMasVendidos();

        return Inertia::render('home', [
            'stats' => $stats,
            'categorias' => $categorias,
            'productosDestacados' => $productosDestacados,
            'masVendidos' => $masVendidos,
        ]);
    }

    private function getStats()
    {
        try {
            return [
                'totalProductos' => DB::table('producto')->count(),
                'totalCategorias' => DB::table('categoria')->count(),
                'totalClientes' => DB::table('cliente')->count(),
                'totalVentas' => DB::table('nota_venta')
                    ->where('estado', 'completada')
                    ->count(),
                'totalPromociones' => DB::table('promocion')->count(),
            ];
        } catch (\Exception $e) {
            // Si hay error en las consultas, devolver valores por defecto
            return [
                'totalProductos' => 0,
                'totalCategorias' => 0,
                'totalClientes' => 0,
                'totalVentas' => 0,
                'totalPromociones' => 0,
            ];
        }
    }

    private function getCategorias()
    {
        try {
            return DB::table('categoria')
                ->leftJoin('producto', 'categoria.id', '=', 'producto.categoria_id')
                ->select(
                    'categoria.id',
                    'categoria.nombre',
                    'categoria.descripcion',
                    DB::raw('COUNT(producto.id) as productos_count')
                )
                ->groupBy('categoria.id', 'categoria.nombre', 'categoria.descripcion')
                ->orderBy('categoria.nombre')
                ->get()
                ->toArray();
        } catch (\Exception $e) {
            return [
                [
                    'id' => 1,
                    'nombre' => 'Bebidas Refrescantes',
                    'descripcion' => 'Jugos, sodas y bebidas refrescantes',
                    'productos_count' => 0
                ]
            ];
        }
    }

    private function getProductosDestacados()
    {
        try {
            return DB::table('producto')
                ->leftJoin('categoria', 'producto.categoria_id', '=', 'categoria.id')
                ->leftJoin(
                    DB::raw('(SELECT producto_id, SUM(stock) as stock_total FROM producto_almacen GROUP BY producto_id) as inventario'),
                    'producto.id',
                    '=',
                    'inventario.producto_id'
                )
                ->select(
                    'producto.id',
                    'producto.cod_producto',
                    'producto.nombre',
                    'producto.precio_compra',
                    'producto.precio_venta',
                    'producto.imagen',
                    'producto.descripcion',
                    'categoria.id as categoria_id',
                    'categoria.nombre as categoria_nombre',
                    DB::raw('COALESCE(inventario.stock_total, 0) as stock_total')
                )
                ->orderBy('producto.created_at', 'desc')
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



    private function getProductosMasVendidos()
    {
        try {
            return DB::table('producto')
                ->leftJoin('categoria', 'producto.categoria_id', '=', 'categoria.id')
                ->leftJoin(
                    DB::raw('(SELECT producto_almacen_id, SUM(cantidad) as total_vendido FROM detalle_venta GROUP BY producto_almacen_id) as ventas'),
                    'producto.id',
                    '=',
                    'ventas.producto_almacen_id'
                )
                ->leftJoin(
                    DB::raw('(SELECT producto_id, SUM(stock) as stock_total FROM producto_almacen GROUP BY producto_id) as inventario'),
                    'producto.id',
                    '=',
                    'inventario.producto_id'
                )
                ->select(
                    'producto.id',
                    'producto.cod_producto',
                    'producto.nombre',
                    'producto.precio_compra',
                    'producto.precio_venta',
                    'producto.imagen',
                    'producto.descripcion',
                    'categoria.id as categoria_id',
                    'categoria.nombre as categoria_nombre',
                    DB::raw('COALESCE(inventario.stock_total, 0) as stock_total'),
                    DB::raw('COALESCE(ventas.total_vendido, 0) as total_vendido')
                )
                ->having('total_vendido', '>', 0)
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
                'cod_producto' => 'BEB001',
                'nombre' => 'Jugo de Naranja Natural 1L',
                'precio_compra' => 15000,
                'precio_venta' => 25000,
                'imagen' => null,
                'descripcion' => 'Jugo natural de naranja recién exprimido',
                'categoria' => [
                    'id' => 1,
                    'nombre' => 'Jugos Naturales'
                ],
                'stock_total' => 50
            ],
            [
                'id' => 2,
                'cod_producto' => 'BEB002',
                'nombre' => 'Agua Mineral 500ml',
                'precio_compra' => 8000,
                'precio_venta' => 12000,
                'imagen' => null,
                'descripcion' => 'Agua mineral natural purificada',
                'categoria' => [
                    'id' => 2,
                    'nombre' => 'Aguas'
                ],
                'stock_total' => 25
            ]
        ];
    }
}
