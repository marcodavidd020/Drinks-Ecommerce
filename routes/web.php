<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'can:' . PermissionEnum::ACCESO_DASHBOARD->value])
    ->name('dashboard');

// Rutas protegidas con autenticación y permisos
Route::middleware(['auth', 'verified'])->group(function () {
    // Gestión de usuarios
    Route::resource('users', UserController::class);
    
    // Rutas adicionales para gestión de roles y permisos
    Route::get('/admin/roles', function () {
        return Inertia::render('Admin/Roles');
    })->middleware('can:' . PermissionEnum::GESTIONAR_ROLES->value)->name('admin.roles');
    
    Route::get('/admin/permissions', function () {
        return Inertia::render('Admin/Permissions');
    })->middleware('can:' . PermissionEnum::GESTIONAR_PERMISOS->value)->name('admin.permissions');
    
    // Rutas para reportes
    Route::get('/reports', function () {
        return Inertia::render('Reports/Index');
    })->middleware('can:' . PermissionEnum::VER_REPORTES->value)->name('reports.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
