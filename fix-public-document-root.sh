#!/bin/bash

# Script para ajustar configuración cuando el document root es public/
# Uso: ./fix-public-document-root.sh

echo "🔧 Ajustando configuración para document root public/..."

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "public/index.php" ]; then
    echo "❌ Error: No se encontró public/index.php"
    echo "   Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

# 2. Eliminar archivos innecesarios del directorio raíz
echo "🗑️ Eliminando archivos innecesarios del directorio raíz..."
rm -f .htaccess index.php

# 3. Verificar archivos en public/
echo "📁 Verificando archivos en public/..."
if [ ! -f "public/.htaccess" ]; then
    echo "❌ Error: public/.htaccess no existe"
    exit 1
fi

if [ ! -f "public/index.php" ]; then
    echo "❌ Error: public/index.php no existe"
    exit 1
fi

echo "✅ Archivos en public/ verificados"

# 4. Verificar configuración de .env
echo "⚙️ Verificando configuración de .env..."

# Verificar que APP_URL esté configurado correctamente
if grep -q "APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public" .env; then
    echo "✅ APP_URL configurado correctamente"
else
    echo "⚠️ APP_URL no está configurado correctamente"
    echo "   Configurando APP_URL..."
    sed -i 's|APP_URL=.*|APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env
fi

# Verificar que VITE_APP_URL esté configurado
if grep -q "VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public" .env; then
    echo "✅ VITE_APP_URL configurado correctamente"
else
    echo "⚠️ VITE_APP_URL no está configurado correctamente"
    echo "   Configurando VITE_APP_URL..."
    if grep -q "VITE_APP_URL" .env; then
        sed -i 's|VITE_APP_URL=.*|VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env
    else
        echo "VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public" >> .env
    fi
fi

# 5. Verificar configuración de sesión
echo "🍪 Verificando configuración de sesión..."

# Verificar SESSION_PATH
if grep -q "SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public" .env; then
    echo "✅ SESSION_PATH configurado correctamente"
else
    echo "⚠️ SESSION_PATH no está configurado correctamente"
    echo "   Configurando SESSION_PATH..."
    if grep -q "SESSION_PATH" .env; then
        sed -i 's|SESSION_PATH=.*|SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public|g' .env
    else
        echo "SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public" >> .env
    fi
fi

# Verificar SESSION_DOMAIN
if grep -q "SESSION_DOMAIN=tecnoweb.org.bo" .env; then
    echo "✅ SESSION_DOMAIN configurado correctamente"
else
    echo "⚠️ SESSION_DOMAIN no está configurado correctamente"
    echo "   Configurando SESSION_DOMAIN..."
    if grep -q "SESSION_DOMAIN" .env; then
        sed -i 's|SESSION_DOMAIN=.*|SESSION_DOMAIN=tecnoweb.org.bo|g' .env
    else
        echo "SESSION_DOMAIN=tecnoweb.org.bo" >> .env
    fi
fi

# 6. Limpiar caché
echo "🧹 Limpiando caché..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Caché limpiado y optimizado"

# 7. Verificar rutas
echo "🛣️ Verificando rutas..."
php artisan route:list --name=home | head -5

echo "✅ Rutas verificadas"

# 8. Verificar archivos de diagnóstico
echo "🧪 Verificando archivos de diagnóstico..."
if [ -f "public/server-info.php" ]; then
    echo "✅ public/server-info.php existe"
else
    echo "❌ public/server-info.php no existe"
fi

if [ -f "public/test.html" ]; then
    echo "✅ public/test.html existe"
else
    echo "❌ public/test.html no existe"
fi

# 9. Verificar imagen no-image.jpg
echo "🖼️ Verificando imagen no-image.jpg..."
if [ -f "public/images/no-image.jpg" ]; then
    echo "✅ public/images/no-image.jpg existe"
else
    echo "⚠️ public/images/no-image.jpg no existe"
    echo "   Creando imagen placeholder..."
    # Crear una imagen placeholder simple (1x1 pixel transparente)
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > public/images/no-image.jpg
fi

echo ""
echo "✅ Configuración ajustada para document root public/"
echo ""
echo "📋 Estructura final:"
echo "   Document Root: /inf513/grupo21sc/Drinks-Ecommerce/public/"
echo "   URL Principal: https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/"
echo ""
echo "🔍 URLs de verificación:"
echo "   - https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/test.html"
echo "   - https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/server-info.php"
echo "   - https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/"
echo ""
echo "📝 Notas importantes:"
echo "   - El document root del servidor debe apuntar a: /inf513/grupo21sc/Drinks-Ecommerce/public/"
echo "   - No se necesitan archivos .htaccess o index.php en el directorio raíz"
echo "   - Todas las URLs deben incluir /public/ al final" 