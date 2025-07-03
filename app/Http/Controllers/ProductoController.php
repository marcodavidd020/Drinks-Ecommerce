<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use App\Models\Promocion;
use App\Models\Carrito;
use App\Models\DetalleCarrito;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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

        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        // Construir la consulta
        $query = Producto::query()
            ->with(['categoria', 'productoAlmacenes']);

        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function ($q) use ($search) {
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
        $productos = $query->paginate($perPage, ['*'], 'page', $page)->withQueryString();

        // Procesar los resultados
        $productos->getCollection()->transform(function ($producto) {
            $producto->stock_total = $producto->productoAlmacenes->sum('stock');
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
                'per_page' => (int) $perPage,
                'page' => (int) $page,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categorias = Categoria::orderBy('nombre')->get();

        return Inertia::render('Productos/Create', [
            'categorias' => $categorias,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cod_producto' => ['required', 'string', 'max:50', 'unique:producto'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'categoria_id' => ['required', 'exists:categoria,id'],
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
        $producto->load(['categoria', 'productoAlmacenes.almacen']);

        // Calcular stock total
        $producto->stock_total = $producto->productoAlmacenes->sum('stock');

        return Inertia::render('Productos/Show', [
            'producto' => $producto
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto): Response
    {
        $producto->load(['categoria']);
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
            'cod_producto' => ['required', 'string', 'max:50', 'unique:producto,cod_producto,' . $producto->id],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'categoria_id' => ['required', 'exists:categoria,id'],
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

    /**
     * Mostrar producto para vista pública (sin autenticación)
     */
    public function showPublic(Producto $producto)
    {
        try {
            $producto->load(['categoria', 'productoAlmacenes.almacen']);

            // Calcular stock total
            $producto->stock_total = $producto->productoAlmacenes->sum('stock');

            // Obtener promociones activas del producto (simplificado)
            $promociones = collect(); // Temporalmente vacío para debug
            
            // Productos relacionados de la misma categoría (simplificado)
            $productosRelacionados = collect(); // Temporalmente vacío para debug

            // Obtener carrito count de forma segura
            $carritoCount = 0;
            try {
                if (Auth::check()) {
                    $carritoCount = $this->getCarritoCount();
                }
            } catch (\Exception $e) {
                Log::error('Error obteniendo carrito count: ' . $e->getMessage());
                $carritoCount = 0;
            }

            return Inertia::render('ProductDetail', [
                'producto' => $producto,
                'promociones' => $promociones,
                'productosRelacionados' => $productosRelacionados,
                'isAuthenticated' => Auth::check(),
                'carritoCount' => $carritoCount,
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error en showPublic: ' . $e->getMessage());
            
            // Redirigir al home con error
            return redirect()->route('home')->with('error', 'Error cargando el producto');
        }
    }

    /**
     * Mostrar carrito del usuario
     */
    public function carritoIndex(): Response
    {
        $cliente = $this->getCurrentCliente();
        
        if (!$cliente) {
            return redirect()->route('home')->with('error', 'Debe completar su perfil de cliente para usar el carrito.');
        }

        $carrito = Carrito::where('cliente_id', $cliente->id)
            ->where('estado', 'activo')
            ->with(['detalles.producto.categoria'])
            ->first();

        $detalles = $carrito ? $carrito->detalles : collect();
        $total = $carrito ? $carrito->calcularTotal() : 0;

        return Inertia::render('Carrito/Index', [
            'carrito' => $carrito,
            'detalles' => $detalles,
            'total' => $total,
        ]);
    }

    /**
     * Agregar producto al carrito
     */
    public function agregarAlCarrito(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:producto,id',
            'cantidad' => 'required|integer|min:1',
        ]);

        $cliente = $this->getCurrentCliente();
        
        if (!$cliente) {
            return back()->with('error', 'Debe completar su perfil de cliente para agregar productos al carrito.');
        }

        $producto = Producto::findOrFail($validated['producto_id']);
        
        // Verificar stock disponible
        $stockTotal = $producto->productoAlmacenes->sum('stock');
        if ($stockTotal < $validated['cantidad']) {
            return back()->with('error', 'No hay suficiente stock disponible.');
        }

        // Obtener o crear carrito activo
        $carrito = Carrito::firstOrCreate(
            [
                'cliente_id' => $cliente->id,
                'estado' => 'activo',
            ],
            [
                'fecha' => now(),
                'total' => 0,
            ]
        );

        // Verificar si el producto ya está en el carrito
        $detalleExistente = DetalleCarrito::where('carrito_id', $carrito->id)
            ->where('producto_id', $producto->id)
            ->first();

        if ($detalleExistente) {
            // Actualizar cantidad
            $nuevaCantidad = $detalleExistente->cantidad + $validated['cantidad'];
            
            if ($stockTotal < $nuevaCantidad) {
                return back()->with('error', 'No hay suficiente stock para la cantidad solicitada.');
            }
            
            $detalleExistente->update([
                'cantidad' => $nuevaCantidad,
                'precio_unitario' => $producto->precio_venta,
            ]);
        } else {
            // Crear nuevo detalle
            DetalleCarrito::create([
                'carrito_id' => $carrito->id,
                'producto_id' => $producto->id,
                'cantidad' => $validated['cantidad'],
                'precio_unitario' => $producto->precio_venta,
                'subtotal' => $validated['cantidad'] * $producto->precio_venta,
            ]);
        }

        // Actualizar total del carrito
        $carrito->update(['total' => $carrito->calcularTotal()]);

        return back()->with('success', 'Producto agregado al carrito exitosamente.');
    }

    /**
     * Actualizar cantidad en el carrito
     */
    public function actualizarCarrito(Request $request, DetalleCarrito $detalleCarrito): RedirectResponse
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $cliente = $this->getCurrentCliente();
        
        if (!$cliente || $detalleCarrito->carrito->cliente_id !== $cliente->id) {
            return back()->with('error', 'No autorizado.');
        }

        // Verificar stock disponible
        $stockTotal = $detalleCarrito->producto->productoAlmacenes->sum('stock');
        if ($stockTotal < $validated['cantidad']) {
            return back()->with('error', 'No hay suficiente stock disponible.');
        }

        $detalleCarrito->update([
            'cantidad' => $validated['cantidad'],
            'precio_unitario' => $detalleCarrito->producto->precio_venta,
        ]);

        // Actualizar total del carrito
        $detalleCarrito->carrito->update(['total' => $detalleCarrito->carrito->calcularTotal()]);

        return back()->with('success', 'Carrito actualizado exitosamente.');
    }

    /**
     * Eliminar producto del carrito
     */
    public function eliminarDelCarrito(DetalleCarrito $detalleCarrito): RedirectResponse
    {
        $cliente = $this->getCurrentCliente();
        
        if (!$cliente || $detalleCarrito->carrito->cliente_id !== $cliente->id) {
            return back()->with('error', 'No autorizado.');
        }

        $carrito = $detalleCarrito->carrito;
        $detalleCarrito->delete();

        // Actualizar total del carrito
        $carrito->update(['total' => $carrito->calcularTotal()]);

        return back()->with('success', 'Producto eliminado del carrito.');
    }

    /**
     * Procesar checkout del carrito
     */
    public function checkout(Request $request): RedirectResponse
    {
        $cliente = $this->getCurrentCliente();
        
        if (!$cliente) {
            return back()->with('error', 'Debe completar su perfil de cliente.');
        }

        $carrito = Carrito::where('cliente_id', $cliente->id)
            ->where('estado', 'activo')
            ->with('detalles.producto')
            ->first();

        if (!$carrito || $carrito->detalles->count() === 0) {
            return back()->with('error', 'El carrito está vacío.');
        }

        try {
            DB::beginTransaction();

            // Crear nota de venta desde el carrito
            $notaVenta = \App\Models\NotaVenta::create([
                'cliente_id' => $cliente->id,
                'fecha' => now(),
                'total' => $carrito->total,
                'estado' => 'pendiente',
            ]);

            // Crear detalles de venta
            foreach ($carrito->detalles as $detalle) {
                // Encontrar ProductoAlmacen con stock suficiente
                $productoAlmacen = $detalle->producto->productoAlmacenes()
                    ->where('stock', '>=', $detalle->cantidad)
                    ->first();

                if (!$productoAlmacen) {
                    throw new \Exception("Sin stock suficiente para: {$detalle->producto->nombre}");
                }

                \App\Models\DetalleVenta::create([
                    'nota_venta_id' => $notaVenta->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $detalle->cantidad,
                    'subtotal' => $detalle->subtotal,
                ]);

                // Actualizar stock
                $productoAlmacen->decrement('stock', $detalle->cantidad);
            }

            // Marcar carrito como completado
            $carrito->update([
                'estado' => 'completado',
                'pedido_id' => $notaVenta->id,
            ]);

            DB::commit();

            return redirect()->route('home')->with('success', 'Pedido realizado exitosamente. Su número de pedido es: ' . $notaVenta->id);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en checkout: ' . $e->getMessage());
            return back()->with('error', 'Error al procesar el pedido: ' . $e->getMessage());
        }
    }

    /**
     * Obtener cliente actual del usuario autenticado
     */
    private function getCurrentCliente()
    {
        if (!Auth::check()) {
            return null;
        }

        return Cliente::where('user_id', Auth::id())->first();
    }

    /**
     * Obtener count de productos en carrito activo
     */
    private function getCarritoCount(): int
    {
        $cliente = $this->getCurrentCliente();
        
        if (!$cliente) {
            return 0;
        }

        $carrito = Carrito::where('cliente_id', $cliente->id)
            ->where('estado', 'activo')
            ->first();

        return $carrito ? $carrito->total_productos : 0;
    }
}
