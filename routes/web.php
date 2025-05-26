<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'can:' . PermissionEnum::ACCESO_DASHBOARD->value])
    ->name('dashboard');

// Rutas protegidas con autenticación y permisos
Route::middleware(['auth', 'verified'])->group(function () {
    // Gestión de usuarios con permisos específicos
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('can:' . PermissionEnum::VER_USUARIOS->value)
        ->name('users.index');
    
    Route::get('/users/create', [UserController::class, 'create'])
        ->middleware('can:' . PermissionEnum::CREAR_USUARIOS->value)
        ->name('users.create');
    
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('can:' . PermissionEnum::CREAR_USUARIOS->value)
        ->name('users.store');
    
    Route::get('/users/{user}', [UserController::class, 'show'])
        ->middleware('can:' . PermissionEnum::VER_USUARIOS->value)
        ->name('users.show');
    
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->middleware('can:' . PermissionEnum::EDITAR_USUARIOS->value)
        ->name('users.edit');
    
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('can:' . PermissionEnum::EDITAR_USUARIOS->value)
        ->name('users.update');
    
    Route::patch('/users/{user}', [UserController::class, 'update'])
        ->middleware('can:' . PermissionEnum::EDITAR_USUARIOS->value);
    
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('can:' . PermissionEnum::ELIMINAR_USUARIOS->value)
        ->name('users.destroy');
    
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
