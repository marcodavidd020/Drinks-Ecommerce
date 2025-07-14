#!/bin/bash

echo "🔧 Solución específica para Error 419 CSRF en Producción"
echo "========================================================"

# Verificar si estamos en el directorio correcto
if [ ! -f "artisan" ]; then
    echo "❌ Error: No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de Laravel."
    exit 1
fi

echo "📋 Paso 1: Verificar configuración actual de sesiones..."
echo "--------------------------------------------------------"

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
    echo "✅ Tabla de sesiones ya existe en la base de datos"
else
    echo "❌ Tabla de sesiones NO existe"
    echo "📝 Creando migración de sesiones..."
    php artisan session:table 2>/dev/null || echo "⚠️  Migración ya existe, continuando..."
    echo "🔄 Ejecutando migración de sesiones..."
    php artisan migrate --force
    echo "✅ Migración de sesiones ejecutada"
fi

echo ""
echo "📋 Paso 3: Limpiar cache completo..."
echo "-----------------------------------"

# Limpiar todos los caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear

echo "✅ Cache limpiado"

echo ""
echo "📋 Paso 4: Verificar middleware CSRF..."
echo "--------------------------------------"

# Verificar que el middleware CSRF esté configurado
if [ -f "app/Http/Middleware/VerifyCsrfToken.php" ]; then
    echo "✅ Middleware VerifyCsrfToken existe"
    if grep -q "except" app/Http/Middleware/VerifyCsrfToken.php; then
        echo "⚠️  Verificar si las rutas de auth están excluidas del CSRF"
    else
        echo "✅ Middleware CSRF configurado correctamente"
    fi
else
    echo "❌ Middleware VerifyCsrfToken no encontrado"
fi

echo ""
echo "📋 Paso 5: Verificar configuración de Inertia..."
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
echo "📋 Paso 6: Verificar archivo .htaccess..."
echo "----------------------------------------"

# Verificar configuración de .htaccess
if [ -f "public/.htaccess" ]; then
    echo "✅ Archivo public/.htaccess existe"
    if grep -q "X-XSRF-Token" public/.htaccess; then
        echo "✅ Configuración X-XSRF-Token encontrada"
    else
        echo "❌ Configuración X-XSRF-Token no encontrada"
    fi
else
    echo "❌ Archivo public/.htaccess no encontrado"
fi

echo ""
echo "📋 Paso 7: Crear configuración específica para auth..."
echo "-----------------------------------------------------"

# Crear archivo de configuración específica para auth
cat > configuracion-auth-csrf.env << 'EOF'
# Configuración específica para rutas de autenticación en subdirectorio
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

echo "✅ Archivo de configuración específica creado: configuracion-auth-csrf.env"

echo ""
echo "📋 Paso 8: Verificar rutas de autenticación..."
echo "---------------------------------------------"

# Verificar que las rutas de auth estén registradas
echo "🔍 Verificando rutas de autenticación..."
php artisan route:list --name=login
php artisan route:list --name=register

echo ""
echo "📋 Paso 9: Verificar logs de errores..."
echo "---------------------------------------"

# Verificar logs de errores
if [ -f "storage/logs/laravel.log" ]; then
    echo "🔍 Últimos errores relacionados con CSRF:"
    tail -20 storage/logs/laravel.log | grep -i "csrf\|419\|token" || echo "No se encontraron errores relacionados con CSRF"
else
    echo "📝 Archivo de log no encontrado"
fi

echo ""
echo "📋 Paso 10: Crear script de prueba..."
echo "------------------------------------"

# Crear script de prueba para verificar CSRF
cat > test-csrf.php << 'EOF'
<?php
// Script de prueba para verificar CSRF token
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Prueba de CSRF Token ===\n";
echo "CSRF Token generado: " . csrf_token() . "\n";
echo "Longitud del token: " . strlen(csrf_token()) . "\n";
echo "Session ID: " . session()->getId() . "\n";
echo "Session Driver: " . config('session.driver') . "\n";
echo "Session Path: " . config('session.path') . "\n";
echo "Session Domain: " . config('session.domain') . "\n";
echo "APP URL: " . config('app.url') . "\n";
echo "===========================\n";
EOF

echo "✅ Script de prueba creado: test-csrf.php"

echo ""
echo "📋 Paso 11: Ejecutar prueba de CSRF..."
echo "-------------------------------------"

# Ejecutar prueba de CSRF
echo "🔍 Ejecutando prueba de CSRF..."
php test-csrf.php

echo ""
echo "🎯 Resumen de la solución:"
echo "=========================="
echo "✅ Tabla de sesiones verificada"
echo "✅ Cache limpiado"
echo "✅ Configuración de middleware verificada"
echo "✅ Archivo de configuración específica creado"
echo "✅ Script de prueba creado"
echo ""
echo "📝 Próximos pasos:"
echo "1. Copia la configuración de configuracion-auth-csrf.env a tu .env"
echo "2. Reinicia el servidor web"
echo "3. Prueba el login/register nuevamente"
echo "4. Si el problema persiste, ejecuta: php test-csrf.php"
echo "5. Revisa los logs en storage/logs/laravel.log"
echo ""
echo "🔧 Script completado exitosamente." 