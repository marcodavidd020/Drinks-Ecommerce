<?php
// Script de prueba para verificar carrito
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Prueba de Carrito ===\n";
echo "CSRF Token generado: " . csrf_token() . "\n";
echo "Session ID: " . session()->getId() . "\n";
echo "Session Driver: " . config('session.driver') . "\n";
echo "Session Path: " . config('session.path') . "\n";
echo "Session Domain: " . config('session.domain') . "\n";
echo "APP URL: " . config('app.url') . "\n";

// Verificar si existe un usuario autenticado
if (auth()->check()) {
    echo "Usuario autenticado: " . auth()->user()->email . "\n";
    echo "Roles del usuario: " . auth()->user()->roles->pluck('name')->implode(', ') . "\n";
} else {
    echo "No hay usuario autenticado\n";
}

// Verificar rutas del carrito
$router = app('router');
$carritoRoutes = collect($router->getRoutes())->filter(function ($route) {
    return str_contains($route->uri(), 'carrito');
});

echo "Rutas del carrito encontradas:\n";
foreach ($carritoRoutes as $route) {
    echo "- " . $route->methods()[0] . " " . $route->uri() . "\n";
}

echo "===========================\n";
