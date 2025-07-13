#!/bin/bash

# Script para verificar y solucionar problemas de configuración del servidor web
# Uso: ./fix-server-config.sh

echo "🔧 Verificando configuración del servidor web..."

# 1. Verificar que los archivos necesarios existen
echo "📁 Verificando archivos necesarios..."

if [ ! -f "public/index.php" ]; then
    echo "❌ Error: public/index.php no existe"
    exit 1
fi

if [ ! -f "public/.htaccess" ]; then
    echo "❌ Error: public/.htaccess no existe"
    exit 1
fi

if [ ! -f ".htaccess" ]; then
    echo "❌ Error: .htaccess no existe"
    exit 1
fi

if [ ! -f "index.php" ]; then
    echo "❌ Error: index.php no existe"
    exit 1
fi

echo "✅ Todos los archivos necesarios existen"

# 2. Verificar permisos
echo "🔐 Verificando permisos..."

chmod 644 public/index.php
chmod 644 public/.htaccess
chmod 644 .htaccess
chmod 644 index.php

echo "✅ Permisos configurados"

# 3. Verificar configuración de Laravel
echo "⚙️ Verificando configuración de Laravel..."

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

# 4. Limpiar caché
echo "🧹 Limpiando caché..."

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Caché limpiado y optimizado"

# 5. Verificar rutas
echo "🛣️ Verificando rutas..."

php artisan route:list --name=home | head -5

echo "✅ Rutas verificadas"

# 6. Crear archivo de prueba
echo "🧪 Creando archivo de prueba..."

cat > public/test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Test - Laravel está funcionando</title>
</head>
<body>
    <h1>✅ Laravel está funcionando correctamente</h1>
    <p>Si puedes ver esta página, el servidor web está configurado correctamente.</p>
    <p>Fecha: $(date)</p>
</body>
</html>
EOF

echo "✅ Archivo de prueba creado: public/test.html"

# 7. Verificar estructura de directorios
echo "📂 Verificando estructura de directorios..."

echo "Estructura actual:"
echo "├── .htaccess (redirige a public/)"
echo "├── index.php (redirige a public/index.php)"
echo "├── public/"
echo "│   ├── .htaccess (configuración de Laravel)"
echo "│   ├── index.php (punto de entrada de Laravel)"
echo "│   └── test.html (archivo de prueba)"
echo "└── ... (resto de archivos de Laravel)"

echo ""
echo "✅ Verificación completada"
echo ""
echo "📋 Próximos pasos:"
echo "1. Subir todos los archivos al servidor"
echo "2. Verificar que el servidor web tenga mod_rewrite habilitado"
echo "3. Probar la URL: https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/test.html"
echo "4. Si test.html funciona, probar la URL principal"
echo ""
echo "🔍 Si sigue el error 405:"
echo "- Verificar que mod_rewrite esté habilitado en el servidor"
echo "- Verificar que AllowOverride esté configurado como All en el servidor"
echo "- Contactar al administrador del servidor" 