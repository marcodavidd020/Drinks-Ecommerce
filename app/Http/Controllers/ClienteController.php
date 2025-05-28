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
        $perPage = $request->get('per_page', 10);

        $clientes = Cliente::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('nit', 'like', "%{$search}%");
            })
            ->when($estado, function ($query, $estado) {
                return $query->whereHas('user', function ($q) use ($estado) {
                    $q->where('estado', $estado);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
        
        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filters' => [
                'search' => $search,
                'estado' => $estado,
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'nit' => ['required', 'string', 'max:20', 'unique:clientes'],
            'tipo_documento' => ['required', 'string', 'in:CC,CE,NIT,TI,PP'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'ciudad' => ['nullable', 'string', 'max:100'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
        ]);

        try {
            DB::beginTransaction();

            // Crear el usuario
            $user = User::create([
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'user',
                'estado' => $validated['estado'],
                'email_verified_at' => now(),
            ]);

            // Crear el cliente
            Cliente::create([
                'user_id' => $user->id,
                'nit' => $validated['nit'],
                'tipo_documento' => $validated['tipo_documento'],
                'direccion' => $validated['direccion'],
                'telefono' => $validated['telefono'],
                'ciudad' => $validated['ciudad'],
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
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $cliente->user_id],
            'celular' => ['nullable', 'string', 'max:20'],
            'nit' => ['nullable', 'string', 'max:20', 'unique:clientes,nit,' . $cliente->id],
            'telefono' => ['nullable', 'string', 'max:20'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'genero' => ['nullable', 'string', 'in:masculino,femenino,otro,prefiero_no_decir'],
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
                'telefono' => $validated['telefono'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'],
                'genero' => $validated['genero'],
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
