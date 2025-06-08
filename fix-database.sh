#!/bin/bash

# Script para solucionar problemas de base de datos en Laravel
# Autor: AI Assistant
# Descripción: Ejecuta migraciones, seeders y limpia cache

echo "🚀 Iniciando solución de problemas de base de datos..."
echo "================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes de éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar mensajes de información
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para mostrar mensajes de advertencia
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar mensajes de error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en un proyecto Laravel
if [ ! -f "artisan" ]; then
    error "No se encontró el archivo artisan. Asegúrate de estar en la raíz del proyecto Laravel."
    exit 1
fi

info "Verificando conexión a la base de datos..."

# Verificar conexión a la base de datos
if php artisan db:show > /dev/null 2>&1; then
    success "Conexión a la base de datos exitosa"
else
    error "No se puede conectar a la base de datos. Verifica tu configuración en .env"
    exit 1
fi

# Paso 1: Limpiar cache antes de empezar
info "Limpiando cache de Laravel..."
php artisan optimize:clear
success "Cache limpiado"

# Paso 2: Ejecutar migraciones
info "Ejecutando migraciones de base de datos..."
if php artisan migrate --force; then
    success "Migraciones ejecutadas correctamente"
else
    error "Error al ejecutar migraciones"
    exit 1
fi

# Paso 3: Verificar que las migraciones se ejecutaron
info "Verificando estado de las migraciones..."
php artisan migrate:status

# Paso 4: Ejecutar seeders (opcional, comentado por defecto)
# info "Ejecutando seeders..."
# php artisan db:seed --force
# success "Seeders ejecutados correctamente"

# Paso 5: Limpiar cache después de las migraciones
info "Limpiando cache después de las migraciones..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
success "Cache limpiado completamente"

# Paso 6: Verificar tablas importantes
info "Verificando tablas críticas..."

# Verificar tabla de sesiones
if php artisan tinker --execute="echo \Schema::hasTable('sessions') ? 'sessions: OK' : 'sessions: MISSING';" 2>/dev/null | grep -q "sessions: OK"; then
    success "Tabla 'sessions' creada correctamente"
else
    warning "Tabla 'sessions' no encontrada - puede necesitar configuración adicional"
fi

# Verificar tabla de usuarios
if php artisan tinker --execute="echo \Schema::hasTable('users') ? 'users: OK' : 'users: MISSING';" 2>/dev/null | grep -q "users: OK"; then
    success "Tabla 'users' creada correctamente"
else
    warning "Tabla 'users' no encontrada"
fi

# Paso 7: Mostrar información de la base de datos
info "Información de la base de datos:"
php artisan db:show

echo ""
echo "================================================="
success "¡Proceso completado! Tu base de datos debería estar lista."
echo ""
info "Próximos pasos sugeridos:"
echo "  1. Verifica que tu aplicación funcione correctamente"
echo "  2. Si necesitas datos de prueba, ejecuta: php artisan db:seed"
echo "  3. Si el problema persiste, verifica tu archivo .env"
echo ""
info "Para ejecutar seeders manualmente:"
echo "  php artisan db:seed --class=NombreDelSeeder"
echo "" 