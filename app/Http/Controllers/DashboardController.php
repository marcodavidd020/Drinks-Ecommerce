<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\AjusteInventario;
use App\Models\Carrito;
use App\Models\Cliente;
use App\Models\NotaCompra;
use App\Models\NotaVenta;
use App\Models\Producto;
use App\Models\Pqrsona;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Métricas principales
        $totalVentas = NotaVenta::where('estado', 'completada')->sum('total');
        $totalClientes = Cliente::count();
        $totalProductos = Producto::count();
        $totalProveedores = Proveedor::count();
        
        // Métricas del mes actual
        $ventasEsteMes = NotaVenta::where('estado', 'completada')
            ->whereMonth('fecha', now()->month)
            ->whereYear('fecha', now()->year)
            ->sum('total');
            
        $clientesEsteMes = Cliente::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        // PQRS pendientes
        $pqrsPendientes = Pqrsona::where('estado', 'pendiente')->count();
        
        // Carritos abandonados (más de 7 días sin actividad)
        $carritosAbandonados = Carrito::where('estado', 'activo')
            ->where('updated_at', '<', now()->subDays(7))
            ->count();
            
        // Productos con stock bajo (menos de 10 unidades)
        $productosStockBajo = DB::table('producto_inventarios')
            ->select('producto_id', DB::raw('SUM(stock) as total_stock'))
            ->groupBy('producto_id')
            ->havingRaw('SUM(stock) < ?', [10])
            ->count();
            
        // Ventas por mes (últimos 6 meses) - Compatible con SQLite y PostgreSQL
        $ventasPorMes = NotaVenta::where('estado', 'completada')
            ->where('fecha', '>=', now()->subMonths(6))
            ->get()
            ->groupBy(function ($venta) {
                return $venta->fecha->format('Y-m');
            })
            ->map(function ($ventas, $periodo) {
                $fecha = \Carbon\Carbon::createFromFormat('Y-m', $periodo);
                return [
                    'mes' => (int) $fecha->month,
                    'año' => (int) $fecha->year,
                    'total' => (float) $ventas->sum('total'),
                    'cantidad' => (int) $ventas->count()
                ];
            })
            ->sortByDesc(function ($item) {
                return $item['año'] * 100 + $item['mes'];
            })
            ->values()
            ->toArray();
            
        // Productos más vendidos
        $productosMasVendidos = DB::table('detalle_ventas')
            ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
            ->join('notas_venta', 'detalle_ventas.nota_venta_id', '=', 'notas_venta.id')
            ->where('notas_venta.estado', 'completada')
            ->select(
                'productos.id',
                'productos.nombre',
                'productos.precio_venta',
                DB::raw('SUM(detalle_ventas.cantidad) as total_vendido'),
                DB::raw('SUM(detalle_ventas.total) as ingresos_totales')
            )
            ->groupBy('productos.id', 'productos.nombre', 'productos.precio_venta')
            ->orderBy('total_vendido', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($producto) {
                return [
                    'id' => (int) $producto->id,
                    'nombre' => $producto->nombre,
                    'precio_venta' => (float) $producto->precio_venta,
                    'total_vendido' => (int) $producto->total_vendido,
                    'ingresos_totales' => (float) $producto->ingresos_totales,
                ];
            })
            ->toArray();
            
        // Ventas recientes
        $ventasRecientes = NotaVenta::with(['detalles.producto'])
            ->where('estado', 'completada')
            ->orderBy('fecha', 'desc')
            ->limit(10)
            ->get();
            
        // PQRS recientes
        $pqrsRecientes = Pqrsona::orderBy('fecha_creacion', 'desc')
            ->limit(5)
            ->get();
            
        // Stock crítico (productos con stock menor a 10 unidades)
        $stockCritico = DB::table('producto_inventarios')
            ->join('productos', 'producto_inventarios.producto_id', '=', 'productos.id')
            ->join('almacenes', 'producto_inventarios.almacen_id', '=', 'almacenes.id')
            ->select(
                'productos.nombre as producto',
                'almacenes.nombre as almacen',
                'producto_inventarios.stock',
                'productos.cod_producto'
            )
            ->where('producto_inventarios.stock', '<=', 10)
            ->orderBy('producto_inventarios.stock', 'asc')
            ->limit(20)
            ->get();

        return inertia('Dashboard', [
            'totalVentas' => (float) $totalVentas,
            'totalClientes' => (int) $totalClientes,
            'totalProductos' => (int) $totalProductos,
            'totalProveedores' => (int) $totalProveedores,
            'ventasEsteMes' => (float) $ventasEsteMes,
            'clientesEsteMes' => (int) $clientesEsteMes,
            'pqrsPendientes' => (int) $pqrsPendientes,
            'carritosAbandonados' => (int) $carritosAbandonados,
            'productosStockBajo' => (int) $productosStockBajo,
            'ventasPorMes' => $ventasPorMes,
            'productosMasVendidos' => $productosMasVendidos,
            'ventasRecientes' => $ventasRecientes,
            'pqrsRecientes' => $pqrsRecientes,
            'stockCritico' => $stockCritico,
        ]);
    }
}
