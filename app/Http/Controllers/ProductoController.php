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

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $categoria = $request->get('categoria', '');
        $orden = $request->get('orden', 'nombre');
        $perPage = $request->get('per_page', 12);

        $productos = Producto::query()
            ->with(['categoria', 'promociones', 'inventarios'])
            ->when($search, function ($query, $search) {
                return $query->where('nombre', 'like', "%{$search}%")
                             ->orWhere('cod_producto', 'like', "%{$search}%")
                             ->orWhere('descripcion', 'like', "%{$search}%");
            })
            ->when($categoria, function ($query, $categoria) {
                return $query->where('categoria_id', $categoria);
            })
            ->orderBy($orden, 'asc')
            ->paginate($perPage);

        // Agregar cálculo de stock total para cada producto
        $productos->getCollection()->transform(function ($producto) {
            $producto->stock_total = $producto->inventarios->sum('stock');
            // Simulamos stock_minimo y stock_maximo para la UI
            $producto->stock_minimo = 10;
            $producto->stock_maximo = 100;
            // Simulamos estado activo para todos los productos
            $producto->estado = 'activo';
            // Usamos precio_venta como precio principal
            $producto->precio = $producto->precio_venta ?? $producto->precio_compra ?? 0;
            return $producto;
        });

        $categorias = Categoria::orderBy('nombre')->get();
        
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'categoria' => $categoria,
                'estado' => '', // Removemos filtro de estado
                'orden' => $orden,
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