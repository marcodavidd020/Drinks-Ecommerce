<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $categoria = $request->get('categoria', '');
        
        // Configurar opciones de ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        
        // Validar campos de ordenamiento permitidos
        $validSortFields = ['nombre', 'created_at', 'updated_at', 'precio_venta', 'precio_compra', 'cod_producto'];
        
        // Verificar y corregir el campo de ordenamiento
        if (!in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        
        // Verificar y corregir el orden
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }
        
        $perPage = $request->get('per_page', 12);

        // Construir la consulta
        $query = Producto::query()
            ->with(['categoria', 'promociones', 'inventarios']);
            
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('cod_producto', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }
        
        // Filtrar por categoría
        if ($categoria) {
            $query->where('categoria_id', $categoria);
        }
        
        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        // Ejecutar la consulta con paginación
        $productos = $query->paginate($perPage);

        // Procesar los resultados
        $productos->getCollection()->transform(function ($producto) {
            $producto->stock_total = $producto->inventarios->sum('stock');
            $producto->stock_minimo = 10; // Simulado
            $producto->stock_maximo = 100; // Simulado
            $producto->estado = 'activo'; // Simulado
            $producto->precio = $producto->precio_venta ?? $producto->precio_compra ?? 0;
            return $producto;
        });

        // Obtener categorías para el filtro
        $categorias = Categoria::orderBy('nombre')->get();
        
        // Renderizar la vista
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'categoria' => $categoria,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categorias = Categoria::orderBy('nombre')->get();
        $promociones = Promocion::where('estado', 'activa')->orderBy('nombre')->get();
        
        return Inertia::render('Productos/Create', [
            'categorias' => $categorias,
            'promociones' => $promociones,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cod_producto' => ['required', 'string', 'max:50', 'unique:productos'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'categoria_id' => ['required', 'exists:categorias,id'],
            'precio_compra' => ['required', 'numeric', 'min:0'],
            'precio_venta' => ['required', 'numeric', 'min:0'],
            'imagen' => ['nullable', 'string', 'max:500'], // URL de imagen
        ]);

        $producto = Producto::create([
            'cod_producto' => $validated['cod_producto'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'precio_compra' => $validated['precio_compra'],
            'precio_venta' => $validated['precio_venta'],
            'imagen' => $validated['imagen'],
        ]);

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto): Response
    {
        $producto->load(['categoria', 'promociones', 'inventarios.almacen']);
        
        // Calcular stock total
        $producto->stock_total = $producto->inventarios->sum('stock');
        
        return Inertia::render('Productos/Show', [
            'producto' => $producto
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto): Response
    {
        $producto->load(['categoria', 'promociones']);
        $categorias = Categoria::orderBy('nombre')->get();
        
        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Producto $producto): RedirectResponse
    {
        $validated = $request->validate([
            'cod_producto' => ['required', 'string', 'max:50', 'unique:productos,cod_producto,' . $producto->id],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'categoria_id' => ['required', 'exists:categorias,id'],
            'precio_compra' => ['required', 'numeric', 'min:0'],
            'precio_venta' => ['required', 'numeric', 'min:0'],
            'imagen' => ['nullable', 'string', 'max:500'], // URL de imagen
        ]);

        $producto->update([
            'cod_producto' => $validated['cod_producto'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'precio_compra' => $validated['precio_compra'],
            'precio_venta' => $validated['precio_venta'],
            'imagen' => $validated['imagen'],
        ]);

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto): RedirectResponse
    {
        // Desconectar promociones si existen
        $producto->promociones()->detach();

        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, Producto $producto): RedirectResponse
    {
        $validated = $request->validate([
            'stock_total' => ['required', 'integer', 'min:0'],
            'tipo_movimiento' => ['required', 'string', 'in:entrada,salida,ajuste'],
            'motivo' => ['nullable', 'string', 'max:255'],
        ]);

        $stockAnterior = $producto->stock_total;
        
        switch ($validated['tipo_movimiento']) {
            case 'entrada':
                $nuevoStock = $stockAnterior + $validated['stock_total'];
                break;
            case 'salida':
                $nuevoStock = $stockAnterior - $validated['stock_total'];
                break;
            case 'ajuste':
                $nuevoStock = $validated['stock_total'];
                break;
        }

        // Validar que el nuevo stock no sea negativo
        if ($nuevoStock < 0) {
            return back()->withErrors([
                'stock_total' => 'El stock no puede ser negativo.'
            ]);
        }

        $producto->update([
            'stock_total' => $nuevoStock
        ]);

        return redirect()->route('productos.show', $producto)
            ->with('success', "Stock actualizado exitosamente. Stock anterior: {$stockAnterior}, Stock actual: {$nuevoStock}");
    }
} 