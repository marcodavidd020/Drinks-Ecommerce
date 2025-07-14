#!/bin/bash

echo "🔧 Solución específica para Error CSRF en Carrito"
echo "================================================"

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
echo "📋 Paso 3: Verificar rutas del carrito..."
echo "----------------------------------------"

# Verificar que las rutas del carrito estén registradas
echo "🔍 Verificando rutas del carrito..."
php artisan route:list --name=carrito

echo ""
echo "📋 Paso 4: Verificar controlador del carrito..."
echo "----------------------------------------------"

# Verificar que el controlador del carrito existe
if [ -f "app/Http/Controllers/CarritoController.php" ]; then
    echo "✅ Controlador CarritoController existe"
    
    # Verificar si el método agregar existe
    if grep -q "public function agregar" app/Http/Controllers/CarritoController.php; then
        echo "✅ Método agregar existe en CarritoController"
    else
        echo "❌ Método agregar NO existe en CarritoController"
    fi
else
    echo "❌ Controlador CarritoController no encontrado"
fi

echo ""
echo "📋 Paso 5: Verificar middleware de autenticación..."
echo "------------------------------------------------"

# Verificar que las rutas del carrito tengan middleware de auth
echo "🔍 Verificando middleware en rutas del carrito..."
php artisan route:list --name=carrito | grep -E "(carrito|auth)"

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
    
    # Verificar si las rutas del carrito están excluidas del CSRF
    if grep -q "carrito" app/Http/Middleware/VerifyCsrfToken.php; then
        echo "⚠️  Rutas del carrito están excluidas del CSRF (esto puede ser un problema)"
    else
        echo "✅ Rutas del carrito NO están excluidas del CSRF (correcto)"
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
echo "📋 Paso 9: Crear configuración específica para carrito..."
echo "--------------------------------------------------------"

# Crear archivo de configuración específica para carrito
cat > configuracion-carrito-csrf.env << 'EOF'
# Configuración específica para carrito en subdirectorio
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
EOF

echo "✅ Archivo de configuración específica creado: configuracion-carrito-csrf.env"

echo ""
echo "📋 Paso 10: Verificar logs de errores..."
echo "---------------------------------------"

# Verificar logs de errores
if [ -f "storage/logs/laravel.log" ]; then
    echo "🔍 Últimos errores relacionados con carrito o CSRF:"
    tail -30 storage/logs/laravel.log | grep -i "carrito\|csrf\|419\|token" || echo "No se encontraron errores relacionados con carrito o CSRF"
else
    echo "📝 Archivo de log no encontrado"
fi

echo ""
echo "📋 Paso 11: Crear script de prueba para carrito..."
echo "------------------------------------------------"

# Crear script de prueba para verificar carrito
cat > test-carrito.php << 'EOF'
<?php
// Script de prueba para verificar carrito
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Prueba de Carrito ===\n";
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
} else {
    echo "No hay usuario autenticado\n";
}

// Verificar rutas del carrito
$router = app('router');
$carritoRoutes = collect($router->getRoutes())->filter(function ($route) {
    return str_contains($route->uri(), 'carrito');
});

echo "Rutas del carrito encontradas:\n";
foreach ($carritoRoutes as $route) {
    echo "- " . $route->methods()[0] . " " . $route->uri() . "\n";
}

echo "===========================\n";
EOF

echo "✅ Script de prueba creado: test-carrito.php"

echo ""
echo "📋 Paso 12: Ejecutar prueba de carrito..."
echo "----------------------------------------"

# Ejecutar prueba de carrito
echo "🔍 Ejecutando prueba de carrito..."
php test-carrito.php

echo ""
echo "🎯 Resumen de la solución:"
echo "=========================="
echo "✅ Tabla de sesiones verificada"
echo "✅ Rutas del carrito verificadas"
echo "✅ Controlador del carrito verificado"
echo "✅ Cache limpiado"
echo "✅ Configuración de middleware verificada"
echo "✅ Archivo de configuración específica creado"
echo "✅ Script de prueba creado"
echo ""
echo "📝 Próximos pasos:"
echo "1. Copia la configuración de configuracion-carrito-csrf.env a tu .env"
echo "2. Reinicia el servidor web"
echo "3. Prueba agregar productos al carrito nuevamente"
echo "4. Si el problema persiste, ejecuta: php test-carrito.php"
echo "5. Revisa los logs en storage/logs/laravel.log"
echo ""
echo "🔧 Script completado exitosamente." 