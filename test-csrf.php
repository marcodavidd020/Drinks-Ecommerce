<?php
// Script de prueba para verificar CSRF token
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Prueba de CSRF Token ===\n";
echo "CSRF Token generado: " . csrf_token() . "\n";
echo "Longitud del token: " . strlen(csrf_token()) . "\n";
echo "Session ID: " . session()->getId() . "\n";
echo "Session Driver: " . config('session.driver') . "\n";
echo "Session Path: " . config('session.path') . "\n";
echo "Session Domain: " . config('session.domain') . "\n";
echo "APP URL: " . config('app.url') . "\n";
echo "===========================\n";
