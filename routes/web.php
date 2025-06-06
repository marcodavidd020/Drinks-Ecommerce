<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\AlmacenController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\NotaVentaController;
use App\Http\Controllers\NotaCompraController;
use App\Http\Controllers\PromocionController;
use App\Enums\PermissionEnum;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal usando el HomeController
Route::get('/', [HomeController::class, 'index'])->name('home');

// Ruta de demostración de modos (accesible sin autenticación)
Route::get('/modes-demo', function () {
    return Inertia::render('ModesDemo');
})->name('modes.demo');

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

    Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])
        ->middleware('can:' . PermissionEnum::EDITAR_USUARIOS->value)
        ->name('users.toggle-status');

    // Gestión de clientes - CRUD completo
    Route::resource('clientes', ClienteController::class);
    Route::patch('/clientes/{cliente}/toggle-status', [ClienteController::class, 'toggleStatus'])
        ->name('clientes.toggle-status');

    // Gestión de proveedores - CRUD completo
    Route::resource('proveedores', ProveedorController::class)->parameters([
        'proveedores' => 'proveedor'
    ]);
    Route::patch('/proveedores/{proveedor}/toggle-status', [ProveedorController::class, 'toggleStatus'])
        ->name('proveedores.toggle-status');

    // Gestión de productos - CRUD completo
    Route::resource('productos', ProductoController::class);
    Route::patch('/productos/{producto}/toggle-status', [ProductoController::class, 'toggleStatus'])
        ->name('productos.toggle-status');
    Route::patch('/productos/{producto}/update-stock', [ProductoController::class, 'updateStock'])
        ->name('productos.update-stock');

    // Gestión de categorías - CRUD completo
    Route::resource('categorias', CategoriaController::class);

    // Gestión de almacenes - CRUD completo
    Route::resource('almacenes', AlmacenController::class)->parameters([
        'almacenes' => 'almacen'
    ]);

    // Gestión de inventarios
    Route::resource('inventarios', InventarioController::class)->parameters([
        'inventarios' => 'inventario'
    ]);
    Route::patch('/inventarios/{inventario}/update-stock', [InventarioController::class, 'updateStock'])
        ->name('inventarios.update-stock');
    Route::post('/inventarios/transferencia', [InventarioController::class, 'transferencia'])
        ->name('inventarios.transferencia');

    // Gestión de ventas
    Route::get('/ventas', [NotaVentaController::class, 'index'])->name('ventas.index');
    Route::get('/ventas/create', [NotaVentaController::class, 'create'])->name('ventas.create');
    Route::post('/ventas', [NotaVentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{venta}', [NotaVentaController::class, 'show'])->name('ventas.show');
    Route::post('/ventas/{venta}/estado', [NotaVentaController::class, 'updateEstado'])->name('ventas.update-estado');

    // Gestión de compras - CRUD completo
    Route::resource('compras', NotaCompraController::class)->parameters([
        'compras' => 'compra'
    ]);
    Route::patch('/compras/{compra}/estado', [NotaCompraController::class, 'cambiarEstado'])
        ->name('compras.cambiar-estado');

    // Gestión de promociones - CRUD completo
    Route::resource('promociones', PromocionController::class)->parameters([
        'promociones' => 'promocion'
    ]);

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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
