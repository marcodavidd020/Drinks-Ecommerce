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
        $estado = $request->get('estado', '');
        $orden = $request->get('orden', 'nombre');
        $perPage = $request->get('per_page', 12);

        $productos = Producto::query()
            ->with(['categoria', 'promociones'])
            ->when($search, function ($query, $search) {
                return $query->where('nombre', 'like', "%{$search}%")
                             ->orWhere('cod_producto', 'like', "%{$search}%")
                             ->orWhere('descripcion', 'like', "%{$search}%");
            })
            ->when($categoria, function ($query, $categoria) {
                return $query->where('categoria_id', $categoria);
            })
            ->when($estado, function ($query, $estado) {
                return $query->where('estado', $estado);
            })
            ->orderBy($orden, 'asc')
            ->paginate($perPage);

        $categorias = Categoria::orderBy('nombre')->get();
        
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'categoria' => $categoria,
                'estado' => $estado,
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
            'precio' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['required', 'integer', 'min:0'],
            'stock_maximo' => ['required', 'integer', 'min:1'],
            'stock_total' => ['required', 'integer', 'min:0'],
            'imagen' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
            'promociones' => ['nullable', 'array'],
            'promociones.*' => ['exists:promociones,id'],
        ]);

        // Validar que stock_total esté entre stock_minimo y stock_maximo
        if ($validated['stock_total'] < $validated['stock_minimo'] || 
            $validated['stock_total'] > $validated['stock_maximo']) {
            return back()->withErrors([
                'stock_total' => 'El stock actual debe estar entre el stock mínimo y máximo.'
            ]);
        }

        // Procesar imagen si existe
        $imagenPath = null;
        if ($request->hasFile('imagen')) {
            $imagenPath = $request->file('imagen')->store('productos', 'public');
        }

        $producto = Producto::create([
            'cod_producto' => $validated['cod_producto'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'precio' => $validated['precio'],
            'stock_minimo' => $validated['stock_minimo'],
            'stock_maximo' => $validated['stock_maximo'],
            'stock_total' => $validated['stock_total'],
            'imagen' => $imagenPath,
            'estado' => $validated['estado'],
        ]);

        // Asociar promociones si existen
        if (!empty($validated['promociones'])) {
            $producto->promociones()->attach($validated['promociones']);
        }

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto): Response
    {
        $producto->load(['categoria', 'promociones']);
        
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
        $promociones = Promocion::where('estado', 'activa')->orderBy('nombre')->get();
        
        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'categorias' => $categorias,
            'promociones' => $promociones,
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
            'precio' => ['required', 'numeric', 'min:0'],
            'stock_minimo' => ['required', 'integer', 'min:0'],
            'stock_maximo' => ['required', 'integer', 'min:1'],
            'stock_total' => ['required', 'integer', 'min:0'],
            'imagen' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
            'promociones' => ['nullable', 'array'],
            'promociones.*' => ['exists:promociones,id'],
        ]);

        // Validar que stock_total esté entre stock_minimo y stock_maximo
        if ($validated['stock_total'] < $validated['stock_minimo'] || 
            $validated['stock_total'] > $validated['stock_maximo']) {
            return back()->withErrors([
                'stock_total' => 'El stock actual debe estar entre el stock mínimo y máximo.'
            ]);
        }

        // Procesar nueva imagen si existe
        $imagenPath = $producto->imagen;
        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior si existe
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $imagenPath = $request->file('imagen')->store('productos', 'public');
        }

        $producto->update([
            'cod_producto' => $validated['cod_producto'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'categoria_id' => $validated['categoria_id'],
            'precio' => $validated['precio'],
            'stock_minimo' => $validated['stock_minimo'],
            'stock_maximo' => $validated['stock_maximo'],
            'stock_total' => $validated['stock_total'],
            'imagen' => $imagenPath,
            'estado' => $validated['estado'],
        ]);

        // Actualizar promociones
        if (isset($validated['promociones'])) {
            $producto->promociones()->sync($validated['promociones']);
        } else {
            $producto->promociones()->detach();
        }

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto): RedirectResponse
    {
        // Eliminar imagen si existe
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        // Desconectar promociones
        $producto->promociones()->detach();

        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }

    /**
     * Toggle product status between active and inactive.
     */
    public function toggleStatus(Producto $producto): RedirectResponse
    {
        $newStatus = $producto->estado === 'activo' ? 'inactivo' : 'activo';
        
        $producto->update([
            'estado' => $newStatus
        ]);

        $mensaje = $newStatus === 'activo' 
            ? 'Producto activado exitosamente.' 
            : 'Producto desactivado exitosamente.';

        return redirect()->route('productos.index')
            ->with('success', $mensaje);
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