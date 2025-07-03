<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Promocion;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PromocionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Promocion::with('producto.categoria');

        // Filtros
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('nombre', 'LIKE', "%{$search}%");
        }

        if ($request->filled('estado')) {
            $estado = $request->input('estado');
            $hoy = now();
            if ($estado === 'activa') {
                $query->where('fecha_inicio', '<=', $hoy)
                      ->where('fecha_fin', '>=', $hoy);
            } elseif ($estado === 'vencida') {
                $query->where('fecha_fin', '<', $hoy);
            } elseif ($estado === 'pendiente') {
                $query->where('fecha_inicio', '>', $hoy);
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
        $productos = Producto::orderBy('nombre')->get();
        return Inertia::render('Promociones/Create', [
            'productos' => $productos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'descuento' => 'required|string',
            'producto_id' => 'required|exists:producto,id',
        ]);

        Promocion::create($validated);

        return redirect()->route('promociones.index')
            ->with('success', 'Promoción creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Promocion $promocion)
    {
        $promocion->load('producto.categoria');
        $promocion->estado_calculado = $this->calcularEstado($promocion);

        return Inertia::render('Promociones/Show', [
            'promocion' => $promocion,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promocion $promocion)
    {
        $promocion->load('producto');
        $productos = Producto::orderBy('nombre')->get();
        
        return Inertia::render('Promociones/Edit', [
            'promocion' => $promocion,
            'productos' => $productos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Promocion $promocion)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'descuento' => 'required|string',
            'producto_id' => 'required|exists:producto,id',
        ]);

        $promocion->update($validated);

        return redirect()->route('promociones.index')
            ->with('success', 'Promoción actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promocion $promocion)
    {
        $promocion->delete();
        
        return redirect()->route('promociones.index')
            ->with('success', 'Promoción eliminada exitosamente.');
    }

    /**
     * Calcula el estado de una promoción.
     */
    private function calcularEstado(Promocion $promocion): string
    {
        $hoy = now();
        $inicio = Carbon::parse($promocion->fecha_inicio);
        $fin = Carbon::parse($promocion->fecha_fin);

        if ($hoy->lt($inicio)) {
            return 'pendiente';
        }

        if ($hoy->gt($fin)) {
            return 'vencida';
        }

        return 'activa';
    }
} 