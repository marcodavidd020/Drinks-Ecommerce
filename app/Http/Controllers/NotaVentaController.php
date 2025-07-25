<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\ProductoAlmacen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class NotaVentaController extends Controller
{
    /**
     * Mostrar el listado de notas de venta.
     */
    public function index(Request $request)
    {
        // Obtener y validar los filtros
        $search = $request->get('search', '');
        $estado = $request->get('estado', '');
        
        // Configurar opciones de ordenamiento
        $sortBy = $request->get('sort_by', 'fecha');
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        
        // Validar campos de ordenamiento permitidos
        $validSortFields = ['id', 'fecha', 'total', 'estado', 'created_at'];
        
        // Verificar y corregir el campo de ordenamiento
        if (!in_array($sortBy, $validSortFields)) {
            $sortBy = 'fecha';
        }
        
        // Verificar y corregir el orden
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        // Construir la consulta
        $query = NotaVenta::query()
            ->with(['cliente.user'])
            ->withCount('detalles as productos_count');
        
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('observaciones', 'like', "%{$search}%")
                  ->orWhereHas('cliente.user', function($query) use ($search) {
                      $query->where('nombre', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }
        
        // Filtrar por estado
        if ($estado) {
            $query->where('estado', $estado);
        }
        
        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        // Ejecutar la consulta con paginación
        $ventas = $query->paginate($perPage, ['*'], 'page', $page)->withQueryString();
        
        // Transformar los datos para incluir información del cliente
        $ventas->getCollection()->transform(function ($venta) {
            return [
                'id' => $venta->id,
                'fecha' => $venta->fecha,
                'total' => $venta->total,
                'estado' => $venta->estado,
                'observaciones' => $venta->observaciones,
                'productos_count' => $venta->productos_count,
                'cliente' => $venta->cliente ? [
                    'id' => $venta->cliente->id,
                    'nombre' => $venta->cliente->user->nombre,
                    'email' => $venta->cliente->user->email,
                    'nit' => $venta->cliente->nit,
                ] : null,
                'created_at' => $venta->created_at,
                'updated_at' => $venta->updated_at,
            ];
        });

        // Obtener estadísticas básicas
        $estadisticas = [
            'total' => NotaVenta::count(),
            'completadas' => NotaVenta::where('estado', 'completada')->count(),
            'pendientes' => NotaVenta::where('estado', 'pendiente')->count(),
            'canceladas' => NotaVenta::where('estado', 'cancelada')->count(),
            'total_ventas' => NotaVenta::where('estado', 'completada')->sum('total'),
        ];
        
        // Renderizar la vista
        return Inertia::render('Ventas/Index', [
            'ventas' => $ventas,
            'estadisticas' => $estadisticas,
            'filters' => [
                'search' => $search,
                'estado' => $estado,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => (int) $perPage,
                'page' => (int) $page,
            ],
        ]);
    }

    /**
     * Mostrar formulario para crear una nueva nota de venta
     */
    public function create()
    {
        // Obtener productos con stock disponible
        $productos = Producto::with(['categoria'])
            ->whereHas('productoAlmacenes', function ($query) {
                $query->where('stock', '>', 0);
            })
            ->get()
            ->map(function ($producto) {
                // Calcular stock total disponible entre todos los almacenes
                $stockTotal = $producto->productoAlmacenes->sum('stock');
                
                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'cod_producto' => $producto->cod_producto,
                    'precio_venta' => $producto->precio_venta,
                    'stock_disponible' => $stockTotal,
                    'categoria' => $producto->categoria ? [
                        'id' => $producto->categoria->id,
                        'nombre' => $producto->categoria->nombre,
                    ] : null,
                ];
            });

        // Obtener clientes disponibles
        $clientes = \App\Models\Cliente::with('user')
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->user->nombre,
                    'email' => $cliente->user->email,
                    'nit' => $cliente->nit,
                ];
            });

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
            'clientes' => $clientes,
            'fecha_actual' => now()->format('Y-m-d'),
        ]);
    }

    /**
     * Almacenar una nueva nota de venta
     */
    public function store(Request $request)
    {
        // Validar datos de entrada
        $validated = $request->validate([
            'cliente_id' => 'required|exists:cliente,id',
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string|max:500',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:producto,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.total' => 'required|numeric|min:0',
        ]);

        // Iniciar transacción para garantizar integridad
        return DB::transaction(function () use ($validated, $request) {
            // Calcular total de la venta
            $total = collect($validated['detalles'])->sum('total');
            
            // Crear la nota de venta
            $notaVenta = NotaVenta::create([
                'cliente_id' => $validated['cliente_id'],
                'fecha' => $validated['fecha'],
                'total' => $total,
                'estado' => 'pendiente',
                'observaciones' => $validated['observaciones'] ?? null,
            ]);
            
            // Crear los detalles de la venta
            foreach ($validated['detalles'] as $detalle) {
                // Encontrar el ProductoAlmacen con stock disponible para este producto
                $productoAlmacen = ProductoAlmacen::where('producto_id', $detalle['producto_id'])
                    ->where('stock', '>=', $detalle['cantidad'])
                    ->orderBy('stock', 'desc')
                    ->first();
                
                if (!$productoAlmacen) {
                    // Si no hay stock suficiente en un solo almacén, buscar el que tenga mayor stock
                    $productoAlmacen = ProductoAlmacen::where('producto_id', $detalle['producto_id'])
                        ->where('stock', '>', 0)
                        ->orderBy('stock', 'desc')
                        ->first();
                }
                
                if (!$productoAlmacen) {
                    throw new \Exception("No hay stock disponible para el producto ID: {$detalle['producto_id']}");
                }
                
                DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $detalle['cantidad'],
                    'total' => $detalle['total'],
                ]);
                
                // Si la venta se completa automáticamente, reducir el stock
                if ($request->input('completar_automaticamente', false)) {
                    $this->reducirStock($detalle['producto_id'], $detalle['cantidad']);
                }
            }
            
            // Si se solicita completar automáticamente
            if ($request->input('completar_automaticamente', false)) {
                $notaVenta->update(['estado' => 'completada']);
            }
            
            // Redirigir a la página de detalle de la venta
            return redirect()->route('ventas.show', $notaVenta->id)
                ->with('success', 'Nota de venta creada correctamente.');
        });
    }

    /**
     * Mostrar los detalles de una nota de venta específica.
     */
    public function show(NotaVenta $venta)
    {
        // Cargar las relaciones necesarias
        $venta->load(['detalles.productoAlmacen.producto.categoria', 'cliente.user']);
        
        // Calcular totales adicionales
        $venta->setAttribute('total_productos', $venta->detalles->sum('cantidad'));
        
        // Transformar datos para la vista
        $detalles = $venta->detalles->map(function ($detalle) {
            return [
                'id' => $detalle->id,
                'producto' => [
                    'id' => $detalle->productoAlmacen->producto->id,
                    'nombre' => $detalle->productoAlmacen->producto->nombre,
                    'cod_producto' => $detalle->productoAlmacen->producto->cod_producto,
                    'categoria' => $detalle->productoAlmacen->producto->categoria ? [
                        'id' => $detalle->productoAlmacen->producto->categoria->id,
                        'nombre' => $detalle->productoAlmacen->producto->categoria->nombre,
                    ] : null,
                ],
                'cantidad' => $detalle->cantidad,
                'total' => $detalle->total,
            ];
        });
        
        // Formatear fecha y estado
        $ventaData = [
            'id' => $venta->id,
            'fecha' => $venta->fecha->format('Y-m-d'),
            'fecha_formateada' => $venta->fecha->format('d/m/Y'),
            'total' => $venta->total,
            'estado' => $venta->estado,
            'observaciones' => $venta->observaciones,
            'total_productos' => $venta->total_productos,
            'cliente' => [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->user->nombre,
                'email' => $venta->cliente->user->email,
                'nit' => $venta->cliente->nit,
            ],
            'detalles' => $detalles,
            'created_at' => $venta->created_at ? $venta->created_at->toISOString() : null,
            'updated_at' => $venta->updated_at ? $venta->updated_at->toISOString() : null,
        ];
        
        return Inertia::render('Ventas/Show', [
            'venta' => $ventaData,
        ]);
    }

    /**
     * Mostrar formulario para editar una nota de venta.
     */
    public function edit(NotaVenta $venta)
    {
        // Verificar que la venta esté en estado pendiente
        if ($venta->estado !== 'pendiente') {
            return redirect()->route('ventas.show', $venta->id)
                ->with('error', 'Solo se pueden editar ventas en estado pendiente.');
        }

        // Cargar las relaciones necesarias
        $venta->load(['detalles.productoAlmacen.producto.categoria', 'cliente.user']);
        
        // Obtener productos con stock disponible
        $productos = Producto::with(['categoria'])
            ->whereHas('productoAlmacenes', function ($query) {
                $query->where('stock', '>', 0);
            })
            ->get()
            ->map(function ($producto) {
                // Calcular stock total disponible entre todos los almacenes
                $stockTotal = $producto->productoAlmacenes->sum('stock');
                
                return [
                    'id' => $producto->id,
                    'nombre' => $producto->nombre,
                    'cod_producto' => $producto->cod_producto,
                    'precio_venta' => $producto->precio_venta,
                    'stock_disponible' => $stockTotal,
                    'categoria' => $producto->categoria ? [
                        'id' => $producto->categoria->id,
                        'nombre' => $producto->categoria->nombre,
                    ] : null,
                ];
            });

        // Obtener clientes disponibles
        $clientes = \App\Models\Cliente::with('user')
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'nombre' => $cliente->user->nombre,
                    'email' => $cliente->user->email,
                    'nit' => $cliente->nit,
                ];
            });

        // Transformar datos de la venta para la vista
        $detalles = $venta->detalles->map(function ($detalle) {
            return [
                'id' => $detalle->id,
                'producto_id' => $detalle->productoAlmacen->producto->id,
                'producto' => [
                    'id' => $detalle->productoAlmacen->producto->id,
                    'nombre' => $detalle->productoAlmacen->producto->nombre,
                    'cod_producto' => $detalle->productoAlmacen->producto->cod_producto,
                    'precio_venta' => $detalle->productoAlmacen->producto->precio_venta,
                    'categoria' => $detalle->productoAlmacen->producto->categoria ? [
                        'id' => $detalle->productoAlmacen->producto->categoria->id,
                        'nombre' => $detalle->productoAlmacen->producto->categoria->nombre,
                    ] : null,
                ],
                'cantidad' => $detalle->cantidad,
                'total' => $detalle->total,
            ];
        });

        $ventaData = [
            'id' => $venta->id,
            'cliente_id' => $venta->cliente_id,
            'fecha' => $venta->fecha->format('Y-m-d'),
            'estado' => $venta->estado,
            'observaciones' => $venta->observaciones,
            'total' => $venta->total,
            'detalles' => $detalles,
            'cliente' => [
                'id' => $venta->cliente->id,
                'nombre' => $venta->cliente->user->nombre,
                'email' => $venta->cliente->user->email,
                'nit' => $venta->cliente->nit,
            ],
        ];

        return Inertia::render('Ventas/Edit', [
            'venta' => $ventaData,
            'productos' => $productos,
            'clientes' => $clientes,
        ]);
    }

    /**
     * Actualizar una nota de venta.
     */
    public function update(Request $request, NotaVenta $venta)
    {
        // Verificar que la venta esté en estado pendiente
        if ($venta->estado !== 'pendiente') {
            return redirect()->route('ventas.show', $venta->id)
                ->with('error', 'Solo se pueden editar ventas en estado pendiente.');
        }

        // Validar datos de entrada
        $validated = $request->validate([
            'cliente_id' => 'required|exists:cliente,id',
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string|max:500',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:producto,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.total' => 'required|numeric|min:0',
        ]);

        // Iniciar transacción para garantizar integridad
        return DB::transaction(function () use ($request, $venta, $validated) {
            // Actualizar datos básicos de la venta
            $venta->update([
                'cliente_id' => $validated['cliente_id'],
                'fecha' => $validated['fecha'],
                'observaciones' => $validated['observaciones'],
            ]);

            // Eliminar detalles existentes
            $venta->detalles()->delete();

            // Crear nuevos detalles
            $totalVenta = 0;
            foreach ($validated['detalles'] as $detalle) {
                // Obtener el producto almacén con stock disponible
                $productoAlmacen = ProductoAlmacen::where('producto_id', $detalle['producto_id'])
                    ->where('stock', '>=', $detalle['cantidad'])
                    ->first();

                if (!$productoAlmacen) {
                    throw new \Exception("Stock insuficiente para el producto ID: {$detalle['producto_id']}");
                }

                // Crear el detalle
                $venta->detalles()->create([
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $detalle['cantidad'],
                    'total' => $detalle['total'],
                ]);

                $totalVenta += $detalle['total'];
            }

            // Actualizar el total de la venta
            $venta->update(['total' => $totalVenta]);

            return redirect()->route('ventas.show', $venta->id)
                ->with('success', 'Venta actualizada correctamente.');
        });
    }

    /**
     * Actualizar el estado de una nota de venta.
     */
    public function updateEstado(Request $request, NotaVenta $venta)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,completada,cancelada',
        ]);
        
        $venta->update([
            'estado' => $validated['estado'],
        ]);
        
        if ($validated['estado'] === 'completada') {
            $venta->completar();
        }
        
        return redirect()->route('ventas.show', $venta->id)
            ->with('success', 'Estado de la venta actualizado correctamente.');
    }

    /**
     * Método privado para reducir stock al completar venta
     */
    private function reducirStock($productoId, $cantidad)
    {
        // Obtener los inventarios del producto ordenados por mayor stock primero
        $inventarios = ProductoAlmacen::where('producto_id', $productoId)
            ->where('stock', '>', 0)
            ->orderBy('stock', 'desc')
            ->get();
        
        $cantidadPendiente = $cantidad;
        
        foreach ($inventarios as $inventario) {
            if ($cantidadPendiente <= 0) {
                break;
            }
            
            // Determinar cuánto podemos tomar de este inventario
            $cantidadARestar = min($cantidadPendiente, $inventario->stock);
            
            // Actualizar el inventario
            $inventario->update([
                'stock' => $inventario->stock - $cantidadARestar
            ]);
            
            $cantidadPendiente -= $cantidadARestar;
        }
    }
} 