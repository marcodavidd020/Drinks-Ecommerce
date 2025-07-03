<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Promocion;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoController extends Controller
{
    /**
     * Mostrar página de productos/catálogo general
     */
    public function productos(Request $request): Response
    {
        // Obtener parámetros de filtro
        $categoria_id = $request->get('categoria');
        $busqueda = $request->get('busqueda');
        $orden = $request->get('orden', 'nombre');
        $per_page = $request->get('per_page', 12);

        // Query base de productos con relaciones
        $query = Producto::with(['categoria', 'productoAlmacenes'])
                        ->whereHas('productoAlmacenes', function($q) {
                            $q->where('stock', '>', 0);
                        });

        // Filtro por categoría
        if ($categoria_id) {
            $query->where('categoria_id', $categoria_id);
        }

        // Filtro por búsqueda
        if ($busqueda) {
            $query->where(function($q) use ($busqueda) {
                $q->where('nombre', 'like', "%{$busqueda}%")
                  ->orWhere('cod_producto', 'like', "%{$busqueda}%")
                  ->orWhere('descripcion', 'like', "%{$busqueda}%");
            });
        }

        // Ordenamiento
        switch ($orden) {
            case 'precio_asc':
                $query->orderBy('precio_venta', 'asc');
                break;
            case 'precio_desc':
                $query->orderBy('precio_venta', 'desc');
                break;
            case 'nombre':
            default:
                $query->orderBy('nombre', 'asc');
                break;
        }

        $productos = $query->paginate($per_page)->through(function ($producto) {
            return [
                'id' => $producto->id,
                'cod_producto' => $producto->cod_producto,
                'nombre' => $producto->nombre,
                'precio_compra' => $producto->precio_compra,
                'precio_venta' => $producto->precio_venta,
                'imagen' => $producto->imagen,
                'descripcion' => $producto->descripcion,
                'categoria' => [
                    'id' => $producto->categoria->id,
                    'nombre' => $producto->categoria->nombre,
                ],
                'stock_total' => $producto->productoAlmacenes->sum('stock'),
            ];
        });

        // Obtener todas las categorías para filtros
        $categorias = Categoria::withCount('productos')
                              ->orderBy('nombre')
                              ->get();

        // Obtener promociones activas para destacar productos
        $promociones_activas = Promocion::where('fecha_inicio', '<=', now())
                                       ->where('fecha_fin', '>=', now())
                                       ->with('producto')
                                       ->whereHas('producto')
                                       ->get();

        return Inertia::render('Catalogo/Productos', [
            'productos' => $productos,
            'categorias' => $categorias,
            'promociones_activas' => $promociones_activas,
            'filtros' => [
                'categoria_id' => $categoria_id,
                'busqueda' => $busqueda,
                'orden' => $orden,
                'per_page' => $per_page,
            ],
            'stats' => [
                'total_productos' => $productos->total(),
                'total_categorias' => $categorias->count(),
                'productos_en_promocion' => $promociones_activas->count(),
            ]
        ]);
    }

    /**
     * Mostrar página de promociones
     */
    public function promociones(Request $request): Response
    {
        $estado = $request->get('estado', 'activas');
        $per_page = $request->get('per_page', 8);

        // Query base de promociones
        $query = Promocion::with(['producto.categoria']);

        // Filtro por estado
        switch ($estado) {
            case 'activas':
                $query->where('fecha_inicio', '<=', now())
                      ->where('fecha_fin', '>=', now());
                break;
            case 'proximamente':
                $query->where('fecha_inicio', '>', now());
                break;
            case 'expiradas':
                $query->where('fecha_fin', '<', now());
                break;
            case 'todas':
            default:
                // Sin filtro adicional
                break;
        }

        $promociones = $query->orderBy('fecha_inicio', 'desc')
                            ->paginate($per_page)
                            ->through(function ($promocion) {
                                return [
                                    'id' => $promocion->id,
                                    'nombre' => $promocion->nombre,
                                    'fecha_inicio' => $promocion->fecha_inicio,
                                    'fecha_fin' => $promocion->fecha_fin,
                                    'descuento' => $promocion->descuento,
                                    'producto' => $promocion->producto ? [
                                        'id' => $promocion->producto->id,
                                        'nombre' => $promocion->producto->nombre,
                                        'precio_venta' => $promocion->producto->precio_venta,
                                        'imagen' => $promocion->producto->imagen,
                                        'categoria' => [
                                            'id' => $promocion->producto->categoria->id,
                                            'nombre' => $promocion->producto->categoria->nombre,
                                        ]
                                    ] : null,
                                    'estado' => $this->determinarEstadoPromocion($promocion),
                                ];
                            });

        // Estadísticas
        $stats = [
            'activas' => Promocion::where('fecha_inicio', '<=', now())
                                 ->where('fecha_fin', '>=', now())
                                 ->count(),
            'proximamente' => Promocion::where('fecha_inicio', '>', now())
                                     ->count(),
            'expiradas' => Promocion::where('fecha_fin', '<', now())
                                   ->count(),
            'total' => Promocion::count(),
        ];

        return Inertia::render('Catalogo/Promociones', [
            'promociones' => $promociones,
            'filtro_estado' => $estado,
            'stats' => $stats,
        ]);
    }

    /**
     * Determinar el estado de una promoción
     */
    private function determinarEstadoPromocion($promocion): string
    {
        $now = now();
        
        if ($promocion->fecha_inicio > $now) {
            return 'proximamente';
        } elseif ($promocion->fecha_fin < $now) {
            return 'expirada';
        } else {
            return 'activa';
        }
    }
}
