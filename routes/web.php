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
use App\Http\Controllers\RolController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\CarritoController;
use App\Http\Controllers\ClienteDashboardController;
use App\Http\Controllers\ConsumirServicioController;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CheckoutController;
use App\Helpers\AuthHelper;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

// Página principal usando el HomeController
Route::get('/', [HomeController::class, 'index'])->name('home');

// Ruta de demostración de modos (accesible sin autenticación)
Route::get('/modes-demo', function () {
    return Inertia::render('ModesDemo');
})->name('modes.demo');

// Rutas públicas para productos (sin autenticación requerida)
Route::get('/product/{producto}', [ProductoController::class, 'showPublic'])->name('product.show');

// Rutas públicas del catálogo (accesibles sin autenticación)
Route::get('/catalogo/productos', [CatalogoController::class, 'productos'])->name('catalogo.productos');
Route::get('/catalogo/promociones', [CatalogoController::class, 'promociones'])->name('catalogo.promociones');

// Dashboard admin - verificar permisos de manera flexible (NO para clientes solo)
Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'redirect.cliente'])
    ->name('dashboard');

// Rutas protegidas con autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    
    // API routes para funcionalidades dinámicas
    Route::prefix('api')->name('api.')->group(function () {
        // Contador del carrito para el header
        Route::get('/carrito/count', function () {
            $user = auth()->user();
            if (!$user || !$user->cliente) {
                return response()->json(['count' => 0]);
            }
            
            $carrito = \App\Models\Carrito::where('cliente_id', $user->cliente->id)
                                        ->where('estado', 'activo')
                                        ->first();
            
            $count = $carrito ? $carrito->total_productos : 0;
            return response()->json(['count' => $count]);
        })->name('carrito.count');

        // Obtener producto_almacen_id para agregar al carrito
        Route::get('/producto/{producto}/almacen', function ($productoId) {
            $productoAlmacen = \App\Models\ProductoAlmacen::where('producto_id', $productoId)
                                                        ->where('stock', '>', 0)
                                                        ->first();
            
            if (!$productoAlmacen) {
                return response()->json(['error' => 'Producto no disponible'], 404);
            }
            
            return response()->json(['producto_almacen_id' => $productoAlmacen->id]);
        })->name('producto.almacen');
    });
    
    // Dashboard especial para clientes
    Route::middleware(['role:cliente'])->group(function () {
        Route::get('/cliente/dashboard', [ClienteDashboardController::class, 'index'])->name('cliente.dashboard');
        Route::get('/cliente/compras', [ClienteDashboardController::class, 'compras'])->name('cliente.compras');
        Route::get('/cliente/compras/{venta}', [ClienteDashboardController::class, 'verCompra'])->name('cliente.compra.detalle');
    });
    
    // Rutas de carrito para clientes autenticados
    Route::prefix('carrito')->name('carrito.')->group(function () {
        Route::get('/', [CarritoController::class, 'index'])->name('index');
        Route::post('/agregar', [CarritoController::class, 'agregar'])->name('agregar');
        Route::patch('/actualizar/{detalleCarrito}', [CarritoController::class, 'actualizar'])->name('actualizar');
        Route::delete('/eliminar/{detalleCarrito}', [CarritoController::class, 'eliminar'])->name('eliminar');
        Route::delete('/vaciar', [CarritoController::class, 'vaciar'])->name('vaciar');
        Route::post('/checkout', [CarritoController::class, 'checkout'])->name('checkout');
    });
    
    // Rutas de checkout para el proceso completo de compra
    Route::prefix('checkout')->name('checkout.')->middleware(['role:cliente'])->group(function () {
        Route::get('/', [\App\Http\Controllers\CheckoutController::class, 'inicio'])->name('inicio');
        Route::get('/direccion', [\App\Http\Controllers\CheckoutController::class, 'direccion'])->name('direccion');
        Route::post('/direccion/store', [\App\Http\Controllers\CheckoutController::class, 'storeDireccion'])->name('direccion.store');
        Route::post('/pago', [\App\Http\Controllers\CheckoutController::class, 'pago'])->name('pago');
        Route::get('/datos-tarjeta', [\App\Http\Controllers\CheckoutController::class, 'datosTarjeta'])->name('datos-tarjeta');
        Route::post('/confirmar', [\App\Http\Controllers\CheckoutController::class, 'confirmar'])->name('confirmar');
        Route::post('/generar-qr', [\App\Http\Controllers\CheckoutController::class, 'generarQR'])->name('generar-qr');
        Route::post('/procesar', [\App\Http\Controllers\CheckoutController::class, 'procesar'])->name('procesar');
        Route::get('/exito/{pedido}', [\App\Http\Controllers\CheckoutController::class, 'exito'])->name('exito');
    });
    
    // Rutas para servicios de pago (QR y Tigo Money)
    Route::prefix('pago')->name('pago.')->middleware(['role:cliente'])->group(function () {
        Route::post('/recolectar', [ConsumirServicioController::class, 'RecolectarDatos'])->name('recolectar');
        Route::post('/consultar', [ConsumirServicioController::class, 'ConsultarEstado'])->name('consultar');
        Route::post('/callback', [ConsumirServicioController::class, 'urlCallback'])->name('callback');
    });
    
    // Rutas públicas para callback (sin middleware de autenticación)
    Route::post('/consultar', [ConsumirServicioController::class, 'ConsultarEstado'])->name('consultar.estado');
    
    // Ruta directa para servicio QR (similar al ejemplo que funciona)
    Route::post('/consumirServicio', [ConsumirServicioController::class, 'RecolectarDatos'])->name('consumirServicio');
    
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

    // Gestión de clientes - acceso para admin y vendedor
    Route::middleware(['has.gestion.role'])->group(function () {
        Route::resource('clientes', ClienteController::class);
        Route::patch('/clientes/{cliente}/toggle-status', [ClienteController::class, 'toggleStatus'])
            ->name('clientes.toggle-status');
    });

    // Gestión de proveedores - acceso para admin y vendedor
    Route::middleware(['has.roles:admin,vendedor'])->group(function () {
        Route::resource('proveedores', ProveedorController::class)->parameters([
            'proveedores' => 'proveedor'
        ]);
        Route::patch('/proveedores/{proveedor}/toggle-status', [ProveedorController::class, 'toggleStatus'])
            ->name('proveedores.toggle-status');
    });

    // Gestión de productos - acceso para admin y vendedor
    Route::middleware(['can.manage.products'])->group(function () {
        Route::resource('productos', ProductoController::class);
        Route::patch('/productos/{producto}/toggle-status', [ProductoController::class, 'toggleStatus'])
            ->name('productos.toggle-status');
        Route::patch('/productos/{producto}/update-stock', [ProductoController::class, 'updateStock'])
            ->name('productos.update-stock');
    });

    // Gestión de categorías - acceso para admin y vendedor
    Route::middleware(['has.roles:admin,vendedor'])->group(function () {
        Route::resource('categorias', CategoriaController::class);
    });

    // Gestión de almacenes - acceso para admin y vendedor
    Route::middleware(['has.roles:admin,vendedor'])->group(function () {
        Route::resource('almacenes', AlmacenController::class)->parameters([
            'almacenes' => 'almacen'
        ]);
    });

    // Gestión de inventarios - acceso para admin y vendedor
    Route::middleware(['has.roles:admin,vendedor'])->group(function () {
        Route::resource('inventarios', InventarioController::class)->parameters([
            'inventarios' => 'inventario'
        ]);
        Route::patch('/inventarios/{inventario}/update-stock', [InventarioController::class, 'updateStock'])
            ->name('inventarios.update-stock');
        Route::post('/inventarios/transferencia', [InventarioController::class, 'transferencia'])
            ->name('inventarios.transferencia');
    });

    // Gestión de ventas - acceso para admin y vendedor
    Route::middleware(['can.manage.sales'])->group(function () {
        Route::get('/ventas', [NotaVentaController::class, 'index'])->name('ventas.index');
        Route::get('/ventas/create', [NotaVentaController::class, 'create'])->name('ventas.create');
        Route::post('/ventas', [NotaVentaController::class, 'store'])->name('ventas.store');
        Route::get('/ventas/{venta}', [NotaVentaController::class, 'show'])->name('ventas.show');
        Route::post('/ventas/{venta}/estado', [NotaVentaController::class, 'updateEstado'])->name('ventas.update-estado');
    });

    // Gestión de compras - acceso para admin y vendedor
    Route::middleware(['has.roles:admin,vendedor'])->group(function () {
        Route::resource('compras', NotaCompraController::class)->parameters([
            'compras' => 'compra'
        ]);
        Route::patch('/compras/{compra}/estado', [NotaCompraController::class, 'cambiarEstado'])
            ->name('compras.cambiar-estado');
    });

    // Gestión de promociones - acceso para admin y vendedor
    Route::middleware(['can.manage.promotions'])->group(function () {
        Route::resource('promociones', PromocionController::class)->parameters([
            'promociones' => 'promocion'
        ]);
    });
    
    // Rutas administrativas - solo para admin
    Route::middleware(['admin.only'])->group(function () {
        Route::get('/admin/roles', [RolController::class, 'index'])->name('admin.roles.index');
        Route::get('/admin/roles/create', [RolController::class, 'create'])->name('admin.roles.create');
        Route::post('/admin/roles', [RolController::class, 'store'])->name('admin.roles.store');
        Route::get('/admin/roles/{role}', [RolController::class, 'show'])->name('admin.roles.show');
        Route::get('/admin/roles/{role}/edit', [RolController::class, 'edit'])->name('admin.roles.edit');
        Route::put('/admin/roles/{role}', [RolController::class, 'update'])->name('admin.roles.update');
        Route::patch('/admin/roles/{role}', [RolController::class, 'update']);
        Route::delete('/admin/roles/{role}', [RolController::class, 'destroy'])->name('admin.roles.destroy');

        Route::get('/admin/permissions', [PermisoController::class, 'index'])->name('admin.permissions.index');
        Route::get('/admin/permissions/create', [PermisoController::class, 'create'])->name('admin.permissions.create');
        Route::post('/admin/permissions', [PermisoController::class, 'store'])->name('admin.permissions.store');
        Route::get('/admin/permissions/{permission}', [PermisoController::class, 'show'])->name('admin.permissions.show');
        Route::get('/admin/permissions/{permission}/edit', [PermisoController::class, 'edit'])->name('admin.permissions.edit');
        Route::put('/admin/permissions/{permission}', [PermisoController::class, 'update'])->name('admin.permissions.update');
        Route::patch('/admin/permissions/{permission}', [PermisoController::class, 'update']);
        Route::delete('/admin/permissions/{permission}', [PermisoController::class, 'destroy'])->name('admin.permissions.destroy');
        Route::post('/admin/permissions/sync', [PermisoController::class, 'syncPermissions'])->name('admin.permissions.sync');

        // Mantener rutas legacy para compatibilidad
        Route::get('/admin/roles', [RolController::class, 'index'])->name('admin.roles');
        Route::get('/admin/permissions', [PermisoController::class, 'index'])->name('admin.permissions');
    });

    // Rutas para reportes - acceso solo para admin
    Route::middleware(['has.roles:admin'])->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
        Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
        Route::get('/reports/clients', [ReportController::class, 'clients'])->name('reports.clients');
        Route::get('/reports/purchases', [ReportController::class, 'purchases'])->name('reports.purchases');
        
        // Rutas para descargar PDFs
        Route::get('/reports/sales/pdf', [ReportController::class, 'downloadSalesPdf'])->name('reports.sales.pdf');
        Route::get('/reports/inventory/pdf', [ReportController::class, 'downloadInventoryPdf'])->name('reports.inventory.pdf');
        Route::get('/reports/clients/pdf', [ReportController::class, 'downloadClientsPdf'])->name('reports.clients.pdf');
        Route::get('/reports/purchases/pdf', [ReportController::class, 'downloadPurchasesPdf'])->name('reports.purchases.pdf');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
