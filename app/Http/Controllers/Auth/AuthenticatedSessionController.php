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

        // Sincronizar roles entre ambos sistemas
        $user->sincronizarRoles();

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

        // Verificar si puede acceder al dashboard
        if (AuthHelper::canAccessDashboard() || AuthHelper::isAdmin() || AuthHelper::isGestion()) {
            return redirect()->route('dashboard');
        }

        // Si es cliente, redirigir al home
        if (AuthHelper::isCliente()) {
            return redirect()->route('home');
        }

        // Por defecto al dashboard
        return redirect()->route('dashboard');
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
