<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ConsumirServicioController extends Controller
{
    public function RecolectarDatos(Request $request)
    {
        try {
            \Log::info('Iniciando RecolectarDatos', ['request' => $request->all()]);
            
            $lcComerceID           = "d029fa3a95e174a19934857f535eb9427d967218a36ea014b70ad704bc6c8d1c";
            $lnMoneda              = 2;
            $lnTelefono            = $request->tnTelefono;
            $lcNombreUsuario       = $request->tnNombre;
            $lnCiNit               = $request->tcCiNit;
            $lcNroPago             = uniqid();
            $lnMontoClienteEmpresa = $request->tnMonto;
            $lcCorreo              = $request->tcCorreo;
            $lcUrlCallBack         = "http://localhost:8000/";
            $lcUrlReturn           = "http://localhost:8000/";
            $laPedidoDetalle       = $request->tcDetallePedido;
            $lcUrl                 = "";

            $loClient = new Client();

            if ($request->tnTipoServicio == 1) {
                $lcUrl = "http://serviciostigomoney.pagofacil.com.bo/api/servicio/generarqrv2";
            } elseif ($request->tnTipoServicio == 2) {
                $lcUrl = "http://serviciostigomoney.pagofacil.com.bo/api/servicio/realizarpagotigomoneyv2";
            }

            $laHeader = [
                'Accept' => 'application/json'
            ];

            $laBody   = [
                "tcCommerceID"          => $lcComerceID,
                "tnMoneda"              => $lnMoneda,
                "tnTelefono"            => $lnTelefono,
                'tcNombreUsuario'       => $lcNombreUsuario,
                'tnCiNit'               => $lnCiNit,
                'tcNroPago'             => $lcNroPago,
                "tnMontoClienteEmpresa" => $lnMontoClienteEmpresa,
                "tcCorreo"              => $lcCorreo,
                'tcUrlCallBack'         => $lcUrlCallBack,
                "tcUrlReturn"           => $lcUrlReturn,
                'taPedidoDetalle'       => $laPedidoDetalle
            ];

            \Log::info('Datos a enviar al servicio', ['url' => $lcUrl, 'body' => $laBody]);

            try {
                $loResponse = $loClient->post($lcUrl, [
                    'headers' => $laHeader,
                    'json' => $laBody,
                    'timeout' => 30
                ]);

                $responseBody = $loResponse->getBody()->getContents();
                \Log::info('Respuesta del servicio', ['response' => $responseBody]);
                
                $laResult = json_decode($responseBody);
                
                if (!$laResult) {
                    \Log::error('Error decodificando JSON', ['response' => $responseBody]);
                    throw new \Exception('Error en la respuesta del servicio de pagos');
                }
                
            } catch (\Exception $serviceException) {
                \Log::warning('Servicio externo no disponible, usando simulación', ['error' => $serviceException->getMessage()]);
                
                // Fallback a simulación para testing
                if ($request->tnTipoServicio == 1) {
                    return $this->generateMockQR($lnMontoClienteEmpresa);
                } else {
                    return $this->generateMockTigoMoney($lnMontoClienteEmpresa);
                }
            }

            if ($request->tnTipoServicio == 1) {
                // Verificar que existe la respuesta esperada
                if (!isset($laResult->values)) {
                    \Log::error('No se encontró values en la respuesta', ['result' => $laResult]);
                    return $this->errorResponse('Error: respuesta del servicio QR incompleta');
                }
                
                $laValuesArray = explode(";", $laResult->values);
                if (count($laValuesArray) < 2) {
                    \Log::error('Formato de values incorrecto', ['values' => $laResult->values]);
                    return $this->errorResponse('Error: formato de respuesta QR incorrecto');
                }
                
                $laValues = $laValuesArray[1];
                $qrData = json_decode($laValues);
                
                if (!$qrData || !isset($qrData->qrImage)) {
                    \Log::error('No se encontró qrImage', ['qrData' => $qrData]);
                    return $this->errorResponse('Error: no se pudo generar el código QR');
                }
                
                $laQrImage = "data:image/png;base64," . $qrData->qrImage;
                \Log::info('QR generado exitosamente');
                
                // Improved QR display with better styling
                return response("
                <!DOCTYPE html>
                <html lang=\"es\">
                <head>
                    <meta charset=\"UTF-8\">
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                    <title>Código QR de Pago</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            box-sizing: border-box;
                        }
                        
                        .qr-container {
                            background: white;
                            border-radius: 20px;
                            padding: 30px;
                            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                            text-align: center;
                            max-width: 400px;
                            width: 100%;
                            border: 3px solid #e5e7eb;
                        }
                        
                        .qr-title {
                            color: #1f2937;
                            font-size: 24px;
                            font-weight: 700;
                            margin-bottom: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        }
                        
                        .qr-subtitle {
                            color: #6b7280;
                            font-size: 14px;
                            margin-bottom: 25px;
                            line-height: 1.5;
                        }
                        
                        .qr-image-wrapper {
                            background: #f9fafb;
                            border-radius: 15px;
                            padding: 20px;
                            margin-bottom: 20px;
                            border: 2px dashed #d1d5db;
                        }
                        
                        .qr-image {
                            max-width: 100%;
                            height: auto;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        }
                        
                        .qr-info {
                            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                            color: white;
                            padding: 15px;
                            border-radius: 12px;
                            font-size: 14px;
                            font-weight: 500;
                            margin-top: 20px;
                        }
                        
                        .qr-amount {
                            background: #f0fdf4;
                            color: #166534;
                            padding: 12px;
                            border-radius: 10px;
                            font-weight: 600;
                            font-size: 18px;
                            margin-bottom: 15px;
                            border: 2px solid #bbf7d0;
                        }
                        
                        .qr-steps {
                            text-align: left;
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 12px;
                            margin-top: 20px;
                            border-left: 4px solid #3b82f6;
                        }
                        
                        .qr-steps h4 {
                            margin: 0 0 15px 0;
                            color: #1f2937;
                            font-size: 16px;
                            font-weight: 600;
                        }
                        
                        .qr-steps ol {
                            margin: 0;
                            padding-left: 20px;
                            color: #4b5563;
                            font-size: 14px;
                            line-height: 1.6;
                        }
                        
                        .qr-steps li {
                            margin-bottom: 8px;
                        }
                        
                        @media (max-width: 480px) {
                            .qr-container {
                                margin: 10px;
                                padding: 20px;
                            }
                            
                            .qr-title {
                                font-size: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class=\"qr-container\">
                        <div class=\"qr-title\">
                            <span>📱</span>
                            Código QR de Pago
                        </div>
                        
                        <div class=\"qr-subtitle\">
                            Escanea este código con tu aplicación de pagos para completar la transacción
                        </div>
                        
                        <div class=\"qr-amount\">
                            💰 Monto: Bs. " . number_format($lnMontoClienteEmpresa, 2) . "
                        </div>
                        
                        <div class=\"qr-image-wrapper\">
                            <img src=\"" . $laQrImage . "\" alt=\"Código QR de Pago\" class=\"qr-image\" />
                        </div>
                        
                        <div class=\"qr-info\">
                            ✅ QR generado exitosamente<br>
                            📱 Usa tu app de pagos favorita para escanear
                        </div>
                        
                        <div class=\"qr-steps\">
                            <h4>📋 Pasos para pagar:</h4>
                            <ol>
                                <li>Abre tu aplicación de pagos móviles</li>
                                <li>Selecciona la opción \"Escanear QR\"</li>
                                <li>Apunta la cámara hacia este código</li>
                                <li>Confirma el monto y completa el pago</li>
                                <li>Guarda el comprobante de pago</li>
                            </ol>
                        </div>
                    </div>
                </body>
                </html>", 200, ['Content-Type' => 'text/html']);
                
            } elseif ($request->tnTipoServicio == 2) {
                $csrfToken = csrf_token();

                return response("
                <!DOCTYPE html>
                <html lang=\"es\">
                <head>
                    <meta charset=\"UTF-8\">
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                    <title>Pago Tigo Money</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;
                            background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                        }
                        
                        .tigo-container {
                            background: white;
                            border-radius: 20px;
                            padding: 30px;
                            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                            text-align: center;
                            max-width: 400px;
                            width: 100%;
                            border: 3px solid #f59e0b;
                        }
                        
                        .tigo-title {
                            color: #92400e;
                            font-size: 24px;
                            font-weight: 700;
                            margin-bottom: 20px;
                        }
                        
                        .transaction-info {
                            background: #fef3c7;
                            padding: 20px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            border: 2px solid #fbbf24;
                        }
                        
                        .transaction-id {
                            font-size: 18px;
                            font-weight: 600;
                            color: #92400e;
                            margin-bottom: 10px;
                        }
                        
                        .status-container {
                            margin-top: 20px;
                            padding: 15px;
                            background: #f0fdf4;
                            border-radius: 10px;
                            border: 2px solid #bbf7d0;
                        }
                    </style>
                    <script src=\"https://code.jquery.com/jquery-3.7.0.min.js\"></script>
                </head>
                <body>
                    <div class=\"tigo-container\">
                        <div class=\"tigo-title\">
                            📱 Pago Tigo Money
                        </div>
                        
                        <div class=\"transaction-info\">
                            <h5>" . $laResult->message . "</h5>
                            <div class=\"transaction-id\">
                                🔢 Transacción: <span id=\"tnTransaccion\">" . $laResult->values . "</span>
                            </div>
                        </div>
                        
                        <div class=\"status-container\">
                            <iframe name=\"QrImage\" style=\"width: 100%; height: 200px; border: none; border-radius: 8px;\"></iframe>
                        </div>
                    </div>
                    
                    <script>
                        $(document).ready(function() {
                            function hacerSolicitudAjax(numero) {
                                var data = { _token: \"" . $csrfToken . "\", tnTransaccion: numero };

                                $.ajax({
                                    url: '/consultar',
                                    type: 'POST',
                                    data: data,
                                    success: function(response) {
                                        var iframe = document.getElementsByName('QrImage')[0];
                                        iframe.contentDocument.open();
                                        iframe.contentDocument.write(response.message);
                                        iframe.contentDocument.close();
                                    },
                                    error: function(error) {
                                        console.error(\"Error en la consulta:\", error);
                                    }
                                });
                            }

                            // Consultar estado cada 7 segundos
                            setInterval(function() {
                                hacerSolicitudAjax(" . $laResult->values . ");
                            }, 7000);
                            
                            // Primera consulta inmediata
                            hacerSolicitudAjax(" . $laResult->values . ");
                        });
                    </script>
                </body>
                </html>", 200, ['Content-Type' => 'text/html']);
            }
        } catch (\Exception $e) {
            \Log::error('Error en RecolectarDatos', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return $this->errorResponse('Error interno: ' . $e->getMessage());
        }
    }

    public function ConsultarEstado(Request $request)
    {
        try {
            $lcComerceID = "d029fa3a95e174a19934857f535eb9427d967218a36ea014b70ad704bc6c8d1c";
            $tnTransaccion = $request->tnTransaccion;

            $loClient = new Client();
            $lcUrl = "http://serviciostigomoney.pagofacil.com.bo/api/servicio/consultartransaccion";

            $laHeader = [
                'Accept' => 'application/json'
            ];

            $laBody = [
                "tcCommerceID" => $lcComerceID,
                "tnTransaccion" => $tnTransaccion
            ];

            $loResponse = $loClient->post($lcUrl, [
                'headers' => $laHeader,
                'json' => $laBody
            ]);

            $laResult = json_decode($loResponse->getBody()->getContents());

            return response()->json([
                'success' => true,
                'message' => $laResult->message ?? 'Consultando estado...',
                'data' => $laResult
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar el estado: ' . $th->getMessage(),
                'error' => $th->getLine()
            ], 500);
        }
    }

    public function urlCallback(Request $request)
    {
        $Venta = $request->input("PedidoID");
        $Fecha = $request->input("Fecha");
        $NuevaFecha = date("Y-m-d", strtotime($Fecha));
        $Hora = $request->input("Hora");
        $MetodoPago = $request->input("MetodoPago");
        $Estado = $request->input("Estado");
        $Ingreso = true;

        try {
            $arreglo = ['error' => 0, 'status' => 1, 'message' => "Pago realizado correctamente.", 'values' => true];
        } catch (\Throwable $th) {
            $arreglo = ['error' => 1, 'status' => 1, 'messageSistema' => "[TRY/CATCH] " . $th->getMessage(), 'message' => "No se pudo realizar el pago, por favor intente de nuevo.", 'values' => false];
        }

        return response()->json($arreglo);
    }

    /**
     * Método para generar respuestas de error consistentes
     */
    private function errorResponse($message)
    {
        return response("
        <!DOCTYPE html>
        <html lang=\"es\">
        <head>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>Error en el Servicio de Pago</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;
                    background: linear-gradient(135deg, #fee2e2 0%, #ef4444 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                
                .error-container {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    border: 3px solid #fca5a5;
                }
                
                .error-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }
                
                .error-title {
                    color: #dc2626;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                
                .error-message {
                    color: #6b7280;
                    font-size: 16px;
                    margin-bottom: 25px;
                    line-height: 1.5;
                }
                
                .retry-button {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                .retry-button:hover {
                    background: #b91c1c;
                }
            </style>
        </head>
        <body>
            <div class=\"error-container\">
                <div class=\"error-icon\">⚠️</div>
                <div class=\"error-title\">Error en el Servicio</div>
                <div class=\"error-message\">{$message}</div>
                <button class=\"retry-button\" onclick=\"window.close()\">Cerrar</button>
            </div>
            
            <script>
                // Notificar al padre sobre el error
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'payment_error',
                        message: '{$message}'
                    }, '*');
                }
            </script>
                 </body>
         </html>", 500, ['Content-Type' => 'text/html']);
     }

    /**
     * Generar QR simulado para testing
     */
    private function generateMockQR($monto)
    {
        // QR simulado (imagen pequeña de ejemplo)
        $mockQrBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        
        \Log::info('Generando QR simulado', ['monto' => $monto]);
        
        return response("
        <!DOCTYPE html>
        <html lang=\"es\">
        <head>
            <meta charset=\"UTF-8\">
            <title>QR Simulado</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 20px; }
                .qr-container { max-width: 400px; margin: 0 auto; }
                .mock-qr { 
                    width: 200px; height: 200px; border: 2px dashed #333;
                    display: flex; align-items: center; justify-content: center;
                    margin: 20px auto; background: #f5f5f5;
                }
            </style>
        </head>
        <body>
            <div class=\"qr-container\">
                <h2>🔧 QR Simulado (Testing)</h2>
                <p>Monto: Bs. " . number_format($monto, 2) . "</p>
                <div class=\"mock-qr\">
                    <span style=\"font-size: 24px;\">📱 QR</span>
                </div>
                <p><small>Este es un QR simulado para pruebas</small></p>
                <button onclick=\"simulatePayment()\">Simular Pago Exitoso</button>
            </div>
            <script>
                function simulatePayment() {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'payment_success'
                        }, '*');
                        window.close();
                    }
                }
            </script>
        </body>
        </html>", 200, ['Content-Type' => 'text/html']);
    }

    /**
     * Generar Tigo Money simulado para testing
     */
    private function generateMockTigoMoney($monto)
    {
        \Log::info('Generando Tigo Money simulado', ['monto' => $monto]);
        
        return response("
        <!DOCTYPE html>
        <html lang=\"es\">
        <head>
            <meta charset=\"UTF-8\">
            <title>Tigo Money Simulado</title>
            <style>
                body { font-family: Arial; text-align: center; padding: 20px; background: #f59e0b; }
                .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            </style>
        </head>
        <body>
            <div class=\"container\">
                <h2>📱 Tigo Money (Testing)</h2>
                <p>Monto: Bs. " . number_format($monto, 2) . "</p>
                <p>Simulación de pago Tigo Money</p>
                <button onclick=\"simulatePayment()\">Confirmar Pago</button>
            </div>
            <script>
                function simulatePayment() {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'payment_success'
                        }, '*');
                        window.close();
                    }
                }
            </script>
        </body>
        </html>", 200, ['Content-Type' => 'text/html']);
    }
}  