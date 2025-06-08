<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Promocion;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class PromocionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Promocion::with(['productos.categoria']);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('nombre', 'LIKE', "%{$search}%");
        }

        if ($request->filled('estado')) {
            $estado = $request->input('estado');
            if ($estado === 'activa') {
                $query->where('estado', 'activa')
                      ->where('fecha_inicio', '<=', now())
                      ->where('fecha_fin', '>=', now());
            } elseif ($estado === 'inactiva') {
                $query->where('estado', 'inactiva');
            } elseif ($estado === 'vencida') {
                $query->where('fecha_fin', '<', now());
            } elseif ($estado === 'pendiente') {
                $query->where('fecha_inicio', '>', now());
            }
        }

        // Ordenamiento
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        $perPage = $request->input('per_page', 10);
        $promociones = $query->paginate($perPage);

        // Agregar datos computados
        $promociones->getCollection()->transform(function ($promocion) {
            $promocion->productos_count = $promocion->productos->count();
            $promocion->estado_calculado = $this->calcularEstado($promocion);
            return $promocion;
        });

        return Inertia::render('Promociones/Index', [
            'promociones' => $promociones,
            'filters' => $request->only(['search', 'estado', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Promociones/Create', [
            'productos' => $productos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'estado' => 'required|in:activa,inactiva',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.descuento_porcentaje' => 'nullable|numeric|min:0|max:100',
            'productos.*.descuento_fijo' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Validar que cada producto tenga al menos un tipo de descuento
        foreach ($request->productos as $producto) {
            if (empty($producto['descuento_porcentaje']) && empty($producto['descuento_fijo'])) {
                return redirect()->back()
                    ->withErrors(['productos' => 'Cada producto debe tener al menos un tipo de descuento.'])
                    ->withInput();
            }
        }

        try {
            $promocion = Promocion::create([
                'nombre' => $request->nombre,
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_fin' => $request->fecha_fin,
                'estado' => $request->estado,
            ]);

            // Asociar productos con sus descuentos
            foreach ($request->productos as $producto) {
                $promocion->productos()->attach($producto['id'], [
                    'descuento_porcentaje' => $producto['descuento_porcentaje'] ?? null,
                    'descuento_fijo' => $producto['descuento_fijo'] ?? null,
                ]);
            }

            return redirect()->route('promociones.index')
                ->with('success', 'Promoción creada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al crear la promoción: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Promocion $promocion)
    {
        $promocion->load(['productos.categoria']);
        $promocion->estado_calculado = $this->calcularEstado($promocion);
        $promocion->productos_count = $promocion->productos->count();

        return Inertia::render('Promociones/Show', [
            'promocion' => $promocion,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promocion $promocion)
    {
        $promocion->load(['productos.categoria']);
        
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get();

        // Preparar los datos de la promoción con fechas formateadas
        $promocionData = [
            'id' => $promocion->id,
            'nombre' => $promocion->nombre,
            'fecha_inicio' => $promocion->fecha_inicio->format('Y-m-d'),
            'fecha_fin' => $promocion->fecha_fin->format('Y-m-d'),
            'estado' => $promocion->estado,
            'productos' => $promocion->productos,
            'created_at' => $promocion->created_at,
            'updated_at' => $promocion->updated_at,
        ];

        return Inertia::render('Promociones/Edit', [
            'promocion' => $promocionData,
            'productos' => $productos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promocion $promocion)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'estado' => 'required|in:activa,inactiva',
            'productos' => 'required|array|min:1',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.descuento_porcentaje' => 'nullable|numeric|min:0|max:100',
            'productos.*.descuento_fijo' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Validar que cada producto tenga al menos un tipo de descuento
        foreach ($request->productos as $producto) {
            if (empty($producto['descuento_porcentaje']) && empty($producto['descuento_fijo'])) {
                return redirect()->back()
                    ->withErrors(['productos' => 'Cada producto debe tener al menos un tipo de descuento.'])
                    ->withInput();
            }
        }

        try {
            $promocion->update([
                'nombre' => $request->nombre,
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_fin' => $request->fecha_fin,
                'estado' => $request->estado,
            ]);

            // Sincronizar productos con sus descuentos
            $productosSync = [];
            foreach ($request->productos as $producto) {
                $productosSync[$producto['id']] = [
                    'descuento_porcentaje' => $producto['descuento_porcentaje'] ?? null,
                    'descuento_fijo' => $producto['descuento_fijo'] ?? null,
                ];
            }
            
            $promocion->productos()->sync($productosSync);

            return redirect()->route('promociones.index')
                ->with('success', 'Promoción actualizada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al actualizar la promoción: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promocion $promocion)
    {
        try {
            $promocion->delete();
            
            return redirect()->route('promociones.index')
                ->with('success', 'Promoción eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Error al eliminar la promoción: ' . $e->getMessage()]);
        }
    }

    /**
     * Calcular el estado real de una promoción
     */
    private function calcularEstado(promocion $promocion): string
    {
        if ($promocion->estado === 'inactiva') {
            return 'inactiva';
        }

        $hoy = now()->toDateString();
        
        if ($hoy < $promocion->fecha_inicio) {
            return 'pendiente';
        } elseif ($hoy > $promocion->fecha_fin) {
            return 'vencida';
        } else {
            return 'activa';
        }
    }
} 