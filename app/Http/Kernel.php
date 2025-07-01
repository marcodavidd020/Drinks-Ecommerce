<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'auth.session' => \Illuminate\Session\Middleware\AuthenticateSession::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \App\Http\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'admin.only' => \App\Http\Middleware\AdminOnly::class,
        'can.manage.users' => \App\Http\Middleware\CanManageUsers::class,
        'can.manage.products' => \App\Http\Middleware\CanManageProducts::class,
        'can.manage.sales' => \App\Http\Middleware\CanManageSales::class,
        'can.manage.promotions' => \App\Http\Middleware\CanManagePromotions::class,
        'has.gestion.role' => \App\Http\Middleware\HasGestionRole::class,
        'has.roles' => \App\Http\Middleware\HasRoles::class,
        'check.permission' => \App\Http\Middleware\CheckPermission::class,
        'handle.appearance' => \App\Http\Middleware\HandleAppearance::class,
        'redirect.cliente' => \App\Http\Middleware\RedirectClienteToDashboard::class,
        'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
    ];
} 