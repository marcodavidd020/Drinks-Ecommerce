<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Carrito;
use App\Models\Cliente;
use App\Models\Producto;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CarritoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Cliente::all();
        $productos = Producto::all();

        if ($clientes->isEmpty() || $productos->isEmpty()) {
            $this->command->warn('No hay suficientes datos base. Ejecuta primero ClienteSeeder y ProductoSeeder.');
            return;
        }

        // Crear carritos abandonados de los últimos 30 días
        for ($dia = 29; $dia >= 0; $dia--) {
            $fecha = Carbon::now()->subDays($dia);
            $carritosEnDia = rand(0, 3); // Entre 0 y 3 carritos abandonados por día

            for ($i = 0; $i < $carritosEnDia; $i++) {
                $fechaCarrito = $fecha->copy();
                $cliente = $clientes->random();
                
                // Solo crear si el cliente no tiene un carrito muy reciente
                $carritoReciente = Carrito::where('cliente_id', $cliente->id)
                    ->where('created_at', '>=', $fechaCarrito->copy()->subDays(2))
                    ->exists();

                if (!$carritoReciente) {
                    // Simular total del carrito basado en productos aleatorios
                    $cantidadProductos = rand(1, 4);
                    $total = 0;
                    
                    for ($j = 0; $j < $cantidadProductos; $j++) {
                        $producto = $productos->random();
                        $cantidad = rand(1, 3);
                        $total += $cantidad * $producto->precio_venta;
                    }

                    Carrito::create([
                        'cliente_id' => $cliente->id,
                        'fecha' => $fechaCarrito,
                        'total' => $total,
                        'estado' => $this->getRandomEstadoCarrito($fechaCarrito),
                        'created_at' => $fechaCarrito,
                        'updated_at' => $fechaCarrito->copy()->addMinutes(rand(5, 120)),
                    ]);
                }
            }
        }

        $this->command->info('✅ Carritos creados: ' . Carrito::count() . ' carritos');
    }

    private function getRandomEstadoCarrito(Carbon $fechaCreacion): string
    {
        $diasTranscurridos = Carbon::now()->diffInDays($fechaCreacion);
        
        if ($diasTranscurridos > 7) {
            // Carritos antiguos: mayoría abandonados
            return 'abandonado';
        } elseif ($diasTranscurridos > 3) {
            // Carritos de hace algunos días: algunos abandonados, algunos procesados
            return ['abandonado', 'procesado'][array_rand(['abandonado', 'procesado'])];
        } else {
            // Carritos recientes: mayoría activos
            $estados = ['activo', 'activo', 'abandonado']; // 66% activos, 33% abandonados
            return $estados[array_rand($estados)];
        }
    }
} 