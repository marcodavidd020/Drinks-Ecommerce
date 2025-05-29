<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Ppersona;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PqrsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Cliente::with('user')->get();
        $administrativo = User::where('email', 'admin@example.com')->first();

        if ($clientes->isEmpty()) {
            $this->command->warn('No hay clientes disponibles. Ejecuta primero ClienteSeeder.');
            return;
        }

        $tipos = ['peticion', 'queja', 'reclamo', 'sugerencia'];
        $estados = ['pendiente', 'en_proceso', 'resuelto', 'cerrado'];
        
        $asuntos = [
            'peticion' => [
                'Solicitud de información sobre productos',
                'Petición de nuevos productos en catálogo',
                'Solicitud de mejores precios mayoristas',
                'Petición de horarios extendidos',
                'Solicitud de entrega a domicilio',
            ],
            'queja' => [
                'Demora en la entrega del pedido',
                'Producto en mal estado',
                'Atención al cliente deficiente',
                'Precios elevados comparado con competencia',
                'Problemas con el sistema de pagos',
            ],
            'reclamo' => [
                'Producto no conforme a la descripción',
                'Facturación incorrecta',
                'Producto vencido en entrega',
                'Daños en el envío',
                'Falta de productos en el pedido',
            ],
            'sugerencia' => [
                'Implementar programa de fidelización',
                'Mejorar el empaque de productos',
                'Ampliar variedad de bebidas naturales',
                'Crear app móvil para pedidos',
                'Implementar pagos con criptomonedas',
            ]
        ];

        // Crear PQRS de los últimos 3 meses
        for ($mes = 2; $mes >= 0; $mes--) {
            $fecha = Carbon::now()->subMonths($mes);
            $pqrsEnMes = rand(5, 15); // Entre 5 y 15 PQRS por mes

            for ($i = 0; $i < $pqrsEnMes; $i++) {
                $fechaPqrs = $fecha->copy()->addDays(rand(0, 28));
                $cliente = $clientes->random();
                $tipo = $tipos[array_rand($tipos)];
                $asunto = $asuntos[$tipo][array_rand($asuntos[$tipo])];
                
                // Crear la PQRS usando la estructura real de la tabla
                Ppersona::create([
                    'nombre' => $cliente->user->nombre,
                    'apellido' => 'Apellido' . rand(1, 100), // Generar apellido aleatorio
                    'telefono' => $cliente->telefono ?? '300' . rand(1000000, 9999999),
                    'direccion' => $cliente->direccion ?? 'Dirección ' . rand(1, 100),
                    'email' => $cliente->user->email,
                    'tipo' => $tipo,
                    'descripcion' => $this->generateDescripcion($tipo, $asunto),
                    'estado' => $this->getRandomEstado($fechaPqrs),
                    'fecha_creacion' => $fechaPqrs,
                    'fecha_respuesta' => $this->calculateFechaRespuesta($fechaPqrs),
                    'respuesta' => $this->generateRespuesta($tipo),
                    'created_at' => $fechaPqrs,
                    'updated_at' => $fechaPqrs,
                ]);
            }
        }

        $this->command->info('✅ PQRS creadas: ' . Ppersona::count() . ' registros');
    }

    private function generateDescripcion(string $tipo, string $asunto): string
    {
        $descripciones = [
            'peticion' => [
                'Estimados señores, me dirijo a ustedes para solicitar información detallada sobre los productos disponibles en su catálogo.',
                'Buen día, como cliente frecuente me gustaría solicitar que consideren incluir nuevos productos en su portafolio.',
                'Cordial saludo, escribo para solicitar información sobre descuentos especiales para compras al por mayor.',
            ],
            'queja' => [
                'Manifiesto mi inconformidad con el servicio recibido. El pedido llegó con considerable retraso sin previo aviso.',
                'Presento queja formal por la calidad del producto recibido, el cual no cumple con los estándares esperados.',
                'Expreso mi malestar por la atención recibida por parte del personal de servicio al cliente.',
            ],
            'reclamo' => [
                'Reclamo formalmente por la inconsistencia entre el producto solicitado y el producto entregado.',
                'Presento reclamo por error en la facturación de mi último pedido. Los valores no corresponden a lo acordado.',
                'Reclamo por el estado del producto recibido, el cual presenta signos evidentes de deterioro.',
            ],
            'sugerencia' => [
                'Sugiero implementar un programa de puntos para clientes frecuentes que permita obtener descuentos.',
                'Propongo mejorar el sistema de empaque para garantizar mejor conservación de los productos.',
                'Recomiendo ampliar la variedad de productos naturales disponibles en el catálogo.',
            ]
        ];

        $base = $descripciones[$tipo][array_rand($descripciones[$tipo])];
        return $base . ' Referente a: ' . $asunto . '. Agradezco su pronta respuesta y gestión.';
    }

    private function getRandomEstado(Carbon $fechaCreacion): string
    {
        $diasTranscurridos = Carbon::now()->diffInDays($fechaCreacion);
        
        if ($diasTranscurridos > 30) {
            // PQRS antiguas: mayoría resueltas o cerradas
            return ['resuelto', 'cerrado'][array_rand(['resuelto', 'cerrado'])];
        } elseif ($diasTranscurridos > 7) {
            // PQRS de hace una semana: algunas en revisión, algunas resueltas
            return ['en_proceso', 'resuelto'][array_rand(['en_proceso', 'resuelto'])];
        } else {
            // PQRS recientes: mayoría pendientes o en revisión
            return ['pendiente', 'en_proceso'][array_rand(['pendiente', 'en_proceso'])];
        }
    }

    private function calculateFechaRespuesta(Carbon $fechaCreacion): ?Carbon
    {
        // Solo algunas PQRS tienen respuesta
        if (rand(1, 100) <= 60) { // 60% tienen respuesta
            return $fechaCreacion->copy()->addDays(rand(1, 15));
        }
        return null;
    }

    private function generateRespuesta(string $tipo): ?string
    {
        // Solo algunas PQRS tienen respuesta
        if (rand(1, 100) <= 60) { // 60% tienen respuesta
            $respuestas = [
                'peticion' => 'Estimado cliente, hemos recibido su petición y la estamos evaluando. Le responderemos en breve.',
                'queja' => 'Lamentamos los inconvenientes presentados. Hemos tomado las medidas correctivas necesarias.',
                'reclamo' => 'Su reclamo ha sido procesado y se ha iniciado el procedimiento de solución correspondiente.',
                'sugerencia' => 'Agradecemos su sugerencia, la cual será evaluada por nuestro equipo de mejora continua.',
            ];
            
            return $respuestas[$tipo] ?? 'Gracias por contactarnos. Su solicitud ha sido procesada.';
        }
        return null;
    }
} 