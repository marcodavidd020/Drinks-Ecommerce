<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'celular' => 'nullable|string|max:20',
            'email' => 'required|string|lowercase|email|max:255|unique:user,email',
            'genero' => 'nullable|in:masculino,femenino,otro',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'terms' => 'required|accepted',
        ]);

        $user = User::create([
            'nombre' => $request->nombre,
            'celular' => $request->celular,
            'email' => $request->email,
            'genero' => $request->genero,
            'password' => Hash::make($request->password),
            'estado' => 'activo', // Por defecto activo
        ]);

        // Asignar rol por defecto (cliente) usando Spatie
        $user->assignRole('cliente');

        // Crear registro de cliente automáticamente
        $user->cliente()->create([
            'nit' => 'AUTO-' . $user->id,
        ]);

        // Refrescar el usuario para cargar las relaciones
        $user->refresh();
        $user->load(['roles', 'cliente']);

        event(new Registered($user));

        Auth::login($user);

        // Redirigir al home para clientes en lugar del dashboard
        return redirect()->route('home')->with('success', '¡Bienvenido a BebiFresh! Tu cuenta ha sido creada exitosamente.');
    }
}
