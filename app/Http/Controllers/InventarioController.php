<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Almacen;
use App\Models\Producto;
use App\Models\ProductoInventario;
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
        $query = ProductoInventario::query()
            ->with(['producto.categoria', 'almacen'])
            ->join('productos', 'producto_inventarios.producto_id', '=', 'productos.id')
            ->join('almacenes', 'producto_inventarios.almacen_id', '=', 'almacenes.id')
            ->select('producto_inventarios.*');
        
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
            $query->orderBy('productos.nombre', $sortOrder);
        } elseif ($sortBy === 'almacen.nombre') {
            $query->orderBy('almacenes.nombre', $sortOrder);
        } else {
            $query->orderBy("producto_inventarios.{$sortBy}", $sortOrder);
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
        $productos = Producto::where('estado', 'activo')->orderBy('nombre')->get();
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
            'producto_id' => 'required|exists:productos,id',
            'almacen_id' => 'required|exists:almacenes,id',
            'stock' => 'required|integer|min:0',
        ]);
        
        // Verificar si ya existe el registro
        $inventario = ProductoInventario::where('producto_id', $validated['producto_id'])
            ->where('almacen_id', $validated['almacen_id'])
            ->first();
            
        if ($inventario) {
            // Actualizar el stock existente
            $inventario->stock = $validated['stock'];
            $inventario->save();
            $mensaje = 'Stock actualizado exitosamente.';
        } else {
            // Crear nuevo registro
            ProductoInventario::create($validated);
            $mensaje = 'Producto agregado al inventario exitosamente.';
        }
        
        return redirect()->route('inventarios.index')
            ->with('success', $mensaje);
    }

    /**
     * Mostrar la información de un registro de inventario específico.
     */
    public function show(ProductoInventario $inventario)
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
    public function edit(ProductoInventario $inventario)
    {
        // Cargar las relaciones
        $inventario->load(['producto', 'almacen']);
        
        $productos = Producto::where('estado', 'activo')->orderBy('nombre')->get();
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
    public function update(Request $request, ProductoInventario $inventario)
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
    public function destroy(ProductoInventario $inventario)
    {
        $inventario->delete();
        
        return redirect()->route('inventarios.index')
            ->with('success', 'Registro de inventario eliminado exitosamente.');
    }
    
    /**
     * Actualizar el stock de un producto en un almacén específico.
     */
    public function updateStock(Request $request, ProductoInventario $inventario)
    {
        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);
        
        $inventario->stock = $validated['stock'];
        $inventario->save();
        
        return back()->with('success', 'Stock actualizado exitosamente.');
    }
    
    /**
     * Transferir productos entre almacenes.
     */
    public function transferencia(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'almacen_origen_id' => 'required|exists:almacenes,id',
            'almacen_destino_id' => 'required|exists:almacenes,id|different:almacen_origen_id',
            'cantidad' => 'required|integer|min:1',
        ]);
        
        // Obtener inventario de origen
        $origen = ProductoInventario::where('producto_id', $validated['producto_id'])
            ->where('almacen_id', $validated['almacen_origen_id'])
            ->first();
            
        if (!$origen || $origen->stock < $validated['cantidad']) {
            return back()->with('error', 'No hay suficiente stock en el almacén de origen.');
        }
        
        // Obtener o crear inventario de destino
        $destino = ProductoInventario::firstOrNew([
            'producto_id' => $validated['producto_id'],
            'almacen_id' => $validated['almacen_destino_id'],
        ]);
        
        if (!$destino->exists) {
            $destino->stock = 0;
        }
        
        // Iniciar transacción
        DB::beginTransaction();
        
        try {
            // Restar del origen
            $origen->stock -= $validated['cantidad'];
            $origen->save();
            
            // Sumar al destino
            $destino->stock += $validated['cantidad'];
            $destino->save();
            
            DB::commit();
            
            return redirect()->route('inventarios.index')
                ->with('success', 'Transferencia de productos realizada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en transferencia de inventario: ' . $e->getMessage());
            
            return back()->with('error', 'Ocurrió un error al realizar la transferencia.');
        }
    }
} 