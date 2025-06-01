<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\NotaVenta;
use App\Models\DetalleVenta;
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
} 