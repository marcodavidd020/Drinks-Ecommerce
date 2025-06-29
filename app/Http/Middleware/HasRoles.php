<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Helpers\AuthHelper;
use App\Enums\RoleEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HasRoles
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $roleEnums = array_map(function ($role) {
            return RoleEnum::from($role);
        }, $roles);

        if (!AuthHelper::hasAnyRole($roleEnums)) {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
} 