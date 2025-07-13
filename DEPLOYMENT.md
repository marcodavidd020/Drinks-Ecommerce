# 🚀 Guía de Despliegue en Producción

## Problemas Solucionados

### 1. Error 404 en `no-image.jpg`
- **Problema**: La imagen `no-image.jpg` no se encontraba en producción
- **Solución**: 
  - Corregida la ruta para usar `VITE_APP_URL` en el frontend
  - Agregado fallback con imagen de Unsplash
  - Creado script para verificar la existencia de la imagen

### 2. Error 419 en `/checkout/generar-qr`
- **Problema**: Error de CSRF token en el endpoint de generación de QR
- **Solución**:
  - Modificado el frontend para usar `fetch` con headers CSRF correctos
  - Actualizado el controlador para devolver respuestas JSON
  - Configurado el manejo de respuestas en el iframe

## Configuración para Producción

### Variables de Entorno Requeridas

```env
# Configuración básica
APP_NAME="Arturo - Tienda de Bebidas"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public

# Frontend
VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public

# Sesión para subdirectorio
SESSION_DRIVER=database
SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public
SESSION_DOMAIN=tecnoweb.org.bo
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

## Pasos de Despliegue

### 1. Preparación Local

```bash
# Ejecutar el script de despliegue
./deploy-production.sh
```

### 2. Subir Archivos al Servidor

Subir todos los archivos del proyecto a:
```
/inf513/grupo21sc/Drinks-Ecommerce/
```

### 3. Configuración en el Servidor

```bash
# Navegar al directorio del proyecto
cd /inf513/grupo21sc/Drinks-Ecommerce

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Configurar permisos
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Limpiar y optimizar
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders (opcional)
php artisan db:seed
```

### 4. Verificación

Verificar que las siguientes URLs funcionen:
- ✅ `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public`
- ✅ `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/images/no-image.jpg`
- ✅ `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/checkout/generar-qr`

## Estructura de Archivos Importante

```
/inf513/grupo21sc/Drinks-Ecommerce/
├── public/                    # Document root del servidor web
│   ├── index.php             # Punto de entrada
│   ├── images/
│   │   └── no-image.jpg      # Imagen placeholder
│   └── build/                # Assets compilados
├── storage/                  # Archivos de sesión y logs
├── bootstrap/cache/          # Caché de Laravel
└── .env                      # Variables de entorno
```

## Troubleshooting

### Error 419 (Page Expired)
- Verificar que `SESSION_PATH` esté configurado correctamente
- Limpiar caché: `php artisan optimize:clear`
- Verificar que el meta tag CSRF esté presente en `resources/views/app.blade.php`

### Error 404 en imágenes
- Verificar que `VITE_APP_URL` esté configurado
- Asegurar que `public/images/no-image.jpg` existe
- Verificar permisos de archivos

### Error en generación de QR
- Verificar logs: `tail -f storage/logs/laravel.log`
- Comprobar que el servicio QR esté disponible
- Verificar configuración de base de datos

## Comandos Útiles

```bash
# Verificar rutas
php artisan route:list --name=checkout

# Ver logs
tail -f storage/logs/laravel.log

# Limpiar caché
php artisan optimize:clear

# Verificar configuración
php artisan config:show

# Verificar estado de la aplicación
php artisan about
```

## Notas Importantes

1. **Subdirectorio**: La aplicación está configurada para funcionar en un subdirectorio
2. **HTTPS**: Todas las URLs usan HTTPS para producción
3. **Sesiones**: Configuradas para funcionar con el subdirectorio
4. **CSRF**: Automáticamente manejado por Laravel/Inertia
5. **Assets**: Compilados con Vite y optimizados para producción

## Soporte

Si encuentras problemas:
1. Revisar los logs en `storage/logs/laravel.log`
2. Verificar la configuración de variables de entorno
3. Comprobar permisos de archivos y directorios
4. Verificar que todas las dependencias estén instaladas 