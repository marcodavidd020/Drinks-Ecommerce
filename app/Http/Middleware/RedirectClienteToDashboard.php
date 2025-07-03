<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectClienteToDashboard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Si el usuario es un cliente (solo tiene rol cliente), redirigir a su página especial
        if ($user && $user->hasRole('cliente') && !$user->hasAnyRole(['admin', 'vendedor'])) {
            // Si está tratando de acceder al dashboard admin, redirigir a página de cliente
            if ($request->is('dashboard') || $request->is('dashboard/*')) {
                return redirect()->route('cliente.dashboard');
            }
        }

        return $next($request);
    }
} 