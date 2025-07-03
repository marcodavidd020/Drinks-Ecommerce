<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Helpers\AuthHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanManageUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Permitir que los usuarios vean su propio perfil (solo operaciones GET)
        if ($request->route('user') && 
            $request->route('user')->id === auth()->id() && 
            $request->method() === 'GET' &&
            $request->route()->named('users.show')) {
            return $next($request);
        }
        
        if (!AuthHelper::canManageUsers() && !AuthHelper::isAdmin()) {
            abort(403, 'No tienes permisos para gestionar usuarios.');
        }

        return $next($request);
    }
} 