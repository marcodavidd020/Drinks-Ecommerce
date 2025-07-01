<?php

namespace App\Http\Controllers;

use App\Models\NotaVenta;
use App\Models\Carrito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ClienteDashboardController extends Controller
{
    /**
     * Dashboard principal del cliente
     */
    public function index(): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('dashboard');
        }

        // Obtener carrito activo
        $carritoActivo = Carrito::where('cliente_id', $cliente->id)
                               ->where('estado', 'activo')
                               ->with('detalles.productoAlmacen.producto')
                               ->first();

        // Obtener últimas compras (notas de venta)
        $ultimasCompras = NotaVenta::where('cliente_id', $cliente->id)
                                  ->with(['detalles.productoAlmacen.producto'])
                                  ->orderBy('created_at', 'desc')
                                  ->limit(5)
                                  ->get()
                                  ->map(function ($venta) {
                                      return [
                                          'id' => $venta->id,
                                          'fecha' => $venta->fecha,
                                          'total' => $venta->total,
                                          'estado' => $venta->estado,
                                          'productos_count' => $venta->detalles->count(),
                                          'productos' => $venta->detalles->take(3)->map(function ($detalle) {
                                              return [
                                                  'nombre' => $detalle->productoAlmacen->producto->nombre,
                                                  'cantidad' => $detalle->cantidad
                                              ];
                                          })
                                      ];
                                  });

        // Estadísticas del cliente
        $estadisticas = [
            'total_compras' => NotaVenta::where('cliente_id', $cliente->id)->count(),
            'total_gastado' => NotaVenta::where('cliente_id', $cliente->id)
                                      ->where('estado', 'completada')
                                      ->sum('total'),
            'productos_en_carrito' => $carritoActivo ? $carritoActivo->total_productos : 0,
            'valor_carrito' => $carritoActivo ? $carritoActivo->total : 0,
        ];

        return Inertia::render('Cliente/Dashboard', [
            'cliente' => [
                'id' => $cliente->id,
                'nit' => $cliente->nit,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'celular' => $user->celular
            ],
            'estadisticas' => $estadisticas,
            'carrito_activo' => $carritoActivo ? [
                'id' => $carritoActivo->id,
                'total' => $carritoActivo->total,
                'total_productos' => $carritoActivo->total_productos,
                'productos_preview' => $carritoActivo->detalles->take(3)->map(function ($detalle) {
                    return [
                        'nombre' => $detalle->productoAlmacen->producto->nombre,
                        'cantidad' => $detalle->cantidad,
                        'precio' => $detalle->precio_unitario
                    ];
                })
            ] : null,
            'ultimas_compras' => $ultimasCompras
        ]);
    }

    /**
     * Historial de compras del cliente
     */
    public function compras(): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('dashboard');
        }

        $compras = NotaVenta::where('cliente_id', $cliente->id)
                           ->with(['detalles.productoAlmacen.producto.categoria'])
                           ->orderBy('created_at', 'desc')
                           ->paginate(10)
                           ->through(function ($venta) {
                               return [
                                   'id' => $venta->id,
                                   'fecha' => $venta->fecha,
                                   'total' => $venta->total,
                                   'estado' => $venta->estado,
                                   'productos' => $venta->detalles->map(function ($detalle) {
                                       return [
                                           'id' => $detalle->id,
                                           'nombre' => $detalle->productoAlmacen->producto->nombre,
                                           'categoria' => $detalle->productoAlmacen->producto->categoria->nombre ?? 'Sin categoría',
                                           'cantidad' => $detalle->cantidad,
                                           'precio_unitario' => $detalle->precio_unitario,
                                           'subtotal' => $detalle->subtotal,
                                           'imagen' => $detalle->productoAlmacen->producto->imagen
                                       ];
                                   })
                               ];
                           });

        return Inertia::render('Cliente/Compras', [
            'compras' => $compras
        ]);
    }

    /**
     * Ver detalle de una compra específica
     */
    public function verCompra(NotaVenta $venta): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        // Verificar que la venta pertenece al cliente
        if ($venta->cliente_id !== $cliente->id) {
            abort(403, 'No autorizado');
        }

        $venta->load(['detalles.productoAlmacen.producto.categoria']);

        return Inertia::render('Cliente/CompraDetalle', [
            'venta' => [
                'id' => $venta->id,
                'fecha' => $venta->fecha,
                'total' => $venta->total,
                'estado' => $venta->estado,
                'observaciones' => $venta->observaciones,
                'productos' => $venta->detalles->map(function ($detalle) {
                    return [
                        'id' => $detalle->id,
                        'nombre' => $detalle->productoAlmacen->producto->nombre,
                        'descripcion' => $detalle->productoAlmacen->producto->descripcion,
                        'categoria' => $detalle->productoAlmacen->producto->categoria->nombre ?? 'Sin categoría',
                        'cantidad' => $detalle->cantidad,
                        'precio_unitario' => $detalle->precio_unitario,
                        'subtotal' => $detalle->subtotal,
                        'imagen' => $detalle->productoAlmacen->producto->imagen
                    ];
                })
            ]
        ]);
    }
}