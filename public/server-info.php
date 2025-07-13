<?php
/**
 * Archivo de diagnóstico del servidor web
 * Este archivo ayuda a identificar problemas de configuración
 */

echo "<h1>🔧 Diagnóstico del Servidor Web</h1>";

// Información básica del servidor
echo "<h2>📋 Información del Servidor</h2>";
echo "<ul>";
echo "<li><strong>Servidor:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</li>";
echo "<li><strong>PHP Version:</strong> " . phpversion() . "</li>";
echo "<li><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</li>";
echo "<li><strong>Script Filename:</strong> " . $_SERVER['SCRIPT_FILENAME'] . "</li>";
echo "<li><strong>Request URI:</strong> " . $_SERVER['REQUEST_URI'] . "</li>";
echo "<li><strong>Request Method:</strong> " . $_SERVER['REQUEST_METHOD'] . "</li>";
echo "</ul>";

// Verificar módulos de Apache
echo "<h2>🔌 Módulos de Apache</h2>";
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    echo "<ul>";
    echo "<li><strong>mod_rewrite:</strong> " . (in_array('mod_rewrite', $modules) ? "✅ Habilitado" : "❌ Deshabilitado") . "</li>";
    echo "<li><strong>mod_headers:</strong> " . (in_array('mod_headers', $modules) ? "✅ Habilitado" : "❌ Deshabilitado") . "</li>";
    echo "</ul>";
} else {
    echo "<p>⚠️ No se puede verificar módulos de Apache (función no disponible)</p>";
}

// Verificar archivos importantes
echo "<h2>📁 Archivos Importantes</h2>";
$files = [
    '../.htaccess' => 'Archivo .htaccess en raíz',
    '.htaccess' => 'Archivo .htaccess en public',
    'index.php' => 'Archivo index.php en public',
    '../index.php' => 'Archivo index.php en raíz',
    '../vendor/autoload.php' => 'Autoloader de Composer',
    '../bootstrap/app.php' => 'Bootstrap de Laravel'
];

echo "<ul>";
foreach ($files as $file => $description) {
    $exists = file_exists($file);
    $readable = is_readable($file);
    echo "<li><strong>$description:</strong> ";
    echo $exists ? "✅ Existe" : "❌ No existe";
    echo $readable ? " y ✅ Legible" : " pero ❌ No legible";
    echo "</li>";
}
echo "</ul>";

// Verificar permisos
echo "<h2>🔐 Permisos de Archivos</h2>";
$files_to_check = [
    '../storage' => 'Directorio storage',
    '../bootstrap/cache' => 'Directorio bootstrap/cache',
    '../public' => 'Directorio public'
];

echo "<ul>";
foreach ($files_to_check as $path => $description) {
    if (file_exists($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        $writable = is_writable($path);
        echo "<li><strong>$description:</strong> Permisos: $perms, ";
        echo $writable ? "✅ Escribible" : "❌ No escribible";
        echo "</li>";
    } else {
        echo "<li><strong>$description:</strong> ❌ No existe</li>";
    }
}
echo "</ul>";

// Verificar variables de entorno
echo "<h2>⚙️ Variables de Entorno</h2>";
$env_vars = [
    'APP_ENV' => 'Entorno de la aplicación',
    'APP_DEBUG' => 'Modo debug',
    'APP_URL' => 'URL de la aplicación',
    'DB_CONNECTION' => 'Conexión de base de datos'
];

echo "<ul>";
foreach ($env_vars as $var => $description) {
    $value = getenv($var) ?: 'No definida';
    echo "<li><strong>$description ($var):</strong> $value</li>";
}
echo "</ul>";

// Verificar configuración de PHP
echo "<h2>🐘 Configuración de PHP</h2>";
$php_settings = [
    'display_errors' => 'Mostrar errores',
    'log_errors' => 'Registrar errores',
    'error_reporting' => 'Nivel de reporte de errores',
    'max_execution_time' => 'Tiempo máximo de ejecución',
    'memory_limit' => 'Límite de memoria'
];

echo "<ul>";
foreach ($php_settings as $setting => $description) {
    $value = ini_get($setting);
    echo "<li><strong>$description:</strong> $value</li>";
}
echo "</ul>";

// Información adicional
echo "<h2>📊 Información Adicional</h2>";
echo "<ul>";
echo "<li><strong>Usuario del servidor:</strong> " . (function_exists('posix_getpwuid') ? posix_getpwuid(posix_geteuid())['name'] : 'No disponible') . "</li>";
echo "<li><strong>Directorio actual:</strong> " . getcwd() . "</li>";
echo "<li><strong>Archivo actual:</strong> " . __FILE__ . "</li>";
echo "</ul>";

echo "<hr>";
echo "<p><strong>Fecha y hora:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "<p><em>Si ves esta página, el servidor web está funcionando correctamente.</em></p>";
?> 