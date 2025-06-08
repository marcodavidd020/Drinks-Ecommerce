<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\NotaVenta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\ProductoInventario;
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
            ->withCount('detalles as productos_count');
        
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('observaciones', 'like', "%{$search}%");
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
            ->whereHas('inventarios', function ($query) {
                $query->where('stock', '>', 0);
            })
            ->get()
            ->map(function ($producto) {
                // Calcular stock total disponible entre todos los almacenes
                $stockTotal = $producto->inventarios->sum('stock');
                
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

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
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
            'fecha' => 'required|date',
            'observaciones' => 'nullable|string|max:500',
            'detalles' => 'required|array|min:1',
            'detalles.*.producto_id' => 'required|exists:productos,id',
            'detalles.*.cantidad' => 'required|integer|min:1',
            'detalles.*.precio_unitario' => 'required|numeric|min:0',
            'detalles.*.total' => 'required|numeric|min:0',
        ]);

        // Iniciar transacción para garantizar integridad
        return DB::transaction(function () use ($validated, $request) {
            // Calcular total de la venta
            $total = collect($validated['detalles'])->sum('total');
            
            // Crear la nota de venta
            $notaVenta = NotaVenta::create([
                'fecha' => $validated['fecha'],
                'total' => $total,
                'estado' => 'pendiente',
                'observaciones' => $validated['observaciones'] ?? null,
            ]);
            
            // Crear los detalles de la venta
            foreach ($validated['detalles'] as $detalle) {
                DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'precio_unitario' => $detalle['precio_unitario'],
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
        $venta->load(['detalles.producto.categoria']);
        
        // Calcular totales adicionales
        $venta->setAttribute('total_productos', $venta->detalles->sum('cantidad'));
        
        // Transformar datos para la vista
        $detalles = $venta->detalles->map(function ($detalle) {
            return [
                'id' => $detalle->id,
                'producto' => [
                    'id' => $detalle->producto->id,
                    'nombre' => $detalle->producto->nombre,
                    'cod_producto' => $detalle->producto->cod_producto,
                    'categoria' => $detalle->producto->categoria ? [
                        'id' => $detalle->producto->categoria->id,
                        'nombre' => $detalle->producto->categoria->nombre,
                    ] : null,
                ],
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario,
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
            'detalles' => $detalles,
            'created_at' => $venta->created_at->toISOString(),
            'updated_at' => $venta->updated_at->toISOString(),
        ];
        
        return Inertia::render('Ventas/Show', [
            'venta' => $ventaData,
        ]);
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
        $inventarios = ProductoInventario::where('producto_id', $productoId)
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