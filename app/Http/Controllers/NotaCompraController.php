<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\NotaCompra;
use App\Models\DetalleCompra;
use App\Models\Proveedor;
use App\Models\Producto;
use App\Models\Almacen;
use App\Models\ProductoAlmacen;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NotaCompraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $estado = $request->get('estado', '');
        $proveedor = $request->get('proveedor', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = (int) $request->get('per_page', 10);

        $query = NotaCompra::query()
            ->with(['proveedor', 'detalles.producto'])
            ->withCount('detalles');

        // Filtros
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('proveedor', function ($pq) use ($search) {
                        $pq->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        if ($estado) {
            $query->where('estado', $estado);
        }

        if ($proveedor) {
            $query->where('proveedor_id', $proveedor);
        }

        // Ordenamiento
        $validSortFields = ['fecha', 'total', 'estado', 'created_at'];
        if (!in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortOrder);

        $compras = $query->paginate($perPage);

        // Obtener proveedores para el filtro
        $proveedores = Proveedor::orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('Compras/Index', [
            'compras' => $compras,
            'proveedores' => $proveedores,
            'filters' => [
                'search' => $search,
                'estado' => $estado,
                'proveedor' => $proveedor,
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
        $proveedores = Proveedor::orderBy('nombre')->get(['id', 'nombre', 'email', 'telefono']);
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'precio_compra', 'precio_venta', 'categoria_id']);

        return Inertia::render('Compras/Create', [
            'proveedores' => $proveedores,
            'productos' => $productos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'proveedor_id' => 'required|exists:proveedor,id',
            'fecha' => 'required|date',
            'estado' => 'required|in:pendiente,recibida,cancelada',
            'observaciones' => 'nullable|string|max:500',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:producto,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            // Obtener el almacén principal
            $almacenPrincipal = Almacen::where('nombre', 'Almacén Principal')->first();
            if (!$almacenPrincipal) {
                // Si no existe, crear el almacén principal
                $almacenPrincipal = Almacen::create([
                    'nombre' => 'Almacén Principal',
                    'descripcion' => 'Almacén principal del sistema',
                    'ubicacion' => 'Sede principal',
                ]);
            }

            // Calcular total
            $total = 0;
            foreach ($request->productos as $producto) {
                $total += $producto['cantidad'] * $producto['precio_unitario'];
            }

            // Crear nota de compra
            $notaCompra = NotaCompra::create([
                'proveedor_id' => $request->proveedor_id,
                'fecha' => $request->fecha,
                'total' => $total,
                'estado' => $request->estado,
                'observaciones' => $request->observaciones,
            ]);

            // Crear detalles de compra
            foreach ($request->productos as $producto) {
                // Encontrar o crear ProductoAlmacen
                $productoAlmacen = ProductoAlmacen::firstOrCreate([
                    'producto_id' => $producto['id'],
                    'almacen_id' => $almacenPrincipal->id,
                ], [
                    'stock' => 0
                ]);

                DetalleCompra::create([
                    'nota_compra_id' => $notaCompra->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $producto['cantidad'],
                    'precio' => $producto['precio_unitario'],
                    'total' => $producto['cantidad'] * $producto['precio_unitario'],
                ]);

                // Actualizar stock si la compra está recibida
                if ($request->estado === 'recibida') {
                    $productoAlmacen->increment('stock', $producto['cantidad']);
                }
            }

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Nota de compra creada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Error al crear la nota de compra: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(NotaCompra $compra): Response
    {
        $compra->load(['proveedor', 'detalles.producto.categoria']);

        return Inertia::render('Compras/Show', [
            'compra' => $compra,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NotaCompra $compra): Response
    {
        $compra->load(['proveedor', 'detalles.producto']);

        $proveedores = Proveedor::orderBy('nombre')->get(['id', 'nombre', 'email', 'telefono']);
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'precio_compra', 'precio_venta', 'categoria_id']);

        // Preparar datos de la compra
        $compraData = [
            'id' => $compra->id,
            'proveedor_id' => $compra->proveedor_id,
            'fecha' => $compra->fecha->format('Y-m-d'),
            'estado' => $compra->estado,
            'observaciones' => $compra->observaciones,
            'total' => $compra->total,
            'detalles' => $compra->detalles,
            'proveedor' => $compra->proveedor,
        ];

        return Inertia::render('Compras/Edit', [
            'compra' => $compraData,
            'proveedores' => $proveedores,
            'productos' => $productos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NotaCompra $compra): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'proveedor_id' => 'required|exists:proveedor,id',
            'fecha' => 'required|date',
            'estado' => 'required|in:pendiente,recibida,cancelada',
            'observaciones' => 'nullable|string|max:500',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:producto,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            DB::beginTransaction();

            // Obtener el almacén principal
            $almacenPrincipal = Almacen::where('nombre', 'Almacén Principal')->first();
            if (!$almacenPrincipal) {
                // Si no existe, crear el almacén principal
                $almacenPrincipal = Almacen::create([
                    'nombre' => 'Almacén Principal',
                    'descripcion' => 'Almacén principal del sistema',
                    'ubicacion' => 'Sede principal',
                ]);
            }

            // Revertir stock anterior si la compra estaba recibida
            if ($compra->estado === 'recibida') {
                foreach ($compra->detalles as $detalle) {
                    $detalle->productoAlmacen->decrement('stock', $detalle->cantidad);
                }
            }

            // Calcular nuevo total
            $total = 0;
            foreach ($request->productos as $producto) {
                $total += $producto['cantidad'] * $producto['precio_unitario'];
            }

            // Actualizar nota de compra
            $compra->update([
                'proveedor_id' => $request->proveedor_id,
                'fecha' => $request->fecha,
                'total' => $total,
                'estado' => $request->estado,
                'observaciones' => $request->observaciones,
            ]);

            // Eliminar detalles existentes y crear nuevos
            $compra->detalles()->delete();

            foreach ($request->productos as $producto) {
                // Encontrar o crear ProductoAlmacen
                $productoAlmacen = ProductoAlmacen::firstOrCreate([
                    'producto_id' => $producto['id'],
                    'almacen_id' => $almacenPrincipal->id,
                ], [
                    'stock' => 0
                ]);

                DetalleCompra::create([
                    'nota_compra_id' => $compra->id,
                    'producto_almacen_id' => $productoAlmacen->id,
                    'cantidad' => $producto['cantidad'],
                    'precio' => $producto['precio_unitario'],
                    'total' => $producto['cantidad'] * $producto['precio_unitario'],
                ]);

                // Actualizar stock si la compra está recibida
                if ($request->estado === 'recibida') {
                    $productoAlmacen->increment('stock', $producto['cantidad']);
                }
            }

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Nota de compra actualizada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar la nota de compra: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NotaCompra $compra): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Eliminar detalles y nota de compra
            $compra->detalles()->delete();
            $compra->delete();

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Nota de compra eliminada exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Error al eliminar la nota de compra: ' . $e->getMessage()]);
        }
    }

    /**
     * Cambiar estado de la compra
     */
    public function cambiarEstado(Request $request, NotaCompra $compra): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'estado' => 'required|in:pendiente,recibida,cancelada',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $compra->update(['estado' => $request->estado]);

            $mensaje = match($request->estado) {
                'recibida' => 'Compra marcada como recibida.',
                'cancelada' => 'Compra cancelada.',
                'pendiente' => 'Compra marcada como pendiente.',
                default => 'Estado actualizado.',
            };

            return redirect()->back()->with('success', $mensaje);
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al cambiar el estado: ' . $e->getMessage()]);
        }
    }
}
