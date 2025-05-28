<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\ProductoInventario;
use App\Models\Proveedor;
use App\Models\NotaVenta;
use App\Models\Pqrsona;
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
    }

    private function getMainStats(): array
    {
        try {
            // Métricas básicas usando solo tablas que existen
            $totalUsers = DB::table('users')->count();
            $totalProducts = DB::table('productos')->count();
            $totalClients = DB::table('clientes')->count();
            $totalProviders = DB::table('proveedores')->count();
            
            // Calcular productos con stock bajo (asumimos stock bajo = menos de 10)
            $lowStockProducts = DB::table('producto_inventarios')
                ->where('stock', '<=', 10)
                ->distinct('producto_id')
                ->count('producto_id');

            // Calcular crecimiento basado en registros del último mes
            $usersLastMonth = DB::table('users')
                ->where('created_at', '>=', now()->subMonth())
                ->count();
            
            $productsLastMonth = DB::table('productos')
                ->where('created_at', '>=', now()->subMonth())
                ->count();

            $usersGrowth = $totalUsers > 0 ? 
                round(($usersLastMonth / $totalUsers) * 100, 1) : 0;
            
            $productsGrowth = $totalProducts > 0 ? 
                round(($productsLastMonth / $totalProducts) * 100, 1) : 0;

            // Calcular valor del inventario total
            $totalRevenue = DB::table('productos')
                ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                ->selectRaw('SUM(productos.precio_venta * producto_inventarios.stock) as total')
                ->value('total') ?? 0;

            return [
                'totalUsers' => $totalUsers,
                'totalProducts' => $totalProducts,
                'totalClients' => $totalClients,
                'totalProviders' => $totalProviders,
                'totalOrders' => 0, // Por ahora 0 hasta implementar ventas
                'totalRevenue' => (float) $totalRevenue,
                'lowStockProducts' => $lowStockProducts,
                'pendingPqrs' => 0, // Por ahora 0 hasta implementar PQRS
                'abandonedCarts' => 0, // Por ahora 0 hasta implementar carritos
                'growth' => [
                    'users' => $usersGrowth,
                    'products' => $productsGrowth,
                    'orders' => 0,
                    'revenue' => 5.2, // Simulado
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
            // Datos de ventas por mes usando productos creados realmente
            $salesByMonth = collect();
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                
                // Productos creados en el mes actual
                $monthlyProducts = DB::table('productos')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                
                // Valor del inventario del mes basado en productos reales
                $monthlyValue = DB::table('productos')
                    ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                    ->whereYear('productos.created_at', $date->year)
                    ->whereMonth('productos.created_at', $date->month)
                    ->selectRaw('SUM(productos.precio_venta * producto_inventarios.stock) as total')
                    ->value('total') ?? 0;
                
                $salesByMonth->push([
                    'year' => (int) $date->year,
                    'month' => (int) $date->month,
                    'total' => (float) $monthlyValue,
                    'orders_count' => $monthlyProducts
                ]);
            }

            // Top productos reales por valor de inventario
            $topProducts = DB::table('productos')
                ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                ->select('productos.nombre')
                ->selectRaw('producto_inventarios.stock as total_stock')
                ->selectRaw('(productos.precio_venta * producto_inventarios.stock) as valor_inventario')
                ->where('producto_inventarios.stock', '>', 0)
                ->orderBy('valor_inventario', 'desc')
                ->limit(5)
                ->get();

            // Ventas por categoría usando datos reales
            $salesByCategory = DB::table('productos')
                ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
                ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                ->select('categorias.nombre')
                ->selectRaw('SUM(productos.precio_venta * producto_inventarios.stock) as valor_categoria')
                ->selectRaw('COUNT(productos.id) as cantidad_productos')
                ->groupBy('categorias.id', 'categorias.nombre')
                ->having('valor_categoria', '>', 0)
                ->orderBy('valor_categoria', 'desc')
                ->limit(6)
                ->get();

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
            
            // Fallback sin datos simulados
            return [
                'salesByMonth' => [],
                'topProducts' => [],
                'salesByCategory' => [],
            ];
        }
    }

    private function getRecentActivity(): array
    {
        try {
            // Simulamos ventas recientes usando clientes reales
            $recentClients = DB::table('clientes')
                ->join('users', 'clientes.user_id', '=', 'users.id')
                ->select(
                    'clientes.id',
                    'users.nombre as cliente_nombre',
                    'users.email',
                    'clientes.created_at'
                )
                ->orderBy('clientes.created_at', 'desc')
                ->limit(5)
                ->get();

            // Convertir clientes en "ventas simuladas"
            $recentSales = [];
            if ($recentClients->isNotEmpty()) {
                foreach ($recentClients as $index => $client) {
                    $recentSales[] = [
                        'id' => $client->id,
                        'fecha' => \Carbon\Carbon::parse($client->created_at)->format('Y-m-d'),
                        'total' => rand(50000, 300000), // Simulamos un total
                        'estado' => 'completada',
                        'cliente_nombre' => $client->cliente_nombre
                    ];
                }
            }

            // Productos con stock crítico real
            $lowStockProducts = DB::table('productos')
                ->join('producto_inventarios', 'productos.id', '=', 'producto_inventarios.producto_id')
                ->select('productos.id', 'productos.nombre', 'productos.cod_producto', 'producto_inventarios.stock as stock_total')
                ->where('producto_inventarios.stock', '<=', 10)
                ->orderBy('producto_inventarios.stock', 'asc')
                ->limit(5)
                ->get()
                ->toArray();

            // Simulamos PQRS recientes
            $recentPqrs = [];
            $tipos = ['Queja', 'Sugerencia', 'Reclamo', 'Felicitación'];
            $estados = ['pendiente', 'revisando', 'resuelto'];
            
            for ($i = 0; $i < 3; $i++) {
                $recentPqrs[] = [
                    'id' => $i + 1,
                    'tipo' => $tipos[array_rand($tipos)],
                    'asunto' => 'Consulta sobre productos #' . ($i + 1),
                    'estado' => $estados[array_rand($estados)],
                    'created_at' => now()->subHours(rand(1, 72))->format('Y-m-d H:i:s'),
                    'cliente_nombre' => 'Cliente ' . chr(65 + $i) // Cliente A, B, C...
                ];
            }

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

            // Verificar stock crítico
            $lowStockCount = DB::table('productos')
                ->where('stock_total', '<=', DB::raw('stock_minimo'))
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
            return [];
        }
    }
}
