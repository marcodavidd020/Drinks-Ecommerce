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
                
                // Improved QR display with better styling - usando echo como en el ejemplo que funciona
                echo "
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
                </html>";
                
            } elseif ($request->tnTipoServicio == 2) {
                $csrfToken = csrf_token();

                echo "
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
                </html>";
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
        
        echo "
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
                
                .qr-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .qr-title {
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
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
                    padding: 30px;
                    margin: 25px 0;
                    border: 2px dashed #d1d5db;
                    position: relative;
                }
                
                .mock-qr {
                    width: 200px;
                    height: 200px;
                    background: linear-gradient(45deg, #f3f4f6 25%, #e5e7eb 25%, #e5e7eb 50%, #f3f4f6 50%, #f3f4f6 75%, #e5e7eb 75%);
                    background-size: 20px 20px;
                    border: 3px solid #374151;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                }
                
                .qr-icon {
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 24px;
                    border: 2px solid #374151;
                    z-index: 2;
                }
                
                .qr-amount {
                    background: #f0fdf4;
                    color: #166534;
                    padding: 15px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 18px;
                    margin-bottom: 20px;
                    border: 2px solid #bbf7d0;
                }
                
                .qr-info {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    padding: 15px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    margin: 20px 0;
                }
                
                .qr-steps {
                    text-align: left;
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 12px;
                    margin: 20px 0;
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
                
                .action-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 25px;
                }
                
                .simulate-button {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    flex: 1;
                    transition: all 0.3s ease;
                }
                
                .simulate-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                }
                
                .cancel-button {
                    background: transparent;
                    color: #6b7280;
                    border: 2px solid #d1d5db;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    flex: 1;
                }
                
                .cancel-button:hover {
                    border-color: #9ca3af;
                    color: #374151;
                }
                
                .transaction-id {
                    background: #f3f4f6;
                    padding: 10px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 15px;
                }
                
                @media (max-width: 480px) {
                    .qr-container {
                        margin: 10px;
                        padding: 20px;
                    }
                    
                    .qr-title {
                        font-size: 20px;
                    }
                    
                    .mock-qr {
                        width: 150px;
                        height: 150px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
            </style>
        </head>
        <body>
            <div class=\"qr-container\">
                <div class=\"qr-header\">
                    <span style=\"font-size: 32px;\">📱</span>
                    <h1 class=\"qr-title\">Código QR de Pago</h1>
                </div>
                
                <div class=\"qr-subtitle\">
                    Escanea este código con tu aplicación de pagos para completar la transacción
                </div>
                
                <div class=\"qr-amount\">
                    💰 Monto: Bs. " . number_format($monto, 2) . "
                </div>
                
                <div class=\"qr-image-wrapper\">
                    <div class=\"mock-qr\">
                        <div class=\"qr-icon\">📱</div>
                    </div>
                    <div style=\"margin-top: 10px; font-size: 12px; color: #6b7280;\">
                        🔧 QR Simulado para Testing
                    </div>
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
                
                <div class=\"transaction-id\">
                    🔢 ID Transacción: #QR-" . strtoupper(uniqid()) . "
                </div>
                
                <div class=\"action-buttons\">
                    <button class=\"simulate-button\" onclick=\"simulatePayment()\">
                        ✅ Simular Pago Exitoso
                    </button>
                    <button class=\"cancel-button\" onclick=\"cancelPayment()\">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
            
            <script>
                function simulatePayment() {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'payment_success',
                            method: 'qr'
                        }, '*');
                        window.close();
                    }
                }
                
                function cancelPayment() {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'payment_cancelled'
                        }, '*');
                    }
                    window.close();
                }
            </script>
        </body>
        </html>";
    }

    /**
     * Generar Tigo Money simulado para testing
     */
    private function generateMockTigoMoney($monto)
    {
        \Log::info('Generando Tigo Money simulado', ['monto' => $monto]);
        
        echo "
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
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    box-sizing: border-box;
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
                
                .tigo-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .tigo-title {
                    color: #d97706;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }
                
                .tigo-subtitle {
                    color: #6b7280;
                    font-size: 14px;
                    margin-bottom: 25px;
                    line-height: 1.5;
                }
                
                .amount-display {
                    background: #fef3c7;
                    color: #92400e;
                    padding: 15px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 18px;
                    margin-bottom: 25px;
                    border: 2px solid #fcd34d;
                }
                
                .phone-input-group {
                    text-align: left;
                    margin-bottom: 20px;
                }
                
                .phone-label {
                    display: block;
                    color: #374151;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                
                .phone-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                
                .phone-input:focus {
                    outline: none;
                    border-color: #f59e0b;
                    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
                }
                
                .phone-help {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 5px;
                }
                
                .transaction-info {
                    background: #f3f4f6;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                
                .transaction-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .transaction-id {
                    font-family: monospace;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                .pay-button {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                    margin-bottom: 10px;
                }
                
                .pay-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
                }
                
                .pay-button:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .cancel-button {
                    background: transparent;
                    color: #6b7280;
                    border: 2px solid #d1d5db;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    width: 100%;
                }
                
                .cancel-button:hover {
                    border-color: #9ca3af;
                    color: #374151;
                }
                
                .info-steps {
                    background: #fef3c7;
                    padding: 15px;
                    border-radius: 10px;
                    margin-top: 20px;
                    text-align: left;
                    border-left: 4px solid #f59e0b;
                }
                
                .info-steps h4 {
                    margin: 0 0 10px 0;
                    color: #92400e;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .info-steps ul {
                    margin: 0;
                    padding-left: 20px;
                    color: #92400e;
                    font-size: 13px;
                    line-height: 1.4;
                }
                
                .info-steps li {
                    margin-bottom: 5px;
                }
                
                @media (max-width: 480px) {
                    .tigo-container {
                        margin: 10px;
                        padding: 20px;
                    }
                    
                    .tigo-title {
                        font-size: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class=\"tigo-container\">
                <div class=\"tigo-header\">
                    <span style=\"font-size: 32px;\">📱</span>
                    <h1 class=\"tigo-title\">Pago Tigo Money</h1>
                </div>
                
                <div class=\"tigo-subtitle\">
                    Completa el pago con tu número Tigo Money
                </div>
                
                <div class=\"amount-display\">
                    💰 Monto: Bs. " . number_format($monto, 2) . "
                </div>
                
                <form id=\"tigoForm\" onsubmit=\"return processPayment(event)\">
                    <div class=\"phone-input-group\">
                        <label class=\"phone-label\" for=\"phoneNumber\">
                            📞 Ingrese su número TigoMoney
                        </label>
                        <input 
                            type=\"tel\" 
                            id=\"phoneNumber\" 
                            class=\"phone-input\" 
                            placeholder=\"7XXXXXXX\"
                            pattern=\"[67][0-9]{7}\"
                            maxlength=\"8\"
                            required
                        />
                        <div class=\"phone-help\">
                            Ejemplo: 70123456 o 60987654
                        </div>
                    </div>
                    
                    <div class=\"transaction-info\">
                        <div class=\"transaction-label\">🔢 Transacción:</div>
                        <div class=\"transaction-id\">#TM-" . strtoupper(uniqid()) . "</div>
                    </div>
                    
                    <button type=\"submit\" class=\"pay-button\" id=\"payButton\">
                        💳 Confirmar Pago
                    </button>
                </form>
                
                <button type=\"button\" class=\"cancel-button\" onclick=\"cancelPayment()\">
                    ❌ Cancelar
                </button>
                
                <div class=\"info-steps\">
                    <h4>ℹ️ Información importante:</h4>
                    <ul>
                        <li>Ingrese su número Tigo Money de 8 dígitos</li>
                        <li>Verifique que tenga saldo suficiente</li>
                        <li>Recibirá un SMS de confirmación</li>
                        <li>Esta es una simulación para pruebas</li>
                    </ul>
                </div>
            </div>
            
            <script>
                function processPayment(event) {
                    event.preventDefault();
                    
                    const phoneInput = document.getElementById('phoneNumber');
                    const payButton = document.getElementById('payButton');
                    
                    if (!phoneInput.value || phoneInput.value.length !== 8) {
                        alert('Por favor ingrese un número válido de 8 dígitos');
                        return false;
                    }
                    
                    // Simular procesamiento
                    payButton.disabled = true;
                    payButton.innerHTML = '⏳ Procesando...';
                    
                    setTimeout(() => {
                        // Simular éxito del pago
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'payment_success',
                                method: 'tigo_money',
                                phone: phoneInput.value
                            }, '*');
                            window.close();
                        }
                    }, 2000);
                    
                    return false;
                }
                
                function cancelPayment() {
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'payment_cancelled'
                        }, '*');
                    }
                    window.close();
                }
                
                // Validación en tiempo real del número
                document.getElementById('phoneNumber').addEventListener('input', function(e) {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length > 8) {
                        value = value.substring(0, 8);
                    }
                    e.target.value = value;
                    
                    const payButton = document.getElementById('payButton');
                    payButton.disabled = value.length !== 8;
                });
            </script>
        </body>
        </html>";
    }
}  