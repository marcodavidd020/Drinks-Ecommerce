#!/bin/bash

# Script de despliegue para producción
# Uso: ./deploy-production.sh

echo "🚀 Iniciando despliegue de producción..."

# 1. Configurar variables de entorno para producción
echo "📝 Configurando variables de entorno..."

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "❌ Error: Archivo .env no encontrado"
    exit 1
fi

# Configurar APP_URL para producción
sed -i 's|APP_URL=.*|APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env

# Configurar VITE_APP_URL para el frontend
if grep -q "VITE_APP_URL" .env; then
    sed -i 's|VITE_APP_URL=.*|VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env
else
    echo "VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public" >> .env
fi

# Configurar entorno de producción
sed -i 's|APP_ENV=.*|APP_ENV=production|g' .env
sed -i 's|APP_DEBUG=.*|APP_DEBUG=false|g' .env

# Configurar sesión para subdirectorio
sed -i 's|SESSION_PATH=.*|SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env
sed -i 's|SESSION_DOMAIN=.*|SESSION_DOMAIN=tecnoweb.org.bo|g' .env
sed -i 's|SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|g' .env

echo "✅ Variables de entorno configuradas"

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
composer install --no-dev --optimize-autoloader

# 3. Limpiar y optimizar Laravel
echo "🧹 Limpiando caché..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Construir assets del frontend
echo "🔨 Construyendo assets del frontend..."
npm run build

# 5. Verificar que la imagen no-image.jpg existe
echo "🖼️ Verificando assets de imágenes..."
if [ ! -f "public/images/no-image.jpg" ]; then
    echo "⚠️ Advertencia: public/images/no-image.jpg no existe"
    echo "📝 Creando imagen placeholder..."
    # Crear una imagen placeholder simple (1x1 pixel transparente)
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/images/no-image.jpg
fi

# 6. Verificar permisos
echo "🔐 Configurando permisos..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# 7. Verificar rutas
echo "🛣️ Verificando rutas..."
php artisan route:list --name=checkout

# 8. Crear archivos para solucionar error 405
echo "🔧 Creando archivos para solucionar error 405..."

# Crear .htaccess en raíz si no existe
if [ ! -f ".htaccess" ]; then
    echo "📝 Creando .htaccess en directorio raíz..."
    cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect all requests to the public directory
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# If mod_rewrite is not available, try to redirect using PHP
<IfModule !mod_rewrite.c>
    <Files "index.php">
        SetHandler application/x-httpd-php
    </Files>
    
    # Redirect all requests to public/index.php
    RewriteEngine Off
    DirectoryIndex public/index.php
</IfModule>
EOF
fi

# Crear index.php en raíz si no existe
if [ ! -f "index.php" ]; then
    echo "📝 Creando index.php en directorio raíz..."
    cat > index.php << 'EOF'
<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

// Redirect to public directory
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without having installed a "real" web server software here.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';
EOF
fi

# Crear archivo de diagnóstico
echo "📝 Creando archivo de diagnóstico..."
cat > public/server-info.php << 'EOF'
<?php
/**
 * Archivo de diagnóstico del servidor web
 * Este archivo ayuda a identificar problemas de configuración
 */

echo "<h1>🔧 Diagnóstico del Servidor Web</h1>";

// Información básica del servidor
echo "<h2>📋 Información del Servidor</h2>";
echo "<ul>";
echo "<li><strong>Servidor:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li><strong>PHP Version:</strong> " . phpversion() . "</li>";
echo "<li><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</li>";
echo "<li><strong>Script Filename:</strong> " . $_SERVER['SCRIPT_FILENAME'] . "</li>";
echo "<li><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</li>";
echo "<li><strong>Request Method:</strong> " . $_SERVER['REQUEST_METHOD'] . "</li>";
echo "</ul>";

// Verificar módulos de Apache
echo "<h2>🔌 Módulos de Apache</h2>";
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    echo "<ul>";
    echo "<li><strong>mod_rewrite:</strong> " . (in_array('mod_rewrite', $modules) ? "✅ Habilitado" : "❌ Deshabilitado") . "</li>";
    echo "<li><strong>mod_headers:</strong> " . (in_array('mod_headers', $modules) ? "✅ Habilitado" : "❌ Deshabilitado") . "</li>";
    echo "</ul>";
} else {
    echo "<p>⚠️ No se puede verificar módulos de Apache (función no disponible)</p>";
}

// Verificar archivos importantes
echo "<h2>📁 Archivos Importantes</h2>";
$files = [
    '../.htaccess' => 'Archivo .htaccess en raíz',
    '.htaccess' => 'Archivo .htaccess en public',
    'index.php' => 'Archivo index.php en public',
    '../index.php' => 'Archivo index.php en raíz',
    '../vendor/autoload.php' => 'Autoloader de Composer',
    '../bootstrap/app.php' => 'Bootstrap de Laravel'
];

echo "<ul>";
foreach ($files as $file => $description) {
    $exists = file_exists($file);
    $readable = is_readable($file);
    echo "<li><strong>$description:</strong> ";
    echo $exists ? "✅ Existe" : "❌ No existe";
    echo $readable ? " y ✅ Legible" : " pero ❌ No legible";
    echo "</li>";
}
echo "</ul>";

echo "<hr>";
echo "<p><strong>Fecha y hora:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><em>Si ves esta página, el servidor web está funcionando correctamente.</em></p>";
?>
EOF

echo "✅ Archivos para solucionar error 405 creados"

echo "✅ Despliegue completado exitosamente!"
echo ""
echo "📋 Resumen de cambios:"
echo "   - Variables de entorno configuradas para producción"
echo "   - Caché de Laravel optimizado"
echo "   - Assets del frontend construidos"
echo "   - Permisos configurados"
echo ""
echo "🌐 URL de producción: https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public"
echo ""
echo "⚠️ Recuerda:"
echo "   - Subir todos los archivos al servidor"
echo "   - Configurar la base de datos en el servidor"
echo "   - Ejecutar las migraciones: php artisan migrate"
echo "   - Ejecutar los seeders: php artisan db:seed" 