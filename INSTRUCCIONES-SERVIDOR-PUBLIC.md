# 🖥️ Instrucciones para Servidor con Document Root Public

## Configuración del Servidor

### Document Root
El servidor debe estar configurado con:
```
Document Root: /inf513/grupo21sc/Drinks-Ecommerce/public/
```

### Configuración de Apache
El archivo de configuración del virtual host debe tener:
```apache
<VirtualHost *:80>
    ServerName www.tecnoweb.org.bo
    DocumentRoot /inf513/grupo21sc/Drinks-Ecommerce/public
    
    <Directory /inf513/grupo21sc/Drinks-Ecommerce/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Redirigir a HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName www.tecnoweb.org.bo
    DocumentRoot /inf513/grupo21sc/Drinks-Ecommerce/public
    
    <Directory /inf513/grupo21sc/Drinks-Ecommerce/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Configuración SSL
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
</VirtualHost>
```

## Estructura de Archivos

```
/inf513/grupo21sc/Drinks-Ecommerce/
├── public/                    # ← Document Root del servidor
│   ├── .htaccess             # Configuración de Laravel
│   ├── index.php             # Punto de entrada
│   ├── server-info.php       # Archivo de diagnóstico
│   ├── test.html             # Archivo de prueba
│   ├── images/
│   │   └── no-image.jpg      # Imagen placeholder
│   └── build/                # Assets compilados
├── app/                      # Código de la aplicación
├── bootstrap/                # Archivos de bootstrap
├── config/                   # Configuraciones
├── database/                 # Migraciones y seeders
├── resources/                # Recursos del frontend
├── routes/                   # Definición de rutas
├── storage/                  # Archivos de sesión y logs
├── vendor/                   # Dependencias de Composer
└── .env                      # Variables de entorno
```

## Variables de Entorno (.env)

```env
APP_NAME="Arturo - Tienda de Bebidas"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public

# Frontend
VITE_APP_URL=https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public

# Base de datos
DB_CONNECTION=pgsql
DB_HOST=mail.tecnoweb.org.bo
DB_PORT=5432
DB_DATABASE=db_grupo21sc
DB_USERNAME=grupo21sc
DB_PASSWORD=grup021grup021*

# Sesión
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_PATH=/inf513/grupo21sc/Drinks-Ecommerce/public
SESSION_DOMAIN=tecnoweb.org.bo
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

## Comandos de Despliegue

### 1. En el servidor local (antes de subir)
```bash
# Ejecutar script de preparación
./fix-public-document-root.sh

# Construir assets
npm run build

# Limpiar caché
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. En el servidor de producción
```bash
# Navegar al directorio del proyecto
cd /inf513/grupo21sc/Drinks-Ecommerce

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Configurar permisos
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 644 public/.htaccess
chmod 644 public/index.php

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

## URLs de Verificación

### 1. Archivo de prueba
```
https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/test.html
```
**Resultado esperado**: Página HTML simple que dice "Laravel está funcionando correctamente"

### 2. Archivo de diagnóstico
```
https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/server-info.php
```
**Resultado esperado**: Página con información del servidor, PHP, módulos de Apache, etc.

### 3. Aplicación principal
```
https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/
```
**Resultado esperado**: Página principal de la aplicación Laravel

### 4. Imagen placeholder
```
https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/images/no-image.jpg
```
**Resultado esperado**: Imagen placeholder (1x1 pixel transparente)

## Troubleshooting

### Error 405 "Method Not Allowed"
**Causa**: Document root no configurado correctamente
**Solución**:
1. Verificar que el document root apunte a `/inf513/grupo21sc/Drinks-Ecommerce/public/`
2. Verificar que `mod_rewrite` esté habilitado
3. Verificar que `AllowOverride All` esté configurado

### Error 404 en archivos
**Causa**: Rutas no configuradas correctamente
**Solución**:
1. Verificar que `public/.htaccess` existe y tiene permisos correctos
2. Verificar que `public/index.php` existe y tiene permisos correctos
3. Verificar configuración de Apache

### Error 419 "Page Expired"
**Causa**: Problemas de sesión
**Solución**:
1. Verificar `SESSION_PATH` en `.env`
2. Verificar `SESSION_DOMAIN` en `.env`
3. Limpiar caché: `php artisan optimize:clear`

### Error 500 "Internal Server Error"
**Causa**: Problemas de permisos o configuración
**Solución**:
1. Verificar logs: `tail -f storage/logs/laravel.log`
2. Verificar permisos de directorios `storage` y `bootstrap/cache`
3. Verificar que todas las dependencias estén instaladas

## Comandos de Verificación

```bash
# Verificar configuración de Apache
apache2ctl -S

# Verificar módulos habilitados
apache2ctl -M | grep rewrite

# Verificar logs de Apache
tail -f /var/log/apache2/error.log

# Verificar logs de Laravel
tail -f storage/logs/laravel.log

# Verificar rutas de Laravel
php artisan route:list

# Verificar configuración
php artisan config:show
```

## Notas Importantes

1. **Document Root**: Debe ser `/inf513/grupo21sc/Drinks-Ecommerce/public/`
2. **URLs**: Todas las URLs deben incluir `/public/` al final
3. **Permisos**: Los directorios `storage` y `bootstrap/cache` deben ser escribibles
4. **mod_rewrite**: Debe estar habilitado en Apache
5. **AllowOverride**: Debe estar configurado como `All`

## Contacto con Administrador del Servidor

Si los problemas persisten, contactar al administrador del servidor para:

1. **Configurar document root** correctamente
2. **Habilitar mod_rewrite** si no está habilitado
3. **Configurar AllowOverride All** en el directorio
4. **Verificar configuración SSL** si es necesario
5. **Revisar logs del servidor** para errores específicos 