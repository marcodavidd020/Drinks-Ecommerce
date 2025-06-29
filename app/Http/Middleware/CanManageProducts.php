<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Helpers\AuthHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanManageProducts
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!AuthHelper::canManageProducts() && !AuthHelper::isGestion()) {
            abort(403, 'No tienes permisos para gestionar productos.');
        }

        return $next($request);
    }
} 