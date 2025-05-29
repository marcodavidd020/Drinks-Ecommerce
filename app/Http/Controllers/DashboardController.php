<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\ProductoInventario;
use App\Models\Proveedor;
use App\Models\NotaVenta;
use App\Models\Ppersona;
use App\Models\Carrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Usar siempre la versión React (Inertia) en lugar de Blade
        return $this->react();
    }

    public function react(): Response
    {
        try {
            // Obtener métricas principales expandidas
            $stats = $this->getMainStats();

            // Obtener datos para gráficos
            $chartData = $this->getChartData();

            // Obtener actividad reciente
            $recentActivity = $this->getRecentActivity();

            // Obtener alertas y notificaciones
            $alerts = $this->getAlerts();

            return Inertia::render('dashboard', [
                'stats' => $stats,
                'chartData' => $chartData,
                'recentActivity' => $recentActivity,
                'alerts' => $alerts,
            ]);
        } catch (\Exception $e) {
            Log::error('Dashboard Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Fallback con datos vacíos pero estructura correcta
            return Inertia::render('dashboard', [
                'stats' => [
                    'totalUsers' => 0,
                    'totalProducts' => 0,
                    'totalClients' => 0,
                    'totalProviders' => 0,
                    'totalOrders' => 0,
                    'totalRevenue' => 0,
                    'lowStockProducts' => 0,
                    'pendingPqrs' => 0,
                    'abandonedCarts' => 0,
                    'growth' => [
                        'users' => 0,
                        'products' => 0,
                        'orders' => 0,
                        'revenue' => 0,
                    ]
                ],
                'chartData' => [
                    'salesByMonth' => [],
                    'topProducts' => [],
                    'salesByCategory' => [],
                ],
                'recentActivity' => [
                    'recentSales' => [],
                    'lowStockProducts' => [],
                    'recentPqrs' => [],
                ],
                'alerts' => [],
            ]);
        }
    }

    private function getMainStats(): array
    {
        try {
            // Métricas básicas usando solo tablas que existen
            $totalUsers = DB::table('users')->count();
            $totalProducts = DB::table('productos')->count();
            $totalClients = DB::table('clientes')->count();
            $totalProviders = DB::table('proveedores')->count();

            // Métricas de ventas reales
            $totalOrders = DB::table('notas_venta')->count();
            $totalRevenue = DB::table('notas_venta')->sum('total') ?? 0;

            // Calcular productos con stock bajo (asumimos stock bajo = menos de 10)
            $lowStockProducts = DB::table('producto_inventarios')
                ->where('stock', '<=', 10)
                ->distinct('producto_id')
                ->count('producto_id');

            // PQRS pendientes reales
            $pendingPqrs = DB::table('personas')
                ->whereIn('estado', ['pendiente', 'en_proceso'])
                ->count();

            // Carritos abandonados reales
            $abandonedCarts = DB::table('carritos')
                ->where('estado', 'abandonado')
                ->distinct('cliente_id')
                ->count('cliente_id');

            // Calcular crecimiento basado en registros del último mes
            $usersLastMonth = DB::table('users')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $productsLastMonth = DB::table('productos')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $ordersLastMonth = DB::table('notas_venta')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $revenueLastMonth = DB::table('notas_venta')
                ->where('created_at', '>=', now()->subMonth())
                ->sum('total') ?? 0;

            $usersGrowth = $totalUsers > 0 ?
                round(($usersLastMonth / $totalUsers) * 100, 1) : 0;

            $productsGrowth = $totalProducts > 0 ?
                round(($productsLastMonth / $totalProducts) * 100, 1) : 0;

            $ordersGrowth = $totalOrders > 0 ?
                round(($ordersLastMonth / $totalOrders) * 100, 1) : 0;

            $revenueGrowth = $totalRevenue > 0 ?
                round(($revenueLastMonth / $totalRevenue) * 100, 1) : 0;

            return [
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalClients' => $totalClients,
                'totalProviders' => $totalProviders,
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float) $totalRevenue,
                'lowStockProducts' => $lowStockProducts,
                'pendingPqrs' => $pendingPqrs,
                'abandonedCarts' => $abandonedCarts,
                'growth' => [
                    'users' => $usersGrowth,
                    'products' => $productsGrowth,
                    'orders' => $ordersGrowth,
                    'revenue' => $revenueGrowth,
                ]
            ];
        } catch (\Exception $e) {
            // Log del error para debug
            Log::error("Dashboard Stats Error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback con datos por defecto
            return [
                'totalUsers' => 0,
                'totalProducts' => 0,
                'totalClients' => 0,
                'totalProviders' => 0,
                'totalOrders' => 0,
                'totalRevenue' => 0,
                'lowStockProducts' => 0,
                'pendingPqrs' => 0,
                'abandonedCarts' => 0,
                'growth' => [
                    'users' => 0,
                    'products' => 0,
                    'orders' => 0,
                    'revenue' => 0,
                ]
            ];
        }
    }

    private function getChartData(): array
    {
        try {
            // Datos de ventas reales por mes
            $salesByMonth = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);

                // Ventas reales del mes
                $monthlyRevenue = DB::table('notas_venta')
                    ->whereYear('fecha', $date->year)
                    ->whereMonth('fecha', $date->month)
                    ->sum('total') ?? 0;

                $monthlyOrders = DB::table('notas_venta')
                    ->whereYear('fecha', $date->year)
                    ->whereMonth('fecha', $date->month)
                    ->count();

                $salesByMonth->push([
                    'year' => (int) $date->year,
                    'month' => (int) $date->month,
                    'total' => (float) $monthlyRevenue,
                    'orders_count' => $monthlyOrders
                ]);
            }

            // Top productos por cantidad vendida real
            $topProducts = DB::table('detalle_ventas')
                ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
                ->join('notas_venta', 'detalle_ventas.nota_venta_id', '=', 'notas_venta.id')
                ->select('productos.nombre')
                ->selectRaw('SUM(detalle_ventas.cantidad) as total_vendido')
                ->selectRaw('SUM(detalle_ventas.total) as total_ingresos')
                ->where('notas_venta.estado', '!=', 'cancelada')
                ->groupBy('productos.id', 'productos.nombre')
                ->orderBy('total_ingresos', 'desc')
                ->limit(5)
                ->get();

            // Si no hay ventas, usar datos de inventario como fallback
            if ($topProducts->isEmpty()) {
                $topProducts = DB::table('productos')
                    ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                    ->select('productos.nombre')
                    ->selectRaw('producto_inventarios.stock as total_vendido')
                    ->selectRaw('(productos.precio_venta * producto_inventarios.stock) as total_ingresos')
                    ->where('producto_inventarios.stock', '>', 0)
                    ->orderBy('total_ingresos', 'desc')
                    ->limit(5)
                    ->get();
            }

            // Ventas por categoría usando datos reales
            $salesByCategory = DB::table('detalle_ventas')
                ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
                ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
                ->join('notas_venta', 'detalle_ventas.nota_venta_id', '=', 'notas_venta.id')
                ->select('categorias.nombre')
                ->selectRaw('SUM(detalle_ventas.total) as total_ingresos')
                ->selectRaw('COUNT(DISTINCT productos.id) as cantidad_productos')
                ->where('notas_venta.estado', '!=', 'cancelada')
                ->groupBy('categorias.id', 'categorias.nombre')
                ->havingRaw('SUM(detalle_ventas.total) > 0')
                ->orderByRaw('SUM(detalle_ventas.total) DESC')
                ->limit(6)
                ->get();

            // Si no hay ventas, usar datos de inventario como fallback
            if ($salesByCategory->isEmpty()) {
                $salesByCategory = DB::table('productos')
                    ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
                    ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                    ->select('categorias.nombre')
                    ->selectRaw('SUM(productos.precio_venta * producto_inventarios.stock) as total_ingresos')
                    ->selectRaw('COUNT(productos.id) as cantidad_productos')
                    ->groupBy('categorias.id', 'categorias.nombre')
                    ->havingRaw('SUM(productos.precio_venta * producto_inventarios.stock) > 0')
                    ->orderByRaw('SUM(productos.precio_venta * producto_inventarios.stock) DESC')
                    ->limit(6)
                    ->get();
            }

            return [
                'salesByMonth' => $salesByMonth->toArray(),
                'topProducts' => $topProducts->toArray(),
                'salesByCategory' => $salesByCategory->toArray(),
            ];
        } catch (\Exception $e) {
            // Log del error para debug
            Log::error("Dashboard Chart Data Error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback con datos básicos en lugar de arrays vacíos
            $fallbackSales = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $fallbackSales->push([
                    'year' => (int) $date->year,
                    'month' => (int) $date->month,
                    'total' => 0,
                    'orders_count' => 0
                ]);
            }

            return [
                'salesByMonth' => $fallbackSales->toArray(),
                'topProducts' => [],
                'salesByCategory' => [],
            ];
        }
    }

    private function getRecentActivity(): array
    {
        try {
            // Ventas recientes reales (simplificadas)
            $recentSales = DB::table('notas_venta')
                ->select(
                    'notas_venta.id',
                    'notas_venta.fecha as fecha',
                    'notas_venta.total',
                    'notas_venta.estado'
                )
                ->orderBy('notas_venta.created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($venta) {
                    return [
                        'id' => $venta->id,
                        'fecha' => \Carbon\Carbon::parse($venta->fecha)->format('Y-m-d'),
                        'total' => (float) $venta->total,
                        'estado' => $venta->estado,
                        'cliente_nombre' => 'Cliente #' . $venta->id, // Simulado
                        'numero_venta' => 'VT-' . $venta->id
                    ];
                })
                ->toArray();

            // Productos con stock crítico real
            $lowStockProducts = DB::table('productos')
                ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                ->select('productos.id', 'productos.nombre', 'productos.cod_producto', 'producto_inventarios.stock as stock_total')
                ->where('producto_inventarios.stock', '<=', 10)
                ->orderBy('producto_inventarios.stock', 'asc')
                ->limit(5)
                ->get()
                ->toArray();

            // PQRS recientes reales
            $recentPqrs = DB::table('personas')
                ->select(
                    'personas.id',
                    'personas.tipo',
                    'personas.descripcion as asunto',
                    'personas.estado',
                    'personas.created_at',
                    'personas.nombre as cliente_nombre'
                )
                ->orderBy('personas.created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($pqrs) {
                    return [
                        'id' => $pqrs->id,
                        'tipo' => $pqrs->tipo,
                        'asunto' => substr($pqrs->asunto, 0, 50) . '...', // Truncar descripción
                        'estado' => $pqrs->estado,
                        'created_at' => $pqrs->created_at,
                        'cliente_nombre' => $pqrs->cliente_nombre
                    ];
                })
                ->toArray();

            return [
                'recentSales' => $recentSales,
                'lowStockProducts' => $lowStockProducts,
                'recentPqrs' => $recentPqrs,
            ];
        } catch (\Exception $e) {
            Log::error("Dashboard Recent Activity Error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'recentSales' => [],
                'lowStockProducts' => [],
                'recentPqrs' => [],
            ];
        }
    }

    private function getAlerts(): array
    {
        try {
            $alerts = [];

            // Verificar stock crítico usando la tabla de inventarios
            $lowStockCount = DB::table('producto_inventarios')
                ->where('stock', '<=', 10)
                ->count();

            if ($lowStockCount > 0) {
                $alerts[] = [
                    'type' => 'warning',
                    'title' => 'Stock Crítico',
                    'message' => "Hay {$lowStockCount} productos con stock bajo.",
                    'action' => '/productos',
                    'actionText' => 'Ver Productos'
                ];
            }

            // Verificar si hay pocos usuarios registrados
            $totalUsers = DB::table('users')->count();
            if ($totalUsers < 5) {
                $alerts[] = [
                    'type' => 'info',
                    'title' => 'Pocos Usuarios',
                    'message' => "Solo hay {$totalUsers} usuarios registrados en el sistema.",
                    'action' => '/users/create',
                    'actionText' => 'Agregar Usuario'
                ];
            }

            // Verificar si hay productos sin categorizar
            $uncategorizedProducts = DB::table('productos')
                ->whereNull('categoria_id')
                ->count();

            if ($uncategorizedProducts > 0) {
                $alerts[] = [
                    'type' => 'warning',
                    'title' => 'Productos Sin Categorizar',
                    'message' => "Hay {$uncategorizedProducts} productos sin categoría asignada.",
                    'action' => '/productos',
                    'actionText' => 'Ver Productos'
                ];
            }

            return $alerts;
        } catch (\Exception $e) {
            Log::error("Dashboard Alerts Error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return [];
        }
    }
}
