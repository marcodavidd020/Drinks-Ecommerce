<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Middleware personalizados para autorizaciones
        $middleware->alias([
            'admin.only' => \App\Http\Middleware\AdminOnly::class,
            'can.manage.users' => \App\Http\Middleware\CanManageUsers::class,
            'can.manage.products' => \App\Http\Middleware\CanManageProducts::class,
            'can.manage.sales' => \App\Http\Middleware\CanManageSales::class,
            'can.manage.promotions' => \App\Http\Middleware\CanManagePromotions::class,
            'has.gestion.role' => \App\Http\Middleware\HasGestionRole::class,
            'has.roles' => \App\Http\Middleware\HasRoles::class,
            'check.permission' => \App\Http\Middleware\CheckPermission::class,
            'redirect.cliente' => \App\Http\Middleware\RedirectClienteToDashboard::class,
            // Middlewares de Spatie Laravel Permission
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
