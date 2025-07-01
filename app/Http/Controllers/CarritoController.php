<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\ProductoAlmacen;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CarritoController extends Controller
{
    /**
     * Mostrar el carrito del cliente
     */
    public function index(): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            // Si no es cliente, redirigir al dashboard
            return redirect()->route('dashboard');
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->with([
                             'detalles.productoAlmacen.producto.categoria',
                             'detalles.productoAlmacen.almacen'
                         ])
                         ->first();

        $detalles = $carrito ? $carrito->detalles->map(function ($detalle) {
            $productoAlmacen = $detalle->productoAlmacen;
            $producto = $productoAlmacen->producto;
            
            return [
                'id' => $detalle->id,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
                'subtotal' => $detalle->subtotal,
                'producto_almacen_id' => $detalle->producto_almacen_id,
                'producto' => [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'descripcion' => $producto->descripcion,
                    'imagen' => $producto->imagen,
                    'precio_venta' => $producto->precio_venta,
                    'categoria' => $producto->categoria ? [
                        'id' => $producto->categoria->id,
                        'nombre' => $producto->categoria->nombre
                    ] : null
                ],
                'almacen' => [
                    'id' => $productoAlmacen->almacen->id,
                    'nombre' => $productoAlmacen->almacen->nombre,
                    'stock_disponible' => $productoAlmacen->stock
                ]
            ];
        }) : collect([]);

        return Inertia::render('Cliente/Carrito', [
            'carrito' => $carrito ? [
                'id' => $carrito->id,
                'total' => $carrito->total,
                'fecha' => $carrito->fecha,
                'total_productos' => $carrito->total_productos
            ] : null,
            'detalles' => $detalles,
            'total' => $carrito ? $carrito->total : 0
        ]);
    }

    /**
     * Agregar producto al carrito
     */
    public function agregar(Request $request)
    {
        $request->validate([
            'producto_almacen_id' => 'required|exists:producto_almacen,id',
            'cantidad' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return response()->json(['error' => 'Usuario no es cliente'], 403);
        }

        $productoAlmacen = ProductoAlmacen::with('producto')->findOrFail($request->producto_almacen_id);

        // Verificar stock disponible
        if ($productoAlmacen->stock < $request->cantidad) {
            return response()->json(['error' => 'Stock insuficiente'], 400);
        }

        // Obtener o crear carrito activo
        $carrito = Carrito::obtenerOCrearCarritoActivo($cliente->id);

        // Verificar si el producto ya está en el carrito
        $detalleExistente = DetalleCarrito::where('carrito_id', $carrito->id)
                                          ->where('producto_almacen_id', $request->producto_almacen_id)
                                          ->first();

        if ($detalleExistente) {
            // Actualizar cantidad
            $nuevaCantidad = $detalleExistente->cantidad + $request->cantidad;
            
            if ($productoAlmacen->stock < $nuevaCantidad) {
                return response()->json(['error' => 'Stock insuficiente para la cantidad total'], 400);
            }

            $detalleExistente->update([
                'cantidad' => $nuevaCantidad,
                'precio_unitario' => $productoAlmacen->producto->precio_venta
            ]);
        } else {
            // Crear nuevo detalle
            DetalleCarrito::create([
                'carrito_id' => $carrito->id,
                'producto_almacen_id' => $request->producto_almacen_id,
                'cantidad' => $request->cantidad,
                'precio_unitario' => $productoAlmacen->producto->precio_venta
            ]);
        }

        // Actualizar total del carrito
        $carrito->calcularTotal();

        return response()->json([
            'message' => 'Producto agregado al carrito',
            'carrito_total' => $carrito->total,
            'carrito_items' => $carrito->total_productos
        ]);
    }

    /**
     * Actualizar cantidad de un producto en el carrito
     */
    public function actualizar(Request $request, DetalleCarrito $detalleCarrito)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        // Verificar que el detalle pertenece al cliente
        if ($detalleCarrito->carrito->cliente_id !== $cliente->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Verificar stock disponible
        if ($detalleCarrito->productoAlmacen->stock < $request->cantidad) {
            return response()->json(['error' => 'Stock insuficiente'], 400);
        }

        $detalleCarrito->update([
            'cantidad' => $request->cantidad
        ]);

        // Actualizar total del carrito
        $detalleCarrito->carrito->calcularTotal();

        return response()->json([
            'message' => 'Cantidad actualizada',
            'subtotal' => $detalleCarrito->subtotal,
            'carrito_total' => $detalleCarrito->carrito->total
        ]);
    }

    /**
     * Eliminar producto del carrito
     */
    public function eliminar(DetalleCarrito $detalleCarrito)
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        // Verificar que el detalle pertenece al cliente
        if ($detalleCarrito->carrito->cliente_id !== $cliente->id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $carrito = $detalleCarrito->carrito;
        $detalleCarrito->delete();

        // Actualizar total del carrito
        $carrito->calcularTotal();

        return response()->json([
            'message' => 'Producto eliminado del carrito',
            'carrito_total' => $carrito->total,
            'carrito_items' => $carrito->total_productos
        ]);
    }

    /**
     * Vaciar carrito completamente
     */
    public function vaciar()
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return response()->json(['error' => 'Usuario no es cliente'], 403);
        }

        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->first();

        if ($carrito) {
            $carrito->detalles()->delete();
            $carrito->update(['total' => 0]);
        }

        return response()->json(['message' => 'Carrito vaciado']);
    }

    /**
     * Procesar checkout (convertir carrito en pedido)
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return response()->json(['error' => 'Usuario no es cliente'], 403);
        }

        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->with('detalles')
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return response()->json(['error' => 'Carrito vacío'], 400);
        }

        // Verificar stock de todos los productos
        foreach ($carrito->detalles as $detalle) {
            if ($detalle->productoAlmacen->stock < $detalle->cantidad) {
                return response()->json([
                    'error' => "Stock insuficiente para {$detalle->productoAlmacen->producto->nombre}"
                ], 400);
            }
        }

        // Crear nota de venta (esto debería ir en NotaVentaController)
        // Por ahora solo marcamos el carrito como procesado
        $carrito->update(['estado' => 'procesado']);

        return response()->json([
            'message' => 'Pedido procesado exitosamente',
            'carrito_id' => $carrito->id
        ]);
    }
}