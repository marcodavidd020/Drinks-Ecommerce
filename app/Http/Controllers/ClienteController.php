<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $estado = $request->get('estado', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = (int) $request->get('per_page', 10);

        $query = Cliente::query()
            ->with(['user'])
            ->withCount('carritos')
            ->when($search, function ($query) use ($search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('celular', 'like', "%{$search}%");
                })
                    ->orWhere('nit', 'like', "%{$search}%");
            })
            ->when($estado, function ($query) use ($estado) {
                return $query->whereHas('user', function ($q) use ($estado) {
                    $q->where('estado', $estado);
                });
            });

        // Aplicar ordenamiento
        if (in_array($sortBy, ['nombre', 'email', 'estado'])) {
            $query->join('user', 'cliente.user_id', '=', 'user.id')
                ->orderBy("user.{$sortBy}", $sortOrder)
                ->select('cliente.*');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $clientes = $query->paginate($perPage);

        // Transformar los datos para incluir campos del usuario directamente
        $clientes->getCollection()->transform(function ($cliente) {
            return [
                'id' => $cliente->id,
                'nombre' => $cliente->user->nombre ?? 'Sin nombre',
                'email' => $cliente->user->email ?? 'Sin email',
                'celular' => $cliente->user->celular,
                'estado' => $cliente->user->estado ?? 'inactivo',
                'ventas_count' => $cliente->carritos_count ?? 0,
                'created_at' => $cliente->created_at->toISOString(),
                'updated_at' => $cliente->updated_at->toISOString(),
                'nit' => $cliente->nit,
                // Mantener las relaciones por si las necesitamos
                'user' => $cliente->user,
            ];
        });

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filters' => [
                'search' => $search,
                'estado' => $estado,
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
        return Inertia::render('Clientes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:user'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'nit' => ['required', 'string', 'max:20', 'unique:cliente'],
            'celular' => ['nullable', 'string', 'max:20'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
        ]);

        try {
            DB::beginTransaction();

            // Crear el usuario
            $user = User::create([
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'celular' => $validated['celular'],
                'role' => 'user',
                'estado' => $validated['estado'],
                'email_verified_at' => now(),
            ]);

            // Crear el cliente
            Cliente::create([
                'user_id' => $user->id,
                'nit' => $validated['nit'],
            ]);

            DB::commit();

            return redirect()->route('clientes.index')
                ->with('success', 'Cliente creado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear el cliente: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Cliente $cliente): Response
    {
        $cliente->load('user');

        return Inertia::render('Clientes/Show', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cliente $cliente): Response
    {
        $cliente->load('user');

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cliente $cliente): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:user,email,' . $cliente->user_id],
            'celular' => ['nullable', 'string', 'max:20'],
            'nit' => ['nullable', 'string', 'max:20', 'unique:cliente,nit,' . $cliente->id],
        ]);

        try {
            DB::beginTransaction();

            // Actualizar el usuario
            $cliente->user->update([
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'celular' => $validated['celular'],
            ]);

            // Actualizar el cliente
            $cliente->update([
                'nit' => $validated['nit'],
            ]);

            DB::commit();

            return redirect()->route('clientes.index')
                ->with('success', 'Cliente actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar el cliente: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cliente $cliente): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Eliminar el cliente y el usuario asociado
            $cliente->user->delete();
            $cliente->delete();

            DB::commit();

            return redirect()->route('clientes.index')
                ->with('success', 'Cliente eliminado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar el cliente: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle client status between active and inactive.
     */
    public function toggleStatus(Cliente $cliente): RedirectResponse
    {
        $newStatus = $cliente->user->estado === 'activo' ? 'inactivo' : 'activo';

        $cliente->user->update([
            'estado' => $newStatus
        ]);

        $mensaje = $newStatus === 'activo'
            ? 'Cliente activado exitosamente.'
            : 'Cliente desactivado exitosamente.';

        return redirect()->route('clientes.index')
            ->with('success', $mensaje);
    }
}
