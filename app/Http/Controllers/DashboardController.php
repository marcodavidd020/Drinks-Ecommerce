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
        // Obtener métricas principales
        $totalVentas = NotaVenta::where('estado', 'completada')->sum('total');
        $totalClientes = Cliente::count();
        $totalProductos = Producto::count();
        $totalProveedores = Proveedor::count();

        // Métricas del mes actual
        $mesActual = now()->month;
        $añoActual = now()->year;
        
        $ventasEsteMes = NotaVenta::where('estado', 'completada')
            ->whereRaw('EXTRACT(MONTH FROM fecha) = ?', [$mesActual])
            ->whereRaw('EXTRACT(YEAR FROM fecha) = ?', [$añoActual])
            ->sum('total');

        $clientesEsteMes = Cliente::whereRaw('EXTRACT(MONTH FROM created_at) = ?', [$mesActual])
            ->whereRaw('EXTRACT(YEAR FROM created_at) = ?', [$añoActual])
            ->count();

        // Métricas de alerta
        $pqrsPendientes = Pqrsona::where('estado', 'pendiente')->count();
        
        $carritosAbandonados = Carrito::where('estado', 'activo')
            ->where('updated_at', '<', now()->subDays(7))
            ->count();

        // Corregir consulta de stock bajo usando ProductoInventario
        $productosStockBajo = ProductoInventario::select('producto_id')
            ->groupBy('producto_id')
            ->havingRaw('SUM(stock) < ?', [10])
            ->count();

        // Datos para gráficas - Ventas por mes (últimos 6 meses) - Sintaxis PostgreSQL
        $ventasPorMes = NotaVenta::selectRaw('EXTRACT(MONTH FROM fecha) as mes, EXTRACT(YEAR FROM fecha) as año, SUM(total) as total')
            ->where('estado', 'completada')
            ->where('fecha', '>=', now()->subMonths(6))
            ->groupByRaw('EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha)')
            ->orderByRaw('EXTRACT(YEAR FROM fecha) ASC, EXTRACT(MONTH FROM fecha) ASC')
            ->get();

        // Productos más vendidos
        $productosMasVendidos = DB::table('detalle_ventas')
            ->join('productos', 'detalle_ventas.producto_id', '=', 'productos.id')
            ->join('notas_venta', 'detalle_ventas.nota_venta_id', '=', 'notas_venta.id')
            ->where('notas_venta.estado', 'completada')
            ->select('productos.nombre', DB::raw('SUM(detalle_ventas.cantidad) as total_vendido'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderBy('total_vendido', 'desc')
            ->limit(10)
            ->get();

        // Ventas recientes
        $ventasRecientes = NotaVenta::with(['detalles.producto'])
            ->orderBy('fecha', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($venta) {
                return [
                    'id' => $venta->id,
                    'fecha' => $venta->fecha->format('d/m/Y'),
                    'total' => $venta->total,
                    'estado' => $venta->estado,
                ];
            });

        // PQRS recientes
        $pqrsRecientes = Pqrsona::orderBy('fecha_creacion', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($pqrs) {
                return [
                    'id' => $pqrs->id,
                    'tipo' => $pqrs->tipo,
                    'nombre_completo' => $pqrs->nombre_completo,
                    'descripcion' => $pqrs->descripcion,
                    'estado' => $pqrs->estado,
                    'fecha_creacion' => $pqrs->fecha_creacion,
                ];
            });

        // Stock crítico usando ProductoInventario
        $stockCritico = ProductoInventario::with(['producto', 'almacen'])
            ->where('stock', '<', 10)
            ->limit(10)
            ->get()
            ->map(function ($inventario) {
                return [
                    'id' => $inventario->id,
                    'producto' => $inventario->producto->nombre ?? 'Producto no encontrado',
                    'almacen' => $inventario->almacen->nombre ?? 'Almacén no encontrado',
                    'stock' => $inventario->stock,
                    'cod_producto' => $inventario->producto->cod_producto ?? 'N/A',
                ];
            });

        return Inertia::render('dashboard', [
            'totalVentas' => $totalVentas,
            'totalClientes' => $totalClientes,
            'totalProductos' => $totalProductos,
            'totalProveedores' => $totalProveedores,
            'ventasEsteMes' => $ventasEsteMes,
            'clientesEsteMes' => $clientesEsteMes,
            'pqrsPendientes' => $pqrsPendientes,
            'carritosAbandonados' => $carritosAbandonados,
            'productosStockBajo' => $productosStockBajo,
            'ventasPorMes' => $ventasPorMes,
            'productosMasVendidos' => $productosMasVendidos,
            'ventasRecientes' => $ventasRecientes,
            'pqrsRecientes' => $pqrsRecientes,
            'stockCritico' => $stockCritico,
        ]);
    }
}
