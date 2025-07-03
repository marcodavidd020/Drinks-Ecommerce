<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Helpers\AuthHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // Verificar si el usuario está activo
        if (!$user->estaActivo()) {
            Auth::logout();
            
            return back()->withErrors([
                'email' => 'Tu cuenta está inactiva. Contacta al administrador.',
            ]);
        }

        // Cargar relaciones necesarias
        $user->load(['roles', 'cliente', 'administrativo']);

        $request->session()->regenerate();

        // Redirigir según el rol del usuario
        return $this->redirectByRole($user);
    }

    /**
     * Redirigir según el rol del usuario
     */
    private function redirectByRole($user): RedirectResponse
    {
        $intended = request()->session()->get('url.intended');
        
        // Si hay una URL prevista, ir ahí
        if ($intended) {
            return redirect($intended);
        }

        // Verificar si es cliente (tiene rol cliente y no tiene roles administrativos)
        $isCliente = $user->hasRole('cliente') && 
                    !$user->hasAnyRole(['admin', 'vendedor']);

        // Si es cliente, redirigir al home
        if ($isCliente && $user->cliente) {
            return redirect()->route('home')->with('success', '¡Bienvenido de vuelta a Arturo!');
        }

        // Verificar si puede acceder al dashboard administrativo
        if (AuthHelper::canAccessDashboard() || AuthHelper::isAdmin() || AuthHelper::isGestion()) {
            return redirect()->route('dashboard');
        }

        // Si es cliente pero no tiene registro de cliente, crear uno
        if ($user->hasRole('cliente') && !$user->cliente) {
            $user->cliente()->create([
                'nit' => 'AUTO-' . $user->id,
            ]);
            return redirect()->route('home')->with('success', '¡Bienvenido a Arturo!');
        }

        // Por defecto al home
        return redirect()->route('home');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
