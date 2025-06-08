#!/bin/bash

# Script rápido para solucionar problemas de base de datos
# Uso: ./scripts/quick-fix-db.sh

echo "🔧 Solución rápida de base de datos Laravel"
echo "=========================================="

# Ir al directorio raíz del proyecto
cd "$(dirname "$0")/.."

# Verificar que estamos en un proyecto Laravel
if [ ! -f "artisan" ]; then
    echo "❌ Error: No se encontró artisan. Ejecuta desde la raíz del proyecto."
    exit 1
fi

echo "🧹 Limpiando cache..."
php artisan optimize:clear

echo "🗄️ Ejecutando migraciones..."
php artisan migrate --force

echo "🔍 Verificando estado..."
php artisan migrate:status

echo "✅ ¡Listo! Tu base de datos debería estar funcionando." 