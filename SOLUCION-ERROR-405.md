# 🔧 Solución para Error 405 "Method Not Allowed"

## Problema
```
GET https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/ 405 (Method Not Allowed)
```

## Causa
El error 405 "Method Not Allowed" indica que el servidor web no está configurado correctamente para manejar las rutas de Laravel. Esto sucede cuando:

1. **mod_rewrite no está habilitado** en el servidor Apache
2. **AllowOverride no está configurado** como `All` en el servidor
3. **Faltan archivos de redirección** en el directorio raíz
4. **El servidor web no está configurado** para usar el directorio `public` como document root

## Solución Implementada

### 1. Archivos Creados

#### `.htaccess` en el directorio raíz
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirect all requests to the public directory
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>

# If mod_rewrite is not available, try to redirect using PHP
<IfModule !mod_rewrite.c>
    <Files "index.php">
        SetHandler application/x-httpd-php
    </Files>
    
    # Redirect all requests to public/index.php
    RewriteEngine Off
    DirectoryIndex public/index.php
</IfModule>
```

#### `index.php` en el directorio raíz
```php
<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

// Redirect to public directory
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without having installed a "real" web server software here.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';
```

### 2. Archivos de Diagnóstico

#### `public/server-info.php`
Archivo de diagnóstico que muestra:
- Información del servidor web
- Versión de PHP
- Módulos de Apache habilitados
- Estado de archivos importantes
- Permisos de directorios
- Variables de entorno

#### `public/test.html`
Archivo de prueba simple para verificar que el servidor web funciona.

## Pasos para Aplicar la Solución

### 1. Ejecutar el Script de Despliegue
```bash
./deploy-production.sh
```

### 2. Subir Archivos al Servidor
Asegurar que estos archivos estén en el servidor:
- `.htaccess` (en el directorio raíz)
- `index.php` (en el directorio raíz)
- `public/server-info.php`
- `public/test.html`

### 3. Verificar en el Servidor
```bash
# Navegar al directorio del proyecto
cd /inf513/grupo21sc/Drinks-Ecommerce

# Verificar que los archivos existen
ls -la .htaccess index.php
ls -la public/server-info.php public/test.html

# Configurar permisos
chmod 644 .htaccess index.php
chmod 644 public/server-info.php public/test.html
```

### 4. Probar URLs
1. **Archivo de prueba**: `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/test.html`
2. **Archivo de diagnóstico**: `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/server-info.php`
3. **Aplicación principal**: `https://www.tecnoweb.org.bo/inf513/grupo21sc/Drinks-Ecommerce/public/`

## Troubleshooting

### Si el error 405 persiste:

#### 1. Verificar mod_rewrite
Acceder a `server-info.php` y verificar si `mod_rewrite` está habilitado.

#### 2. Verificar AllowOverride
El servidor debe tener configurado:
```apache
<Directory /path/to/your/project>
    AllowOverride All
</Directory>
```

#### 3. Verificar Document Root
El servidor web debe estar configurado para usar el directorio raíz del proyecto como document root, no el directorio `public`.

#### 4. Contactar al Administrador del Servidor
Si los pasos anteriores no funcionan, contactar al administrador del servidor para:
- Habilitar `mod_rewrite`
- Configurar `AllowOverride All`
- Verificar la configuración del virtual host

## Estructura Final del Proyecto

```
/inf513/grupo21sc/Drinks-Ecommerce/
├── .htaccess                 # ✅ Redirige a public/
├── index.php                 # ✅ Redirige a public/index.php
├── public/
│   ├── .htaccess            # ✅ Configuración de Laravel
│   ├── index.php            # ✅ Punto de entrada
│   ├── server-info.php      # ✅ Archivo de diagnóstico
│   ├── test.html            # ✅ Archivo de prueba
│   └── ... (resto de archivos)
└── ... (resto del proyecto)
```

## Verificación de Éxito

✅ **Error 405 solucionado** cuando:
- `test.html` se muestra correctamente
- `server-info.php` muestra información del servidor
- La aplicación principal carga sin errores 405
- Las rutas de Laravel funcionan correctamente

## Notas Importantes

1. **mod_rewrite es esencial** para que Laravel funcione correctamente
2. **AllowOverride All** debe estar configurado en el servidor
3. **Los archivos .htaccess** deben tener permisos de lectura
4. **El document root** debe apuntar al directorio raíz del proyecto, no a `public/`

## Comandos Útiles

```bash
# Verificar si mod_rewrite está habilitado
apache2ctl -M | grep rewrite

# Verificar configuración de Apache
apache2ctl -S

# Ver logs de Apache
tail -f /var/log/apache2/error.log
``` 