<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\ProductoAlmacen;
use App\Models\Proveedor;
use App\Models\NotaVenta;
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
                ],
                'alerts' => [],
            ]);
        }
    }

    private function getMainStats(): array
    {
        try {
            // Métricas básicas usando nombres de tablas correctos (singular)
            $totalUsers = DB::table('user')->count();
            $totalProducts = DB::table('producto')->count();
            $totalClients = DB::table('cliente')->count();
            $totalProviders = DB::table('proveedor')->count();

            // Métricas de ventas reales
            $totalOrders = DB::table('nota_venta')->count();
            $totalRevenue = DB::table('nota_venta')->sum('total') ?? 0;

            // Calcular productos con stock bajo (asumimos stock bajo = menos de 10)
            $lowStockProducts = DB::table('producto_almacen')
                ->where('stock', '<=', 10)
                ->distinct('producto_id')
                ->count('producto_id');

            // Carritos abandonados reales
            $abandonedCarts = DB::table('carrito')
                ->where('estado', 'abandonado')
                ->distinct('cliente_id')
                ->count('cliente_id');

            // Calcular crecimiento basado en registros del último mes
            $usersLastMonth = DB::table('user')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $productsLastMonth = DB::table('producto')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $ordersLastMonth = DB::table('nota_venta')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $revenueLastMonth = DB::table('nota_venta')
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
                $monthlyRevenue = DB::table('nota_venta')
                    ->whereYear('fecha', $date->year)
                    ->whereMonth('fecha', $date->month)
                    ->sum('total') ?? 0;

                $monthlyOrders = DB::table('nota_venta')
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

            // Top productos por cantidad vendida real - CORREGIDO: usar producto_almacen_id
            $topProducts = DB::table('detalle_venta')
                ->join('producto_almacen', 'detalle_venta.producto_almacen_id', '=', 'producto_almacen.id')
                ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
                ->join('nota_venta', 'detalle_venta.nota_venta_id', '=', 'nota_venta.id')
                ->select('producto.nombre')
                ->selectRaw('SUM(detalle_venta.cantidad) as total_vendido')
                ->selectRaw('SUM(detalle_venta.total) as total_ingresos')
                ->where('nota_venta.estado', '!=', 'cancelada')
                ->groupBy('producto.id', 'producto.nombre')
                ->orderBy('total_ingresos', 'desc')
                ->limit(5)
                ->get();

            // Si no hay ventas, usar datos de inventario como fallback
            if ($topProducts->isEmpty()) {
                $topProducts = DB::table('producto')
                    ->join('producto_almacen', 'producto.id', '=', 'producto_almacen.producto_id')
                    ->select('producto.nombre')
                    ->selectRaw('producto_almacen.stock as total_vendido')
                    ->selectRaw('(producto.precio_venta * producto_almacen.stock) as total_ingresos')
                    ->where('producto_almacen.stock', '>', 0)
                    ->orderBy('total_ingresos', 'desc')
                    ->limit(5)
                    ->get();
            }

            // Ventas por categoría usando datos reales - CORREGIDO: usar producto_almacen_id
            $salesByCategory = DB::table('detalle_venta')
                ->join('producto_almacen', 'detalle_venta.producto_almacen_id', '=', 'producto_almacen.id')
                ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
                ->join('categoria', 'producto.categoria_id', '=', 'categoria.id')
                ->join('nota_venta', 'detalle_venta.nota_venta_id', '=', 'nota_venta.id')
                ->select('categoria.nombre')
                ->selectRaw('SUM(detalle_venta.total) as total_ingresos')
                ->selectRaw('COUNT(DISTINCT producto.id) as cantidad_productos')
                ->where('nota_venta.estado', '!=', 'cancelada')
                ->groupBy('categoria.id', 'categoria.nombre')
                ->havingRaw('SUM(detalle_venta.total) > 0')
                ->orderByRaw('SUM(detalle_venta.total) DESC')
                ->limit(6)
                ->get();

            // Si no hay ventas, usar datos de inventario como fallback
            if ($salesByCategory->isEmpty()) {
                $salesByCategory = DB::table('producto')
                    ->join('categoria', 'producto.categoria_id', '=', 'categoria.id')
                    ->join('producto_almacen', 'producto.id', '=', 'producto_almacen.producto_id')
                    ->select('categoria.nombre')
                    ->selectRaw('SUM(producto.precio_venta * producto_almacen.stock) as total_ingresos')
                    ->selectRaw('COUNT(producto.id) as cantidad_productos')
                    ->groupBy('categoria.id', 'categoria.nombre')
                    ->havingRaw('SUM(producto.precio_venta * producto_almacen.stock) > 0')
                    ->orderByRaw('SUM(producto.precio_venta * producto_almacen.stock) DESC')
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
            // Ventas recientes reales - CORREGIDO: usar join con user para obtener el nombre
            $recentSales = DB::table('nota_venta')
                ->join('cliente', 'nota_venta.cliente_id', '=', 'cliente.id')
                ->join('user', 'cliente.user_id', '=', 'user.id')
                ->select(
                    'nota_venta.id',
                    'nota_venta.fecha as fecha',
                    'nota_venta.total',
                    'nota_venta.estado',
                    'user.nombre as cliente_nombre'
                )
                ->orderBy('nota_venta.created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($venta) {
                    return [
                        'id' => $venta->id,
                        'fecha' => \Carbon\Carbon::parse($venta->fecha)->format('Y-m-d'),
                        'total' => (float) $venta->total,
                        'estado' => $venta->estado,
                        'cliente_nombre' => $venta->cliente_nombre,
                        'numero_venta' => 'VT-' . $venta->id
                    ];
                })
                ->toArray();

            // Productos con stock crítico real - VERIFICAR: tabla producto_almacen tiene columna stock
            $lowStockProducts = DB::table('producto')
                ->join('producto_almacen', 'producto.id', '=', 'producto_almacen.producto_id')
                ->select('producto.id', 'producto.nombre', 'producto.cod_producto', 'producto_almacen.stock as stock_total')
                ->where('producto_almacen.stock', '<=', 10)
                ->orderBy('producto_almacen.stock', 'asc')
                ->limit(5)
                ->get()
                ->toArray();

            return [
                'recentSales' => $recentSales,
                'lowStockProducts' => $lowStockProducts,
            ];
        } catch (\Exception $e) {
            Log::error("Dashboard Recent Activity Error", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'recentSales' => [],
                'lowStockProducts' => [],
            ];
        }
    }

    private function getAlerts(): array
    {
        try {
            $alerts = [];

            // Verificar stock crítico usando la tabla de inventarios correcta
            $lowStockCount = DB::table('producto_almacen')
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
            $totalUsers = DB::table('user')->count();
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
            $uncategorizedProducts = DB::table('producto')
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
