<?php

namespace App\Http\Controllers;

use App\Models\Carrito;
use App\Models\Pedido;
use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Pago;
use App\Models\TipoPago;
use App\Models\Direccion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Iniciar proceso de checkout - Mostrar resumen del carrito
     */
    public function inicio(): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('carrito.index')->with('error', 'Debe ser cliente para proceder al checkout');
        }

        // Obtener carrito activo con relaciones explícitas
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->first();
        
        if ($carrito) {
            // Cargar relaciones de forma explícita
            $carrito->load([
                'detalles.productoAlmacen.producto.categoria',
                'detalles.productoAlmacen.almacen'
            ]);
        }

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'El carrito está vacío');
        }

        // Verificar stock de todos los productos
        foreach ($carrito->detalles as $detalle) {
            if ($detalle->productoAlmacen->stock < $detalle->cantidad) {
                return redirect()->route('carrito.index')
                    ->with('error', "Stock insuficiente para {$detalle->productoAlmacen->producto->nombre}");
            }
        }

        



        // Serializar manualmente para evitar problemas con Inertia
        $detallesSerializados = $carrito->detalles->map(function ($detalle) {
            return [
                'id' => $detalle->id,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
                'subtotal' => $detalle->subtotal,
                'productoAlmacen' => [
                    'id' => $detalle->productoAlmacen->id,
                    'stock' => $detalle->productoAlmacen->stock,
                    'producto' => [
                        'id' => $detalle->productoAlmacen->producto->id,
                        'nombre' => $detalle->productoAlmacen->producto->nombre,
                        'cod_producto' => $detalle->productoAlmacen->producto->cod_producto,
                        'imagen' => $detalle->productoAlmacen->producto->imagen,
                        'categoria' => [
                            'id' => $detalle->productoAlmacen->producto->categoria->id,
                            'nombre' => $detalle->productoAlmacen->producto->categoria->nombre,
                        ]
                    ]
                ]
            ];
        });

        return Inertia::render('Checkout/Resumen', [
            'carrito' => [
                'id' => $carrito->id,
                'total' => $carrito->total,
                'detalles' => $detallesSerializados
            ],
            'detalles' => $detallesSerializados,
            'total' => $carrito->total,
            'cliente' => [
                'id' => $cliente->id,
                'nombre' => $cliente->user->nombre,
                'email' => $cliente->user->email,
                'nit' => $cliente->nit,
            ]
        ]);
    }

    /**
     * Paso 1: Seleccionar dirección de entrega
     */
    public function direccion(): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('carrito.index');
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'El carrito está vacío');
        }

        // Obtener direcciones disponibles
        $direcciones = Direccion::all();

        return Inertia::render('Checkout/Direccion', [
            'carrito' => $carrito,
            'direcciones' => $direcciones,
            'total' => $carrito->total
        ]);
    }

    /**
     * Paso 2: Seleccionar tipo de pago
     */
    public function pago(Request $request): Response
    {
        $request->validate([
            'direccion_id' => 'required|exists:direccion,id'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('carrito.index');
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'El carrito está vacío');
        }

        // Obtener dirección seleccionada
        $direccion = Direccion::findOrFail($request->direccion_id);

        // Obtener tipos de pago disponibles
        $tiposPago = TipoPago::all();

        return Inertia::render('Checkout/TipoPago', [
            'carrito' => $carrito,
            'direccion' => $direccion,
            'tiposPago' => $tiposPago,
            'total' => $carrito->total
        ]);
    }

    /**
     * Paso 3a: Datos de tarjeta para pagos con tarjeta
     */
    public function datosTarjeta(Request $request): Response
    {
        $request->validate([
            'direccion_id' => 'required|exists:direccion,id',
            'tipo_pago_id' => 'required|exists:tipo_pago,id'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('carrito.index');
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'El carrito está vacío');
        }

        // Obtener datos seleccionados
        $direccion = Direccion::findOrFail($request->direccion_id);
        $tipoPago = TipoPago::findOrFail($request->tipo_pago_id);

        return Inertia::render('Checkout/DatosTarjeta', [
            'carrito' => $carrito,
            'direccion' => $direccion,
            'tipoPago' => $tipoPago,
            'total' => $carrito->total
        ]);
    }

    /**
     * Paso 3b: Confirmar pedido
     */
    public function confirmar(Request $request): Response
    {
        $request->validate([
            'direccion_id' => 'required|exists:direccion,id',
            'tipo_pago_id' => 'required|exists:tipo_pago,id'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return redirect()->route('carrito.index');
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->with(['detalles.productoAlmacen.producto'])
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return redirect()->route('carrito.index')->with('error', 'El carrito está vacío');
        }

        // Obtener datos seleccionados
        $direccion = Direccion::findOrFail($request->direccion_id);
        $tipoPago = TipoPago::findOrFail($request->tipo_pago_id);

        return Inertia::render('Checkout/Confirmar', [
            'carrito' => $carrito,
            'direccion' => $direccion,
            'tipoPago' => $tipoPago,
            'detalles' => $carrito->detalles,
            'total' => $carrito->total,
            'cliente' => [
                'nombre' => $cliente->user->nombre,
                'email' => $cliente->user->email,
                'nit' => $cliente->nit,
            ]
        ]);
    }

    /**
     * Paso 4: Procesar el pedido completo
     */
    public function procesar(Request $request)
    {
        $request->validate([
            'direccion_id' => 'required|exists:direccion,id',
            'tipo_pago_id' => 'required|exists:tipo_pago,id',
            'metodo_pago' => 'nullable|string|in:tarjeta,qr,tigo_money',
            'datos_tarjeta' => 'nullable|array',
            'datos_tarjeta.numero_tarjeta' => 'required_if:metodo_pago,tarjeta|string',
            'datos_tarjeta.nombre_titular' => 'required_if:metodo_pago,tarjeta|string',
            'datos_tarjeta.tipo_tarjeta' => 'required_if:metodo_pago,tarjeta|in:credito,debito',
            'datos_tarjeta.ultimo_digitos' => 'required_if:metodo_pago,tarjeta|string|size:4',
            'observaciones' => 'nullable|string|max:500'
        ]);

        $user = Auth::user();
        $cliente = $user->cliente;

        if (!$cliente) {
            return response()->json(['error' => 'Usuario no es cliente'], 403);
        }

        // Obtener carrito activo
        $carrito = Carrito::where('cliente_id', $cliente->id)
                         ->where('estado', 'activo')
                         ->with(['detalles.productoAlmacen.producto'])
                         ->first();

        if (!$carrito || $carrito->detalles->isEmpty()) {
            return response()->json(['error' => 'Carrito vacío'], 400);
        }

        try {
            DB::beginTransaction();

            // 1. Crear el Pedido
            $pedido = Pedido::create([
                'direccion_id' => $request->direccion_id,
                'fecha' => now(),
                'total' => $carrito->total,
                'estado' => 'pendiente',
            ]);

            // 2. Crear la Nota de Venta
            $observacionesVenta = $request->observaciones ?? 'Pedido procesado desde carrito web';
            if ($request->metodo_pago === 'tarjeta' && isset($request->datos_tarjeta)) {
                $observacionesVenta .= ' - Pago con ' . ucfirst($request->datos_tarjeta['tipo_tarjeta']) . 
                                      ' terminada en ' . $request->datos_tarjeta['ultimo_digitos'];
            } elseif ($request->metodo_pago) {
                $observacionesVenta .= ' - Pago mediante ' . strtoupper($request->metodo_pago);
            }

            $notaVenta = NotaVenta::create([
                'cliente_id' => $cliente->id,
                'pedido_id' => $pedido->id,
                'fecha' => now(),
                'total' => $carrito->total,
                'estado' => 'pendiente',
                'observaciones' => $observacionesVenta,
            ]);

            // 3. Crear detalles de venta y actualizar stock
            foreach ($carrito->detalles as $detalle) {
                // Verificar stock nuevamente
                if ($detalle->productoAlmacen->stock < $detalle->cantidad) {
                    throw new \Exception("Stock insuficiente para {$detalle->productoAlmacen->producto->nombre}");
                }

                // Crear detalle de venta
                DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_almacen_id' => $detalle->producto_almacen_id,
                    'cantidad' => $detalle->cantidad,
                    'total' => $detalle->subtotal,
                ]);

                // Actualizar stock
                $detalle->productoAlmacen->decrement('stock', $detalle->cantidad);
            }

            // 4. Crear el registro de pago
            $pago = Pago::create([
                'nota_venta_id' => $notaVenta->id,
                'tipo_pago_id' => $request->tipo_pago_id,
                'fechapago' => now(),
                'estado' => 'pendiente',
            ]);

            // 5. Actualizar carrito y pedido
            $carrito->update([
                'estado' => 'procesado',
                'pedido_id' => $pedido->id,
            ]);

            // 6. Simular procesamiento de pago (aquí iría integración real)
            $this->procesarPagoSimulado($pago, $notaVenta, $pedido);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pedido procesado exitosamente',
                'pedido_id' => $pedido->id,
                'nota_venta_id' => $notaVenta->id,
                'redirect_url' => route('checkout.exito', ['pedido' => $pedido->id])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error en checkout: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pedido: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Página de éxito
     */
    public function exito(Pedido $pedido): Response
    {
        $user = Auth::user();
        $cliente = $user->cliente;

        // Verificar que el pedido pertenece al cliente
        if (!$cliente || $pedido->notaVenta->cliente_id !== $cliente->id) {
            return redirect()->route('home')->with('error', 'Pedido no encontrado');
        }

        // Cargar relaciones
        $pedido->load([
            'direccion', 
            'notaVenta.detalles.productoAlmacen.producto',
            'notaVenta.pagos.tipoPago'
        ]);

        return Inertia::render('Checkout/Exito', [
            'pedido' => $pedido,
            'notaVenta' => $pedido->notaVenta,
            'direccion' => $pedido->direccion,
            'pago' => $pedido->notaVenta->pagos->first(),
            'detalles' => $pedido->notaVenta->detalles,
        ]);
    }

    /**
     * Método privado para simular procesamiento de pago
     */
    private function procesarPagoSimulado(Pago $pago, NotaVenta $notaVenta, Pedido $pedido): void
    {
        // Simular éxito en el 95% de los casos
        $exito = rand(1, 100) <= 95;

        if ($exito) {
            $pago->marcarPagado();
            $notaVenta->update(['estado' => 'completada']);
            $pedido->update(['estado' => 'procesando']);
        } else {
            $pago->marcarFallido();
            $notaVenta->update(['estado' => 'cancelada']);
            $pedido->update(['estado' => 'cancelado']);
        }
    }
} 