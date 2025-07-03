<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoriaController extends Controller
{
    /**
     * Mostrar el listado de categorías.
     */
    public function index(Request $request)
    {
        // Obtener y validar los filtros
        $search = $request->get('search', '');
        
        // Configurar opciones de ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = strtolower($request->get('sort_order', 'desc'));
        
        // Validar campos de ordenamiento permitidos
        $validSortFields = ['nombre', 'created_at', 'updated_at', 'productos_count'];
        
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
        $query = Categoria::query()->withCount('productos');
        
        // Aplicar filtros de búsqueda
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }
        
        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        // Ejecutar la consulta con paginación
        $categorias = $query->paginate($perPage)->withQueryString();
        
        // Renderizar la vista
        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias,
            'filters' => [
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Mostrar el formulario para crear una nueva categoría.
     */
    public function create()
    {
        return Inertia::render('Categorias/Create');
    }

    /**
     * Almacenar una nueva categoría en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categoria,nombre',
            'descripcion' => 'nullable|string|max:500',
        ]);
        
        Categoria::create($validated);
        
        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Mostrar la información de una categoría específica.
     */
    public function show(Categoria $categoria)
    {
        $categoria->load(['productos' => function ($query) {
            $query->limit(5);
        }]);
        
        $categoria->productos_count = $categoria->productos()->count();
        
        return Inertia::render('Categorias/Show', [
            'categoria' => $categoria,
        ]);
    }

    /**
     * Mostrar el formulario para editar una categoría.
     */
    public function edit(Categoria $categoria)
    {
        return Inertia::render('Categorias/Edit', [
            'categoria' => $categoria,
        ]);
    }

    /**
     * Actualizar la información de una categoría.
     */
    public function update(Request $request, Categoria $categoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:categoria,nombre,' . $categoria->id,
            'descripcion' => 'nullable|string|max:500',
        ]);
        
        $categoria->update($validated);
        
        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Eliminar una categoría.
     */
    public function destroy(Categoria $categoria)
    {
        // Verificar si tiene productos asociados
        if ($categoria->productos()->count() > 0) {
            return back()->with('error', 'No se puede eliminar la categoría porque tiene productos asociados.');
        }
        
        $categoria->delete();
        
        return back()->with('success', 'Categoría eliminada exitosamente.');
    }
}
