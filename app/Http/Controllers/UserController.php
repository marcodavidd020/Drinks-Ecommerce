<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // Los middlewares se definen en las rutas

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');
        $role = $request->get('role', '');
        $estado = $request->get('estado', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $perPage = (int) $request->get('per_page', 10);

        $query = User::with('roles')
            ->when($search, function ($query) use ($search) {
                return $query->where('nombre', 'like', "%{$search}%")
                             ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($role, function ($query) use ($role) {
                return $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when($estado, function ($query) use ($estado) {
                return $query->where('estado', $estado);
            });

        // Aplicar ordenamiento
        $query->orderBy($sortBy, $sortOrder);
        
        $users = $query->paginate($perPage);

        // Transformar datos para incluir el rol principal
        $users->getCollection()->transform(function ($user) {
            $user->role_principal = $user->roles->first()?->name ?? 'Sin rol';
            $user->roles_nombres = $user->roles->pluck('name')->toArray();
            return $user;
        });

        // Obtener todos los roles para el filtro
        $allRoles = Role::all();
        
        return Inertia::render('Users/Index', [
            'users' => $users,
            'allRoles' => $allRoles,
            'filters' => [
                'search' => $search,
                'role' => $role,
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
        $roles = Role::all();
        
        return Inertia::render('Users/Create', [
            'roles' => $roles
        ]);
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
            'celular' => ['nullable', 'string', 'max:20'],
            'genero' => ['nullable', 'string', 'in:masculino,femenino,otro'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
        ]);

        $user = User::create([
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'celular' => $validated['celular'],
            'genero' => $validated['genero'] ?? null,
            'estado' => $validated['estado'],
            'email_verified_at' => now(), // Auto-verificar para usuarios creados por admin
        ]);

        // Asignar rol usando Spatie
        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $user->load(['roles', 'permissions', 'cliente', 'administrativo']);
        
        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');
        $roles = Role::all();
        
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'currentRole' => $user->roles->first()?->name
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'celular' => ['nullable', 'string', 'max:20'],
            'genero' => ['nullable', 'string', 'in:masculino,femenino,otro'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'estado' => ['required', 'string', 'in:activo,inactivo'],
        ]);

        $updateData = [
            'nombre' => $validated['nombre'],
            'email' => $validated['email'],
            'celular' => $validated['celular'],
            'genero' => $validated['genero'] ?? null,
            'estado' => $validated['estado'],
        ];

        // Solo actualizar contraseña si se proporciona
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Actualizar rol usando Spatie - eliminar roles anteriores y asignar el nuevo
        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Verificar que no se elimine a sí mismo
        if ($user->id === Auth::id()) {
            return redirect()->route('users.index')
                ->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    /**
     * Toggle user status between active and inactive.
     */
    public function toggleStatus(User $user): RedirectResponse
    {
        // Verificar que no se desactive a sí mismo
        if ($user->id === Auth::id()) {
            return redirect()->route('users.index')
                ->with('error', 'No puedes cambiar tu propio estado.');
        }

        $user->update([
            'estado' => $user->estado === 'activo' ? 'inactivo' : 'activo'
        ]);

        $mensaje = $user->estado === 'activo' 
            ? 'Usuario activado exitosamente.' 
            : 'Usuario desactivado exitosamente.';

        return redirect()->route('users.index')
            ->with('success', $mensaje);
    }
}
