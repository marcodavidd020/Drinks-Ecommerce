<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\NotaVenta;
use App\Models\NotaCompra;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\ProductoAlmacen;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index', [
            'stats' => $this->getGeneralStats()
        ]);
    }

    public function sales(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        
        $sales = NotaVenta::with(['cliente', 'detalles.productoAlmacen.producto'])
            ->whereBetween('fecha', [$startDate, $endDate])
            ->orderBy('fecha', 'desc')
            ->get();

        $salesStats = $this->getSalesStats($startDate, $endDate);
        $salesByCategory = $this->getSalesByCategory($startDate, $endDate);
        $salesByMonth = $this->getSalesByMonth($startDate, $endDate);

        return Inertia::render('Reports/Sales', [
            'sales' => $sales,
            'salesStats' => $salesStats,
            'salesByCategory' => $salesByCategory,
            'salesByMonth' => $salesByMonth,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function inventory(Request $request)
    {
        $lowStockThreshold = $request->input('low_stock_threshold', 10);
        
        $inventory = ProductoAlmacen::with(['producto.categoria', 'almacen'])
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->select('producto_almacen.*', 'producto.nombre as producto_nombre', 'producto.precio_venta')
            ->orderBy('stock', 'asc')
            ->get();

        $inventoryStats = $this->getInventoryStats($lowStockThreshold);
        $stockByCategory = $this->getStockByCategory();
        $lowStockProducts = $inventory->where('stock', '<=', $lowStockThreshold);

        return Inertia::render('Reports/Inventory', [
            'inventory' => $inventory,
            'inventoryStats' => $inventoryStats,
            'stockByCategory' => $stockByCategory,
            'lowStockProducts' => $lowStockProducts,
            'filters' => [
                'low_stock_threshold' => $lowStockThreshold,
            ],
        ]);
    }

    public function clients(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $clients = Cliente::with(['user'])
        ->withCount(['notasVenta as numero_compras' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        }])
        ->withSum(['notasVenta as total_compras' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        }], 'total')
        ->addSelect([
            'fecha_ultima_compra' => NotaVenta::select('fecha')
                ->whereColumn('cliente_id', 'cliente.id')
                ->whereBetween('fecha', [$startDate, $endDate])
                ->orderBy('fecha', 'desc')
                ->limit(1)
        ])
        ->get()
        ->map(function($cliente) {
            return [
                'id' => $cliente->id,
                'nombre' => $cliente->user->nombre ?? 'Sin nombre',
                'email' => $cliente->user->email ?? 'Sin email',
                'telefono' => $cliente->telefono ?? '',
                'direccion' => $cliente->direccion ?? '',
                'total_compras' => $cliente->total_compras ?? 0,
                'numero_compras' => $cliente->numero_compras ?? 0,
                'promedio_compra' => $cliente->numero_compras > 0 ? ($cliente->total_compras / $cliente->numero_compras) : 0,
                'fecha_ultima_compra' => $cliente->fecha_ultima_compra ?? Carbon::now()->format('Y-m-d'),
            ];
        })
        ->filter(function($cliente) {
            return $cliente['numero_compras'] > 0;
        })
        ->sortByDesc('total_compras')
        ->values();

        return Inertia::render('Reports/Clients', [
            'clientes' => $clients,
            'totalClientes' => Cliente::count(),
            'clientesActivos' => $clients->count(),
            'promedioComprasPorCliente' => $clients->avg('total_compras') ?? 0,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    public function purchases(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $purchases = NotaCompra::with(['proveedor', 'detalles.productoAlmacen.producto'])
            ->whereBetween('fecha', [$startDate, $endDate])
            ->orderBy('fecha', 'desc')
            ->get();

        $purchaseStats = $this->getPurchaseStats($startDate, $endDate);
        $purchasesByCategory = $this->getPurchasesByCategory($startDate, $endDate);

        return Inertia::render('Reports/Purchases', [
            'notas' => $purchases,
            'totalAmount' => $purchaseStats['total_purchases'],
            'totalPurchases' => $purchaseStats['total_orders'],
            'averageAmount' => $purchaseStats['average_order_value'],
            'purchasesByCategory' => $purchasesByCategory,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    // PDF Generation Methods
    public function downloadSalesPdf(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));
        
        $sales = NotaVenta::with(['cliente', 'detalles.productoAlmacen.producto'])
            ->whereBetween('fecha', [$startDate, $endDate])
            ->orderBy('fecha', 'desc')
            ->get();

        $salesStats = $this->getSalesStats($startDate, $endDate);
        $salesByCategory = $this->getSalesByCategory($startDate, $endDate);

        $pdf = Pdf::loadView('reports.sales', compact('sales', 'salesStats', 'salesByCategory', 'startDate', 'endDate'));
        
        return $pdf->download('reporte-ventas-' . $startDate . '-' . $endDate . '.pdf');
    }

    public function downloadInventoryPdf(Request $request)
    {
        $lowStockThreshold = $request->input('low_stock_threshold', 10);
        
        $inventory = ProductoAlmacen::with(['producto.categoria', 'almacen'])
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->select('producto_almacen.*', 'producto.nombre as producto_nombre', 'producto.precio_venta')
            ->orderBy('stock', 'asc')
            ->get();

        $inventoryStats = $this->getInventoryStats($lowStockThreshold);
        $stockByCategory = $this->getStockByCategory();
        $lowStockProducts = $inventory->where('stock', '<=', $lowStockThreshold);

        $pdf = Pdf::loadView('reports.inventory', compact('inventory', 'inventoryStats', 'stockByCategory', 'lowStockProducts', 'lowStockThreshold'));
        
        return $pdf->download('reporte-inventario-' . Carbon::now()->format('Y-m-d') . '.pdf');
    }

    public function downloadClientsPdf(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $clients = Cliente::with(['user', 'notasVenta' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        }])
        ->withCount(['notasVenta as total_compras' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        }])
        ->withSum(['notasVenta as total_gastado' => function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        }], 'total')
        ->orderBy('total_gastado', 'desc')
        ->get();

        $clientStats = $this->getClientStats($startDate, $endDate);

        $pdf = Pdf::loadView('reports.clients', compact('clients', 'clientStats', 'startDate', 'endDate'));
        
        return $pdf->download('reporte-clientes-' . $startDate . '-' . $endDate . '.pdf');
    }

    public function downloadPurchasesPdf(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $purchases = NotaCompra::with(['proveedor', 'detalles.productoAlmacen.producto'])
            ->whereBetween('fecha', [$startDate, $endDate])
            ->orderBy('fecha', 'desc')
            ->get();

        $purchaseStats = $this->getPurchaseStats($startDate, $endDate);
        $purchasesByCategory = $this->getPurchasesByCategory($startDate, $endDate);

        $pdf = Pdf::loadView('reports.purchases', compact('purchases', 'purchaseStats', 'purchasesByCategory', 'startDate', 'endDate'));
        
        return $pdf->download('reporte-compras-' . $startDate . '-' . $endDate . '.pdf');
    }

    // Helper Methods for Statistics
    private function getGeneralStats()
    {
        $totalSales = NotaVenta::sum('total');
        $totalPurchases = NotaCompra::sum('total');
        $totalProducts = Producto::count();
        $totalClients = Cliente::count();
        $lowStockProducts = ProductoAlmacen::where('stock', '<=', 10)->count();

        return [
            'total_sales' => $totalSales,
            'total_purchases' => $totalPurchases,
            'total_products' => $totalProducts,
            'total_clients' => $totalClients,
            'low_stock_products' => $lowStockProducts,
        ];
    }

    private function getSalesStats($startDate, $endDate)
    {
        $totalSales = NotaVenta::whereBetween('fecha', [$startDate, $endDate])->sum('total');
        $totalOrders = NotaVenta::whereBetween('fecha', [$startDate, $endDate])->count();
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;

        return [
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'average_order_value' => $averageOrderValue,
        ];
    }

    private function getSalesByCategory($startDate, $endDate)
    {
        return DB::table('detalle_venta')
            ->join('nota_venta', 'detalle_venta.nota_venta_id', '=', 'nota_venta.id')
            ->join('producto_almacen', 'detalle_venta.producto_almacen_id', '=', 'producto_almacen.id')
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->join('categoria', 'producto.categoria_id', '=', 'categoria.id')
            ->whereBetween('nota_venta.fecha', [$startDate, $endDate])
            ->groupBy('categoria.id', 'categoria.nombre')
            ->select('categoria.nombre as categoria', DB::raw('SUM(detalle_venta.total) as total'))
            ->orderBy('total', 'desc')
            ->get();
    }

    private function getSalesByMonth($startDate, $endDate)
    {
        return NotaVenta::whereBetween('fecha', [$startDate, $endDate])
            ->select(DB::raw('EXTRACT(month FROM fecha) as month, EXTRACT(year FROM fecha) as year, SUM(total) as total'))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
    }

    private function getInventoryStats($lowStockThreshold)
    {
        $totalProducts = ProductoAlmacen::sum('stock');
        $totalValue = ProductoAlmacen::join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->sum(DB::raw('producto_almacen.stock * producto.precio_venta'));
        $lowStockCount = ProductoAlmacen::where('stock', '<=', $lowStockThreshold)->count();

        return [
            'total_products' => $totalProducts,
            'total_value' => $totalValue,
            'low_stock_count' => $lowStockCount,
        ];
    }

    private function getStockByCategory()
    {
        return DB::table('producto_almacen')
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->join('categoria', 'producto.categoria_id', '=', 'categoria.id')
            ->groupBy('categoria.id', 'categoria.nombre')
            ->select('categoria.nombre as categoria', DB::raw('SUM(producto_almacen.stock) as stock'))
            ->orderBy('stock', 'desc')
            ->get();
    }

    private function getClientStats($startDate, $endDate)
    {
        $totalClients = Cliente::count();
        $activeClients = Cliente::whereHas('notasVenta', function($query) use ($startDate, $endDate) {
            $query->whereBetween('fecha', [$startDate, $endDate]);
        })->count();
        $newClients = Cliente::whereBetween('created_at', [$startDate, $endDate])->count();

        return [
            'total_clients' => $totalClients,
            'active_clients' => $activeClients,
            'new_clients' => $newClients,
        ];
    }

    private function getPurchaseStats($startDate, $endDate)
    {
        $totalPurchases = NotaCompra::whereBetween('fecha', [$startDate, $endDate])->sum('total');
        $totalOrders = NotaCompra::whereBetween('fecha', [$startDate, $endDate])->count();
        $averageOrderValue = $totalOrders > 0 ? $totalPurchases / $totalOrders : 0;

        return [
            'total_purchases' => $totalPurchases,
            'total_orders' => $totalOrders,
            'average_order_value' => $averageOrderValue,
        ];
    }

    private function getPurchasesByCategory($startDate, $endDate)
    {
        return DB::table('detalle_compra')
            ->join('nota_compra', 'detalle_compra.nota_compra_id', '=', 'nota_compra.id')
            ->join('producto_almacen', 'detalle_compra.producto_almacen_id', '=', 'producto_almacen.id')
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->join('categoria', 'producto.categoria_id', '=', 'categoria.id')
            ->whereBetween('nota_compra.fecha', [$startDate, $endDate])
            ->groupBy('categoria.id', 'categoria.nombre')
            ->select('categoria.nombre as categoria', DB::raw('SUM(detalle_compra.total) as total'))
            ->orderBy('total', 'desc')
            ->get();
    }
} 