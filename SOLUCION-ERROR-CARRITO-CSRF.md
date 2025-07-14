# Solución Error CSRF en Carrito - "Unexpected token '<'"

## 🔍 Problema Identificado

El error "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" ocurre cuando:

1. **El servidor devuelve una página HTML** en lugar de JSON
2. **Error 419 CSRF** redirige a página de error HTML
3. **Error 500** del servidor devuelve página de error HTML
4. **El frontend intenta parsear HTML como JSON**

## 🎯 Causa Principal

El problema está en el componente `products-featured.tsx` que no verifica el tipo de contenido de la respuesta antes de intentar parsearla como JSON.

## 🛠️ Solución Implementada

### ✅ Cambios en el Frontend

#### 1. Verificación de Content-Type
```javascript
// Verificar si la respuesta es JSON antes de intentar parsearla
const contentType = carritoResponse.headers.get('content-type');
if (!contentType || !contentType.includes('application/json')) {
    // Si no es JSON, probablemente es un error 419 o 500
    if (carritoResponse.status === 419) {
        throw new Error('Error de autenticación CSRF. Por favor, recarga la página e intenta nuevamente.');
    } else if (carritoResponse.status === 500) {
        throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
    } else {
        throw new Error(`Error del servidor (${carritoResponse.status}). Por favor, intenta nuevamente.`);
    }
}
```

#### 2. Manejo Mejorado de Errores
```javascript
// Mostrar mensaje específico según el tipo de error
let userMessage = errorMessage;
if (errorMessage.includes('CSRF')) {
    userMessage = getTextByMode({
        niños: '🔒 Error de seguridad. ¡Recarga la página e intenta de nuevo!',
        jóvenes: 'Error de seguridad. Recarga la página e intenta nuevamente.',
        adultos: 'Error de autenticación. Por favor, recarga la página e intenta nuevamente.'
    });
} else if (errorMessage.includes('500')) {
    userMessage = getTextByMode({
        niños: '😰 El servidor está ocupado. ¡Intenta en unos minutos!',
        jóvenes: 'Error del servidor. Intenta más tarde.',
        adultos: 'Error interno del servidor. Intente más tarde.'
    });
}
```

## 🔧 Script de Diagnóstico

Ejecuta el script específico para el carrito:

```bash
chmod +x fix-carrito-csrf-error.sh
./fix-carrito-csrf-error.sh
```

## 📋 Verificaciones Específicas

### ✅ Verificación de Backend
- Tabla `sessions` existe en la base de datos
- Rutas del carrito están registradas correctamente
- Controlador `CarritoController` existe con método `agregar`
- Middleware de autenticación está configurado
- Middleware CSRF está configurado correctamente

### ✅ Verificación de Frontend
- Token CSRF se envía en headers `X-CSRF-TOKEN`
- Content-Type se verifica antes de parsear JSON
- Manejo de errores específicos por tipo
- Mensajes de usuario apropiados según modo de edad

### ✅ Verificación de Configuración
- `SESSION_PATH` incluye el path completo del subdirectorio
- `SESSION_DOMAIN` está configurado correctamente
- `SESSION_SECURE_COOKIE=false` (si no usas HTTPS)
- `SESSION_SAME_SITE=lax` para permitir cross-site requests

## 🚨 Problemas Comunes y Soluciones

### Problema: Error 419 CSRF
**Síntomas**: "Unexpected token '<'" con status 419
**Solución**: 
1. Verificar configuración de sesiones
2. Limpiar cache del navegador
3. Recargar la página

### Problema: Error 500 del Servidor
**Síntomas**: "Unexpected token '<'" con status 500
**Solución**:
1. Revisar logs de Laravel
2. Verificar configuración de base de datos
3. Limpiar cache de Laravel

### Problema: Token CSRF no encontrado
**Síntomas**: "Token de seguridad no encontrado"
**Solución**:
1. Verificar que Inertia comparta el token CSRF
2. Verificar que el meta tag esté presente en el HTML
3. Recargar la página

## 🧪 Pruebas de Verificación

### Prueba 1: Script de Backend
```bash
php test-carrito.php
```

### Prueba 2: Verificación Manual
1. Abrir DevTools del navegador
2. Ir a la pestaña Network
3. Intentar agregar producto al carrito
4. Verificar que la petición tenga:
   - Header `X-CSRF-TOKEN`
   - Content-Type `application/json`
   - Status 200 (no 419 o 500)

### Prueba 3: Verificación de Cookies
1. Abrir DevTools del navegador
2. Ir a la pestaña Application > Cookies
3. Verificar que existan:
   - `laravel_session`
   - `XSRF-TOKEN`

## 📝 Logs de Debug

### Verificar Logs de Laravel
```bash
tail -f storage/logs/laravel.log
```

### Buscar Errores Específicos
```bash
grep -i "carrito\|csrf\|419\|token" storage/logs/laravel.log
```

## ✅ Checklist de Verificación Final

- [ ] Tabla de sesiones existe en la base de datos
- [ ] Configuración de sesiones correcta en `.env`
- [ ] Cache de configuración limpiado
- [ ] Token CSRF se está enviando en las peticiones
- [ ] Headers X-CSRF-TOKEN configurados correctamente
- [ ] Content-Type se verifica antes de parsear JSON
- [ ] Manejo de errores específicos implementado
- [ ] Rutas del carrito funcionan correctamente
- [ ] Controlador del carrito responde con JSON
- [ ] No hay errores en los logs de Laravel

## 🔄 Proceso de Recuperación

Si el problema persiste después de aplicar la solución:

1. **Revisar logs**: `storage/logs/laravel.log`
2. **Verificar configuración**: Ejecutar `php test-carrito.php`
3. **Limpiar cache del navegador**: Borrar cookies y cache
4. **Reiniciar servidor**: Reiniciar Apache/Nginx
5. **Verificar configuración**: Revisar archivo `.env`

## 📞 Soporte Adicional

Si el problema persiste, proporcionar:
- Resultados del script `fix-carrito-csrf-error.sh`
- Resultados de `php test-carrito.php`
- Captura de pantalla de DevTools Network
- Logs de `storage/logs/laravel.log`
- Configuración actual del archivo `.env` 