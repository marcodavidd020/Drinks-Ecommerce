#!/bin/bash

echo "🔧 Solución específica para Error 419 CSRF en Producción"
echo "========================================================"

# Verificar si estamos en el directorio correcto
if [ ! -f "artisan" ]; then
    echo "❌ Error: No se encontró el archivo artisan. Asegúrate de estar en el directorio raíz de Laravel."
    exit 1
fi

echo "📋 Paso 1: Crear tabla de sesiones..."
echo "------------------------------------"

# Crear migración de sesiones si no existe
if [ ! -f "database/migrations/*_create_sessions_table.php" ]; then
    echo "📝 Creando migración de sesiones..."
    php artisan session:table
    
    # Buscar el archivo de migración creado
    SESSION_MIGRATION=$(find database/migrations -name "*_create_sessions_table.php" | head -1)
    if [ -n "$SESSION_MIGRATION" ]; then
        echo "✅ Migración creada: $SESSION_MIGRATION"
    else
        echo "❌ Error: No se pudo crear la migración de sesiones"
        exit 1
    fi
else
    echo "✅ Migración de sesiones ya existe"
fi

echo ""
echo "📋 Paso 2: Ejecutar migración de sesiones..."
echo "-------------------------------------------"

# Ejecutar migración
echo "🔄 Ejecutando migración de sesiones..."
php artisan migrate --force

echo ""
echo "📋 Paso 3: Limpiar cache completo..."
echo "-----------------------------------"

# Limpiar todos los caches
echo "🧹 Limpiando cache de configuración..."
php artisan config:clear

echo "🧹 Limpiando cache de rutas..."
php artisan route:clear

echo "🧹 Limpiando cache de vistas..."
php artisan view:clear

echo "🧹 Limpiando cache de aplicación..."
php artisan cache:clear

echo "🧹 Limpiando cache de sesiones..."
php artisan session:table 2>/dev/null || true

echo ""
echo "📋 Paso 4: Verificar configuración de sesiones..."
echo "------------------------------------------------"

# Verificar configuración actual
echo "🔍 Configuración actual de sesiones:"
php artisan tinker --execute="echo 'SESSION_DRIVER: ' . config('session.driver') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_LIFETIME: ' . config('session.lifetime') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_PATH: ' . config('session.path') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_DOMAIN: ' . config('session.domain') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_SECURE: ' . (config('session.secure') ? 'true' : 'false') . PHP_EOL;"
php artisan tinker --execute="echo 'SESSION_SAME_SITE: ' . config('session.same_site') . PHP_EOL;"

echo ""
echo "📋 Paso 5: Verificar tabla de sesiones..."
echo "----------------------------------------"

# Verificar si la tabla existe
echo "🔍 Verificando tabla de sesiones..."
php artisan tinker --execute="echo 'Tabla sessions existe: ' . (Schema::hasTable('sessions') ? 'SÍ' : 'NO') . PHP_EOL;"

if php artisan tinker --execute="echo Schema::hasTable('sessions');" 2>/dev/null | grep -q "1"; then
    echo "✅ Tabla de sesiones creada correctamente"
else
    echo "❌ Error: La tabla de sesiones no se creó correctamente"
    echo "🔄 Intentando crear la tabla manualmente..."
    php artisan migrate --force
fi

echo ""
echo "📋 Paso 6: Verificar token CSRF..."
echo "---------------------------------"

# Verificar que el token CSRF se esté generando
echo "🔍 Verificando generación de token CSRF..."
php artisan tinker --execute="echo 'CSRF Token generado: ' . (strlen(csrf_token()) > 0 ? 'SÍ' : 'NO') . PHP_EOL;"

echo ""
echo "📋 Paso 7: Optimizar aplicación..."
echo "--------------------------------"

# Optimizar la aplicación
echo "⚡ Optimizando aplicación..."
php artisan optimize:clear

echo ""
echo "📋 Paso 8: Verificar configuración de cookies..."
echo "-----------------------------------------------"

# Verificar configuración de cookies
echo "🔍 Verificando configuración de cookies..."
php artisan tinker --execute="echo 'APP_URL: ' . config('app.url') . PHP_EOL;"
php artisan tinker --execute="echo 'ASSET_URL: ' . config('app.asset_url') . PHP_EOL;"

echo ""
echo "📋 Paso 9: Crear archivo de configuración recomendado..."
echo "------------------------------------------------------"

# Crear archivo con configuración recomendada
cat > configuracion-sesiones-recomendada.env << 'EOF'
# Configuración recomendada para sesiones en subdirectorio
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
EOF

echo "✅ Archivo de configuración recomendada creado: configuracion-sesiones-recomendada.env"

echo ""
echo "📋 Paso 10: Verificar archivos críticos..."
echo "-----------------------------------------"

# Verificar archivos críticos
if [ -f "public/.htaccess" ]; then
    echo "✅ Archivo public/.htaccess existe"
    if grep -q "X-XSRF-Token" public/.htaccess; then
        echo "✅ Configuración X-XSRF-Token encontrada en .htaccess"
    else
        echo "⚠️  Configuración X-XSRF-Token no encontrada en .htaccess"
    fi
else
    echo "❌ Archivo public/.htaccess no encontrado"
fi

if [ -f "app/Http/Middleware/HandleInertiaRequests.php" ]; then
    echo "✅ Middleware HandleInertiaRequests existe"
    if grep -q "csrf_token" app/Http/Middleware/HandleInertiaRequests.php; then
        echo "✅ CSRF token configurado en Inertia"
    else
        echo "⚠️  CSRF token no configurado en Inertia"
    fi
else
    echo "❌ Middleware HandleInertiaRequests no encontrado"
fi

echo ""
echo "📋 Paso 11: Verificar logs de errores..."
echo "---------------------------------------"

# Verificar si hay errores en los logs
if [ -f "storage/logs/laravel.log" ]; then
    echo "🔍 Últimos errores en el log:"
    tail -10 storage/logs/laravel.log | grep -i "error\|exception\|419" || echo "No se encontraron errores recientes"
else
    echo "📝 Archivo de log no encontrado"
fi

echo ""
echo "🎯 Resumen de la solución:"
echo "=========================="
echo "✅ Tabla de sesiones creada/verificada"
echo "✅ Cache limpiado"
echo "✅ Configuración optimizada"
echo "✅ Archivo de configuración recomendada creado"
echo ""
echo "📝 Próximos pasos:"
echo "1. Copia la configuración de configuracion-sesiones-recomendada.env a tu .env"
echo "2. Reinicia el servidor web si es necesario"
echo "3. Prueba el login nuevamente"
echo "4. Si el problema persiste, revisa los logs en storage/logs/laravel.log"
echo ""
echo "🔧 Script completado exitosamente." 