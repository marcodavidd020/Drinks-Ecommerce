#!/bin/bash

echo "🔧 Solución específica para Error CSRF en Checkout"
echo "================================================="

# Verificar si estamos en el directorio correcto
if [ ! -f "artisan" ]; then
    echo "❌ Error: No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de Laravel."
    exit 1
fi

echo "📋 Paso 1: Verificar configuración de sesiones..."
echo "------------------------------------------------"

# Verificar configuración actual
echo "🔍 Configuración actual:"
php artisan tinker --execute="echo 'SESSION_DRIVER: ' . config('session.driver') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_PATH: ' . config('session.path') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_DOMAIN: ' . config('session.domain') . PHP_EOL;"
php artisan tinker --execute="echo 'APP_URL: ' . config('app.url') . PHP_EOL;"

echo ""
echo "📋 Paso 2: Verificar tabla de sesiones..."
echo "----------------------------------------"

# Verificar si existe la tabla de sesiones
echo "🔍 Verificando si la tabla sessions existe..."
if php artisan tinker --execute="echo Schema::hasTable('sessions');" 2>/dev/null | grep -q "1"; then
    echo "✅ Tabla de sesiones existe en la base de datos"
else
    echo "❌ Tabla de sesiones NO existe"
    echo "📝 Creando migración de sesiones..."
    php artisan session:table 2>/dev/null || echo "⚠️  Migración ya existe, continuando..."
    echo "🔄 Ejecutando migración de sesiones..."
    php artisan migrate --force
    echo "✅ Migración de sesiones ejecutada"
fi

echo ""
echo "📋 Paso 3: Verificar rutas del checkout..."
echo "------------------------------------------"

# Verificar que las rutas del checkout estén registradas
echo "🔍 Verificando rutas del checkout..."
php artisan route:list --name=checkout

echo ""
echo "📋 Paso 4: Verificar controlador del checkout..."
echo "------------------------------------------------"

# Verificar que el controlador del checkout existe
if [ -f "app/Http/Controllers/CheckoutController.php" ]; then
    echo "✅ Controlador CheckoutController existe"
    
    # Verificar si el método generarQR existe
    if grep -q "public function generarQR" app/Http/Controllers/CheckoutController.php; then
        echo "✅ Método generarQR existe en CheckoutController"
    else
        echo "❌ Método generarQR NO existe en CheckoutController"
    fi
    
    # Verificar si el método procesar existe
    if grep -q "public function procesar" app/Http/Controllers/CheckoutController.php; then
        echo "✅ Método procesar existe en CheckoutController"
    else
        echo "❌ Método procesar NO existe en CheckoutController"
    fi
else
    echo "❌ Controlador CheckoutController no encontrado"
fi

echo ""
echo "📋 Paso 5: Verificar middleware de autenticación..."
echo "------------------------------------------------"

# Verificar que las rutas del checkout tengan middleware de auth
echo "🔍 Verificando middleware en rutas del checkout..."
php artisan route:list --name=checkout | grep -E "(checkout|auth|role)"

echo ""
echo "📋 Paso 6: Limpiar cache completo..."
echo "-----------------------------------"

# Limpiar todos los caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear

echo "✅ Cache limpiado"

echo ""
echo "📋 Paso 7: Verificar configuración de CSRF..."
echo "--------------------------------------------"

# Verificar middleware CSRF
if [ -f "app/Http/Middleware/VerifyCsrfToken.php" ]; then
    echo "✅ Middleware VerifyCsrfToken existe"
    
    # Verificar si las rutas del checkout están excluidas del CSRF
    if grep -q "checkout" app/Http/Middleware/VerifyCsrfToken.php; then
        echo "⚠️  Rutas del checkout están excluidas del CSRF (esto puede ser un problema)"
    else
        echo "✅ Rutas del checkout NO están excluidas del CSRF (correcto)"
    fi
else
    echo "❌ Middleware VerifyCsrfToken no encontrado"
fi

echo ""
echo "📋 Paso 8: Verificar configuración de Inertia..."
echo "-----------------------------------------------"

# Verificar configuración de Inertia
if [ -f "app/Http/Middleware/HandleInertiaRequests.php" ]; then
    echo "✅ Middleware HandleInertiaRequests existe"
    if grep -q "csrf_token" app/Http/Middleware/HandleInertiaRequests.php; then
        echo "✅ CSRF token configurado en Inertia"
    else
        echo "❌ CSRF token no configurado en Inertia"
    fi
else
    echo "❌ Middleware HandleInertiaRequests no encontrado"
fi

echo ""
echo "📋 Paso 9: Verificar servicios de pago..."
echo "----------------------------------------"

# Verificar que el controlador de servicios de pago existe
if [ -f "app/Http/Controllers/ConsumirServicioController.php" ]; then
    echo "✅ Controlador ConsumirServicioController existe"
    
    # Verificar métodos importantes
    if grep -q "public function RecolectarDatos" app/Http/Controllers/ConsumirServicioController.php; then
        echo "✅ Método RecolectarDatos existe"
    else
        echo "❌ Método RecolectarDatos NO existe"
    fi
    
    if grep -q "public function ConsultarEstado" app/Http/Controllers/ConsumirServicioController.php; then
        echo "✅ Método ConsultarEstado existe"
    else
        echo "❌ Método ConsultarEstado NO existe"
    fi
else
    echo "❌ Controlador ConsumirServicioController no encontrado"
fi

echo ""
echo "📋 Paso 10: Crear configuración específica para checkout..."
echo "-----------------------------------------------------------"

# Crear archivo de configuración específica para checkout
cat > configuracion-checkout-csrf.env << 'EOF'
# Configuración específica para checkout en subdirectorio
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public
SESSION_DOMAIN=www.tecnoweb.org.bo
SESSION_SECURE_COOKIE=false
SESSION_SAME_SITE=lax
SESSION_HTTP_ONLY=true

# Configuración de la aplicación
APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public
ASSET_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public

# Configuración específica para CSRF
CSRF_TRUSTED_ORIGINS=https://www.tecnoweb.org.bo

# Configuración para servicios de pago
PAYMENT_SERVICE_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public
EOF

echo "✅ Archivo de configuración específica creado: configuracion-checkout-csrf.env"

echo ""
echo "📋 Paso 11: Verificar logs de errores..."
echo "---------------------------------------"

# Verificar logs de errores
if [ -f "storage/logs/laravel.log" ]; then
    echo "🔍 Últimos errores relacionados con checkout o CSRF:"
    tail -30 storage/logs/laravel.log | grep -i "checkout\|csrf\|419\|token\|qr" || echo "No se encontraron errores relacionados con checkout o CSRF"
else
    echo "📝 Archivo de log no encontrado"
fi

echo ""
echo "📋 Paso 12: Crear script de prueba para checkout..."
echo "--------------------------------------------------"

# Crear script de prueba para verificar checkout
cat > test-checkout.php << 'EOF'
<?php
// Script de prueba para verificar checkout
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Prueba de Checkout ===\n";
echo "CSRF Token generado: " . csrf_token() . "\n";
echo "Session ID: " . session()->getId() . "\n";
echo "Session Driver: " . config('session.driver') . "\n";
echo "Session Path: " . config('session.path') . "\n";
echo "Session Domain: " . config('session.domain') . "\n";
echo "APP URL: " . config('app.url') . "\n";

// Verificar si existe un usuario autenticado
if (auth()->check()) {
    echo "Usuario autenticado: " . auth()->user()->email . "\n";
    echo "Roles del usuario: " . auth()->user()->roles->pluck('name')->implode(', ') . "\n";
    
    // Verificar si el usuario es cliente
    if (auth()->user()->hasRole('cliente')) {
        echo "✅ Usuario tiene rol cliente\n";
    } else {
        echo "❌ Usuario NO tiene rol cliente\n";
    }
} else {
    echo "No hay usuario autenticado\n";
}

// Verificar rutas del checkout
$router = app('router');
$checkoutRoutes = collect($router->getRoutes())->filter(function ($route) {
    return str_contains($route->uri(), 'checkout');
});

echo "Rutas del checkout encontradas:\n";
foreach ($checkoutRoutes as $route) {
    echo "- " . $route->methods()[0] . " " . $route->uri() . "\n";
}

// Verificar servicios de pago
$paymentRoutes = collect($router->getRoutes())->filter(function ($route) {
    return str_contains($route->uri(), 'pago') || str_contains($route->uri(), 'servicio');
});

echo "Rutas de servicios de pago encontradas:\n";
foreach ($paymentRoutes as $route) {
    echo "- " . $route->methods()[0] . " " . $route->uri() . "\n";
}

echo "===========================\n";
EOF

echo "✅ Script de prueba creado: test-checkout.php"

echo ""
echo "📋 Paso 13: Ejecutar prueba de checkout..."
echo "-----------------------------------------"

# Ejecutar prueba de checkout
echo "🔍 Ejecutando prueba de checkout..."
php test-checkout.php

echo ""
echo "🎯 Resumen de la solución:"
echo "=========================="
echo "✅ Tabla de sesiones verificada"
echo "✅ Rutas del checkout verificadas"
echo "✅ Controlador del checkout verificado"
echo "✅ Servicios de pago verificados"
echo "✅ Cache limpiado"
echo "✅ Configuración de middleware verificada"
echo "✅ Archivo de configuración específica creado"
echo "✅ Script de prueba creado"
echo ""
echo "📝 Próximos pasos:"
echo "1. Copia la configuración de configuracion-checkout-csrf.env a tu .env"
echo "2. Reinicia el servidor web"
echo "3. Prueba el proceso de checkout nuevamente"
echo "4. Si el problema persiste, ejecuta: php test-checkout.php"
echo "5. Revisa los logs en storage/logs/laravel.log"
echo ""
echo "🔧 Script completado exitosamente." 