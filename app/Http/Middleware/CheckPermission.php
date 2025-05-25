<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as BaseResponse;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): BaseResponse
    {
        if (!$request->user() || !$request->user()->can($permission)) {
            abort(Response::HTTP_FORBIDDEN, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}
