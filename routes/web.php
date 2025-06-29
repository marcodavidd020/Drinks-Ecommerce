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
use App\Helpers\AuthHelper;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página principal usando el HomeController
Route::get('/', [HomeController::class, 'index'])->name('home');

// Ruta de demostración de modos (accesible sin autenticación)
Route::get('/modes-demo', function () {
    return Inertia::render('ModesDemo');
})->name('modes.demo');

// Dashboard - verificar permisos de manera flexible
Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Rutas protegidas con autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Gestión de usuarios - solo para admin y usuarios con permisos específicos
    Route::middleware(['can.manage.users'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    });

    // Gestión de clientes - acceso para admin, empleado y organizador
    Route::middleware(['has.gestion.role'])->group(function () {
        Route::resource('clientes', ClienteController::class);
        Route::patch('/clientes/{cliente}/toggle-status', [ClienteController::class, 'toggleStatus'])
            ->name('clientes.toggle-status');
    });

    // Gestión de proveedores - acceso para admin y empleado
    Route::middleware(['has.roles:admin,empleado'])->group(function () {
        Route::resource('proveedores', ProveedorController::class)->parameters([
            'proveedores' => 'proveedor'
        ]);
        Route::patch('/proveedores/{proveedor}/toggle-status', [ProveedorController::class, 'toggleStatus'])
            ->name('proveedores.toggle-status');
    });

    // Gestión de productos - acceso para admin, empleado y organizador
    Route::middleware(['can.manage.products'])->group(function () {
        Route::resource('productos', ProductoController::class);
        Route::patch('/productos/{producto}/toggle-status', [ProductoController::class, 'toggleStatus'])
            ->name('productos.toggle-status');
        Route::patch('/productos/{producto}/update-stock', [ProductoController::class, 'updateStock'])
            ->name('productos.update-stock');
    });

    // Gestión de categorías - acceso para admin y empleado
    Route::middleware(['has.roles:admin,empleado'])->group(function () {
        Route::resource('categorias', CategoriaController::class);
    });

    // Gestión de almacenes - acceso para admin y empleado
    Route::middleware(['has.roles:admin,empleado'])->group(function () {
        Route::resource('almacenes', AlmacenController::class)->parameters([
            'almacenes' => 'almacen'
        ]);
    });

    // Gestión de inventarios - acceso para admin y empleado
    Route::middleware(['has.roles:admin,empleado'])->group(function () {
        Route::resource('inventarios', InventarioController::class)->parameters([
            'inventarios' => 'inventario'
        ]);
        Route::patch('/inventarios/{inventario}/update-stock', [InventarioController::class, 'updateStock'])
            ->name('inventarios.update-stock');
        Route::post('/inventarios/transferencia', [InventarioController::class, 'transferencia'])
            ->name('inventarios.transferencia');
    });

    // Gestión de ventas - acceso para admin, empleado y organizador
    Route::middleware(['can.manage.sales'])->group(function () {
        Route::get('/ventas', [NotaVentaController::class, 'index'])->name('ventas.index');
        Route::get('/ventas/create', [NotaVentaController::class, 'create'])->name('ventas.create');
        Route::post('/ventas', [NotaVentaController::class, 'store'])->name('ventas.store');
        Route::get('/ventas/{venta}', [NotaVentaController::class, 'show'])->name('ventas.show');
        Route::post('/ventas/{venta}/estado', [NotaVentaController::class, 'updateEstado'])->name('ventas.update-estado');
    });

    // Gestión de compras - acceso para admin y empleado
    Route::middleware(['has.roles:admin,empleado'])->group(function () {
        Route::resource('compras', NotaCompraController::class)->parameters([
            'compras' => 'compra'
        ]);
        Route::patch('/compras/{compra}/estado', [NotaCompraController::class, 'cambiarEstado'])
            ->name('compras.cambiar-estado');
    });

    // Gestión de promociones - acceso para admin, empleado y organizador
    Route::middleware(['can.manage.promotions'])->group(function () {
        Route::resource('promociones', PromocionController::class)->parameters([
            'promociones' => 'promocion'
        ]);
    });
    
    // Rutas administrativas - solo para admin
    Route::middleware(['admin.only'])->group(function () {
        Route::get('/admin/roles', function () {
            return Inertia::render('Admin/Roles');
        })->name('admin.roles');

        Route::get('/admin/permissions', function () {
            return Inertia::render('Admin/Permissions');
        })->name('admin.permissions');
    });

    // Rutas para reportes - acceso para admin y organizador
    Route::middleware(['has.roles:admin,organizador'])->group(function () {
        Route::get('/reports', function () {
            return Inertia::render('Reports/Index');
        })->name('reports.index');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
