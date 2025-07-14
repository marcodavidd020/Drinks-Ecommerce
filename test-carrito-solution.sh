#!/bin/bash

echo "🧪 Probando Solución del Carrito"
echo "================================="

# Verificar que el servidor esté corriendo
echo "📋 Paso 1: Verificar servidor..."
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Servidor corriendo en localhost:8000"
else
    echo "❌ Servidor no está corriendo. Ejecuta: php artisan serve"
    exit 1
fi

# Verificar que hay usuarios en la base de datos
echo "📋 Paso 2: Verificar usuarios..."
USERS_COUNT=$(php artisan tinker --execute="echo App\Models\User::count();" 2>/dev/null)
if [ "$USERS_COUNT" -gt 0 ]; then
    echo "✅ Hay $USERS_COUNT usuarios en la base de datos"
else
    echo "❌ No hay usuarios en la base de datos"
    exit 1
fi

# Verificar que hay usuarios con rol cliente
echo "📋 Paso 3: Verificar usuarios cliente..."
CLIENTES_COUNT=$(php artisan tinker --execute="echo App\Models\User::role('cliente')->count();" 2>/dev/null)
if [ "$CLIENTES_COUNT" -gt 0 ]; then
    echo "✅ Hay $CLIENTES_COUNT usuarios con rol cliente"
else
    echo "❌ No hay usuarios con rol cliente"
    exit 1
fi

# Verificar que hay productos en la base de datos
echo "📋 Paso 4: Verificar productos..."
PRODUCTOS_COUNT=$(php artisan tinker --execute="echo App\Models\Producto::count();" 2>/dev/null)
if [ "$PRODUCTOS_COUNT" -gt 0 ]; then
    echo "✅ Hay $PRODUCTOS_COUNT productos en la base de datos"
else
    echo "❌ No hay productos en la base de datos"
    exit 1
fi

# Verificar rutas del carrito
echo "📋 Paso 5: Verificar rutas del carrito..."
if php artisan route:list --name=carrito.agregar | grep -q "carrito/agregar"; then
    echo "✅ Ruta carrito/agregar está registrada"
else
    echo "❌ Ruta carrito/agregar no está registrada"
    exit 1
fi

# Verificar configuración de sesiones
echo "📋 Paso 6: Verificar configuración de sesiones..."
SESSION_DRIVER=$(php artisan tinker --execute="echo config('session.driver');" 2>/dev/null)
if [ "$SESSION_DRIVER" = "database" ]; then
    echo "✅ Session driver: database"
    
    # Verificar tabla de sesiones
    if php artisan tinker --execute="echo Schema::hasTable('sessions') ? 'true' : 'false';" 2>/dev/null | grep -q "true"; then
        echo "✅ Tabla de sesiones existe"
    else
        echo "❌ Tabla de sesiones no existe"
        echo "💡 Ejecuta: php artisan session:table && php artisan migrate"
    fi
else
    echo "⚠️ Session driver: $SESSION_DRIVER (debería ser 'database')"
fi

echo ""
echo "🎯 Resumen de la Solución:"
echo "=========================="
echo "✅ El problema era que products-featured.tsx usaba fetch manual"
echo "✅ La solución es usar el método post() de Inertia"
echo "✅ Inertia maneja automáticamente los tokens CSRF"
echo "✅ ProductDetail.tsx ya funcionaba porque usa post() de Inertia"
echo ""
echo "🔧 Para probar la solución:"
echo "1. Haz login con un usuario cliente"
echo "2. Ve a http://localhost:8000/"
echo "3. Intenta agregar productos al carrito"
echo "4. Debería funcionar sin errores 419 CSRF"
echo ""
echo "📝 Si aún hay problemas:"
echo "- Verifica que estés logueado"
echo "- Verifica que el usuario tenga rol 'cliente'"
echo "- Limpia el cache: php artisan optimize:clear"
echo "- Rebuild frontend: npm run build" 