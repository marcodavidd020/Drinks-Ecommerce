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