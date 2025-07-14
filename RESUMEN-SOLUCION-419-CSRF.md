# Resumen Solución Error 419 CSRF Token

## 🔍 Problema Identificado

El error 419 CSRF token ocurre **específicamente** en las rutas de autenticación:
- `POST /login` - Error 419
- `POST /register` - Error 419

## 🎯 Causa Principal

El problema está relacionado con la **configuración de sesiones para subdirectorio** en producción. Las cookies de sesión no se están enviando correctamente debido a:

1. **Configuración incorrecta de `SESSION_PATH`** para el subdirectorio
2. **Configuración incorrecta de `SESSION_DOMAIN`** 
3. **Tabla de sesiones no existe** en la base de datos
4. **Cache desactualizado** de configuración

## 🛠️ Solución Completa

### 📋 Archivos Creados

1. **`fix-419-csrf-production.sh`** - Script automatizado para diagnosticar y solucionar
2. **`verificar-csrf-frontend.html`** - Página de verificación del frontend
3. **`configuracion-auth-csrf.env`** - Configuración específica para auth
4. **`test-csrf.php`** - Script de prueba de CSRF token

### 🔧 Pasos de Solución

#### Paso 1: Ejecutar Script de Diagnóstico
```bash
chmod +x fix-419-csrf-production.sh
./fix-419-csrf-production.sh
```

#### Paso 2: Actualizar Configuración en `.env`
```env
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
```

#### Paso 3: Crear Tabla de Sesiones
```bash
php artisan session:table
php artisan migrate --force
```

#### Paso 4: Limpiar Cache
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear
```

#### Paso 5: Verificar Frontend
Subir el archivo `verificar-csrf-frontend.html` al servidor y acceder a él para verificar:
- Token CSRF en el HTML
- Cookies de sesión
- Headers de petición

## 🔍 Verificaciones Específicas

### ✅ Verificación de Backend
- Tabla `sessions` existe en la base de datos
- Middleware `VerifyCsrfToken` configurado correctamente
- Middleware `HandleInertiaRequests` comparte el token CSRF
- Archivo `.htaccess` tiene configuración para `X-XSRF-Token`

### ✅ Verificación de Frontend
- Elemento `<meta name="csrf-token">` presente en el HTML
- Token CSRF se envía en headers `X-CSRF-TOKEN`
- Cookies de sesión se envían correctamente
- Inertia.js maneja automáticamente el token CSRF

### ✅ Verificación de Configuración
- `SESSION_PATH` incluye el path completo del subdirectorio
- `SESSION_DOMAIN` está configurado correctamente
- `SESSION_SECURE_COOKIE=false` (si no usas HTTPS)
- `SESSION_SAME_SITE=lax` para permitir cross-site requests

## 🚨 Problemas Comunes y Soluciones

### Problema: Cookies no se envían
**Solución**: Verificar `SESSION_PATH` y `SESSION_DOMAIN`

### Problema: Token CSRF expirado
**Solución**: Aumentar `SESSION_LIFETIME` o implementar renovación automática

### Problema: Configuración de HTTPS
**Solución**: Si no usas HTTPS, asegúrate de que `SESSION_SECURE_COOKIE=false`

### Problema: Subdirectorio no reconocido
**Solución**: Verificar que `APP_URL` y `SESSION_PATH` incluyan el path completo

## 🧪 Pruebas de Verificación

### Prueba 1: Script de Backend
```bash
php test-csrf.php
```

### Prueba 2: Página de Frontend
Acceder a `verificar-csrf-frontend.html` y ejecutar las pruebas automáticas

### Prueba 3: Login Manual
Intentar hacer login con credenciales válidas

### Prueba 4: Register Manual
Intentar registrar un nuevo usuario

## 📝 Logs de Debug

### Verificar Logs de Laravel
```bash
tail -f storage/logs/laravel.log
```

### Buscar Errores Específicos
```bash
grep -i "csrf\|419\|token" storage/logs/laravel.log
```

## ✅ Checklist de Verificación Final

- [ ] Tabla de sesiones existe en la base de datos
- [ ] Configuración de sesiones correcta en `.env`
- [ ] Cache de configuración limpiado
- [ ] Token CSRF se está enviando en las peticiones
- [ ] Headers X-CSRF-TOKEN configurados correctamente
- [ ] .htaccess tiene configuración para X-XSRF-Token
- [ ] Inertia está compartiendo el token CSRF
- [ ] No hay errores en los logs de Laravel
- [ ] Login funciona correctamente
- [ ] Register funciona correctamente

## 🔄 Proceso de Recuperación

Si el problema persiste después de aplicar la solución:

1. **Revisar logs**: `storage/logs/laravel.log`
2. **Verificar configuración**: Ejecutar `php test-csrf.php`
3. **Probar frontend**: Usar `verificar-csrf-frontend.html`
4. **Reiniciar servidor**: Reiniciar Apache/Nginx
5. **Limpiar cache del navegador**: Borrar cookies y cache

## 📞 Soporte Adicional

Si el problema persiste, proporcionar:
- Resultados del script `fix-419-csrf-production.sh`
- Resultados de `php test-csrf.php`
- Captura de pantalla de `verificar-csrf-frontend.html`
- Logs de `storage/logs/laravel.log`
- Configuración actual del archivo `.env` 