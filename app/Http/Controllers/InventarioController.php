<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\Producto;
use App\Models\ProductoAlmacen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class InventarioController extends Controller
{
    /**
     * Mostrar el listado de inventarios.
     */
    public function index(Request $request)
    {
        // Obtener y validar los filtros
        $search = $request->get('search', '');
        $almacenId = $request->get('almacen', '');
        $categoriaId = $request->get('categoria', '');
        
        // Configurar opciones de ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        
        // Validar campos de ordenamiento permitidos
        $validSortFields = ['producto.nombre', 'almacen.nombre', 'stock', 'created_at', 'updated_at'];
        
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
        $query = ProductoAlmacen::query()
            ->with(['producto.categoria', 'almacen'])
            ->join('producto', 'producto_almacen.producto_id', '=', 'producto.id')
            ->join('almacen', 'producto_almacen.almacen_id', '=', 'almacen.id')
            ->select('producto_almacen.*');
        
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->whereHas('producto', function($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%")
                          ->orWhere('cod_producto', 'like', "%{$search}%")
                          ->orWhere('descripcion', 'like', "%{$search}%");
                })
                ->orWhereHas('almacen', function($query) use ($search) {
                    $query->where('nombre', 'like', "%{$search}%")
                          ->orWhere('ubicacion', 'like', "%{$search}%");
                });
            });
        }
        
        // Filtrar por almacén
        if ($almacenId) {
            $query->where('almacen_id', $almacenId);
        }
        
        // Filtrar por categoría
        if ($categoriaId) {
            $query->whereHas('producto', function($q) use ($categoriaId) {
                $q->where('categoria_id', $categoriaId);
            });
        }
        
        // Aplicar ordenamiento
        if ($sortBy === 'producto.nombre') {
            $query->orderBy('producto.nombre', $sortOrder);
        } elseif ($sortBy === 'almacen.nombre') {
            $query->orderBy('almacen.nombre', $sortOrder);
        } else {
            $query->orderBy("producto_almacen.{$sortBy}", $sortOrder);
        }
        
        // Ejecutar la consulta con paginación
        $inventarios = $query->paginate($perPage)->withQueryString();
        
        // Obtener listado de almacenes y categorías para los filtros
        $almacenes = Almacen::select('id', 'nombre')->orderBy('nombre')->get();
        $categorias = DB::table('categorias')->select('id', 'nombre')->orderBy('nombre')->get();
        
        // Renderizar la vista
        return Inertia::render('Inventarios/Index', [
            'inventarios' => $inventarios,
            'almacenes' => $almacenes,
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'almacen' => $almacenId,
                'categoria' => $categoriaId,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Mostrar el formulario para crear un nuevo registro de inventario.
     */
    public function create()
    {
        $productos = Producto::orderBy('nombre')->get();
        $almacenes = Almacen::orderBy('nombre')->get();
        
        return Inertia::render('Inventarios/Create', [
            'productos' => $productos,
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * Almacenar un nuevo registro de inventario.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:producto,id',
            'almacen_id' => 'required|exists:almacen,id',
            'stock' => 'required|integer|min:0',
        ]);
        
        // Verificar si ya existe el registro
        $inventario = ProductoAlmacen::where('producto_id', $validated['producto_id'])
            ->where('almacen_id', $validated['almacen_id'])
            ->first();
            
        if ($inventario) {
            // Actualizar el stock existente
            $inventario->stock = $validated['stock'];
            $inventario->save();
            $mensaje = 'Stock actualizado exitosamente.';
        } else {
            // Crear nuevo registro
            ProductoAlmacen::create($validated);
            $mensaje = 'Producto agregado al inventario exitosamente.';
        }
        
        return redirect()->route('inventarios.index')
            ->with('success', $mensaje);
    }

    /**
     * Mostrar la información de un registro de inventario específico.
     */
    public function show(ProductoAlmacen $inventario)
    {
        // Cargar las relaciones
        $inventario->load(['producto.categoria', 'almacen']);
        
        // Verificar si el inventario se cargó correctamente
        if (!$inventario || !$inventario->exists) {
            return redirect()->route('inventarios.index')
                ->with('error', 'El registro de inventario no existe o no se pudo cargar.');
        }
        
        // Formatear las fechas y datos
        $inventarioData = [
            'id' => $inventario->id,
            'producto' => [
                'id' => $inventario->producto->id,
                'nombre' => $inventario->producto->nombre,
                'cod_producto' => $inventario->producto->cod_producto,
                'precio_venta' => $inventario->producto->precio_venta,
                'precio_compra' => $inventario->producto->precio_compra,
                'descripcion' => $inventario->producto->descripcion,
                'imagen' => $inventario->producto->imagen,
                'categoria' => $inventario->producto->categoria ? [
                    'id' => $inventario->producto->categoria->id,
                    'nombre' => $inventario->producto->categoria->nombre,
                ] : null,
            ],
            'almacen' => [
                'id' => $inventario->almacen->id,
                'nombre' => $inventario->almacen->nombre,
                'ubicacion' => $inventario->almacen->ubicacion,
            ],
            'stock' => $inventario->stock,
            'created_at' => $inventario->created_at ? $inventario->created_at->toISOString() : now()->toISOString(),
            'updated_at' => $inventario->updated_at ? $inventario->updated_at->toISOString() : now()->toISOString(),
        ];
        
        return Inertia::render('Inventarios/Show', [
            'inventario' => $inventarioData,
        ]);
    }

    /**
     * Mostrar el formulario para editar un registro de inventario.
     */
    public function edit(ProductoAlmacen $inventario)
    {
        // Cargar las relaciones
        $inventario->load(['producto', 'almacen']);
        
        // Modificar la consulta para no filtrar por estado
        $productos = Producto::orderBy('nombre')->get();
        $almacenes = Almacen::orderBy('nombre')->get();
        
        return Inertia::render('Inventarios/Edit', [
            'inventario' => $inventario,
            'productos' => $productos,
            'almacenes' => $almacenes,
        ]);
    }

    /**
     * Actualizar la información de un registro de inventario.
     */
    public function update(Request $request, ProductoAlmacen $inventario)
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);
        
        $inventario->update($validated);
        
        return redirect()->route('inventarios.index')
            ->with('success', 'Stock actualizado exitosamente.');
    }

    /**
     * Eliminar un registro de inventario.
     */
    public function destroy(ProductoAlmacen $inventario)
    {
        $inventario->delete();
        
        return redirect()->route('inventarios.index')
            ->with('success', 'Registro de inventario eliminado exitosamente.');
    }
    
    /**
     * Actualizar el stock de un producto en un almacén específico.
     */
    public function updateStock(Request $request, ProductoAlmacen $inventario)
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $inventario->update(['stock' => $validated['stock']]);

        return redirect()->back()
            ->with('success', 'Stock actualizado correctamente.');
    }
    
    /**
     * Gestionar la transferencia de stock entre almacenes.
     */
    public function transferencia(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:producto,id',
            'almacen_origen_id' => 'required|exists:almacen,id',
            'almacen_destino_id' => 'required|exists:almacen,id|different:almacen_origen_id',
            'cantidad' => 'required|integer|min:1',
        ]);

        $productoId = $validated['producto_id'];
        $origenId = $validated['almacen_origen_id'];
        $destinoId = $validated['almacen_destino_id'];
        $cantidad = $validated['cantidad'];

        DB::transaction(function () use ($productoId, $origenId, $destinoId, $cantidad) {
            // Verificar stock en origen
            $inventarioOrigen = ProductoAlmacen::where('producto_id', $productoId)
                ->where('almacen_id', $origenId)->lockForUpdate()->first();

            if (!$inventarioOrigen || $inventarioOrigen->stock < $cantidad) {
                throw new \Exception('Stock insuficiente en el almacén de origen.');
            }

            // Disminuir stock en origen
            $inventarioOrigen->decrement('stock', $cantidad);

            // Aumentar stock en destino
            $inventarioDestino = ProductoAlmacen::where('producto_id', $productoId)
                ->where('almacen_id', $destinoId)->first();
            
            if ($inventarioDestino) {
                $inventarioDestino->increment('stock', $cantidad);
            } else {
                ProductoAlmacen::create([
                    'producto_id' => $productoId,
                    'almacen_id' => $destinoId,
                    'stock' => $cantidad,
                ]);
            }
        });
        
        return redirect()->route('inventarios.index')
            ->with('success', 'Transferencia de stock realizada con éxito.');
    }
} 