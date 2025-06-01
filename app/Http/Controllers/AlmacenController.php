<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Almacen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AlmacenController extends Controller
{
    /**
     * Mostrar el listado de almacenes.
     */
    public function index(Request $request)
    {
        // Obtener y validar los filtros
        $search = $request->get('search', '');
        
        // Configurar opciones de ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        
        // Validar campos de ordenamiento permitidos
        $validSortFields = ['nombre', 'ubicacion', 'created_at', 'updated_at', 'productos_count'];
        
        // Verificar y corregir el campo de ordenamiento
        if (!in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        
        // Verificar y corregir el orden
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        
        $perPage = $request->get('per_page', 10);

        // Construir la consulta
        $query = Almacen::query()->withCount('inventarios as productos_count');
        
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%")
                  ->orWhere('ubicacion', 'like', "%{$search}%");
            });
        }
        
        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        // Ejecutar la consulta con paginación
        $almacenes = $query->paginate($perPage)->withQueryString();
        
        // Renderizar la vista
        return Inertia::render('Almacenes/Index', [
            'almacenes' => $almacenes,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Mostrar el formulario para crear un nuevo almacén.
     */
    public function create()
    {
        return Inertia::render('Almacenes/Create');
    }

    /**
     * Almacenar un nuevo almacén en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:almacenes,nombre',
            'descripcion' => 'nullable|string|max:500',
            'ubicacion' => 'required|string|max:200',
        ]);
        
        Almacen::create($validated);
        
        return redirect()->route('almacenes.index')
            ->with('success', 'Almacén creado exitosamente.');
    }

    /**
     * Mostrar la información de un almacén específico.
     */
    public function show(Almacen $almacen)
    {
        // Verificar si el almacén se cargó correctamente
        if (!$almacen || !$almacen->exists) {
            // Si no existe, redirigir con un mensaje de error
            return redirect()->route('almacenes.index')
                ->with('error', 'El almacén no existe o no se pudo cargar.');
        }

        // Recargar el modelo para asegurar que tenemos todos los datos
        $almacen = Almacen::find($almacen->id);
        
        if (!$almacen) {
            return redirect()->route('almacenes.index')
                ->with('error', 'No se pudo cargar el almacén desde la base de datos.');
        }

        // Log para depuración
        Log::info('Datos del almacén:', [
            'id' => $almacen->id,
            'nombre' => $almacen->nombre,
            'ubicacion' => $almacen->ubicacion,
            'created_at' => $almacen->created_at
        ]);
        
        // Cargar los productos relacionados con sus datos completos
        $almacen->load(['productos' => function ($query) {
            $query->with('categoria')->limit(10);
        }]);
        
        // Contar los productos relacionados
        $productosCount = $almacen->inventarios()->count();
        
        // Log de productos
        Log::info('Productos encontrados:', [
            'count' => $productosCount,
            'productos_cargados' => $almacen->productos->count()
        ]);
        
        // Procesar datos de productos
        $productos = $almacen->productos->map(function ($producto) {
            return [
                'id' => $producto->id,
                'nombre' => $producto->nombre,
                'cod_producto' => $producto->cod_producto,
                'precio_venta' => $producto->precio_venta,
                'imagen' => $producto->imagen,
                'pivot' => [
                    'stock' => $producto->pivot->stock ?? 0
                ]
            ];
        });
        
        // Formatear fechas con comprobación de nulos
        $created_at = $almacen->created_at ? $almacen->created_at->toISOString() : now()->toISOString();
        $updated_at = $almacen->updated_at ? $almacen->updated_at->toISOString() : now()->toISOString();
        
        // Construir el array de datos
        $almacenData = [
            'id' => $almacen->id,
            'nombre' => $almacen->nombre ?? 'Sin nombre',
            'descripcion' => $almacen->descripcion,
            'ubicacion' => $almacen->ubicacion ?? 'Sin ubicación',
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'productos' => $productos,
            'productos_count' => $productosCount
        ];
        
        return Inertia::render('Almacenes/Show', [
            'almacen' => $almacenData,
        ]);
    }

    /**
     * Mostrar el formulario para editar un almacén.
     */
    public function edit(Almacen $almacen)
    {
        return Inertia::render('Almacenes/Edit', [
            'almacen' => $almacen,
        ]);
    }

    /**
     * Actualizar la información de un almacén.
     */
    public function update(Request $request, Almacen $almacen)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:almacenes,nombre,' . $almacen->id,
            'descripcion' => 'nullable|string|max:500',
            'ubicacion' => 'required|string|max:200',
        ]);
        
        $almacen->update($validated);
        
        return redirect()->route('almacenes.index')
            ->with('success', 'Almacén actualizado exitosamente.');
    }

    /**
     * Eliminar un almacén.
     */
    public function destroy(Almacen $almacen)
    {
        // Verificar si tiene productos asociados
        if ($almacen->inventarios()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el almacén porque tiene productos asociados.');
        }
        
        $almacen->delete();
        
        return back()->with('success', 'Almacén eliminado exitosamente.');
    }
}
