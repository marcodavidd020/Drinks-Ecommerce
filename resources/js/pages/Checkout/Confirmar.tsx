import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';
import { useRef, useState } from 'react';
import { route } from 'ziggy-js';

interface TipoPago {
    id: number;
    tipo_pago: string;
}

interface Direccion {
    id: number;
    nombre: string;
    referencia: string;
}

interface DetalleCarrito {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    productoAlmacen: {
        id: number;
        stock: number;
        producto: {
            id: number;
            nombre: string;
            imagen: string;
            categoria: {
                nombre: string;
            };
            cod_producto: string;
        };
    };
}

interface CheckoutConfirmarProps {
    carrito: {
        id: number;
        total: number;
        detalles: DetalleCarrito[];
    };
    direccion: Direccion;
    tipoPago: TipoPago;
    total: number;
}

export default function CheckoutConfirmar({ carrito, direccion, tipoPago, total }: CheckoutConfirmarProps) {
    const { settings } = useAppMode();
    const [observaciones, setObservaciones] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [qrConfirmed, setQrConfirmed] = useState(false);
    const isQRPayment = tipoPago.tipo_pago === 'QR';

    /** 👉 referencia al iframe donde mostraremos el QR */
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const getTipoPagoIcon = (tipoPago: string) => {
        const tipo = tipoPago.toLowerCase();
        if (tipo.includes('tarjeta')) return '💳';
        if (tipo.includes('qr')) return '📱';
        return '💰';
    };

    const generarQR = () => {
        setShowQR(true);
        
        // Obtener el CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!csrfToken) {
            console.error('Token de seguridad no encontrado');
            setShowQR(false);
            alert(getTextByMode({
                niños: '🔐 Problema de seguridad. ¡Recarga la página!',
                jóvenes: 'Error de token de seguridad. Recarga la página.',
                adultos: 'Error de token de seguridad. Recargue la página.'
            }));
            return;
        }
        
        // Usar fetch para manejar la respuesta JSON
        fetch(route('checkout.generar-qr'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                direccion_id: direccion.id,
                tipo_pago_id: tipoPago.id,
                total: total
            })
        })
        .then(response => {
            // Verificar si la respuesta es JSON antes de intentar parsearla
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Si no es JSON, probablemente es un error 419 o 500
                if (response.status === 419) {
                    throw new Error('Error de autenticación CSRF. Por favor, recarga la página e intenta nuevamente.');
                } else if (response.status === 500) {
                    throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
                } else {
                    throw new Error(`Error del servidor (${response.status}). Por favor, intenta nuevamente.`);
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.html && iframeRef.current) {
                // Escribir el HTML en el iframe
                const iframe = iframeRef.current;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    iframeDoc.open();
                    iframeDoc.write(data.html);
                    iframeDoc.close();
                }
                console.log('QR generado exitosamente');
            } else {
                console.error('Error al generar QR:', data.error || 'Error desconocido');
                setShowQR(false);
                alert(getTextByMode({
                    niños: `😰 Error al generar QR: ${data.error || 'Error desconocido'}`,
                    jóvenes: `Error al generar QR: ${data.error || 'Error desconocido'}`,
                    adultos: `Error al generar QR: ${data.error || 'Error desconocido'}`
                }));
            }
        })
        .catch(error => {
            console.error('Error al generar QR:', error);
            setShowQR(false);
            
            // Mostrar mensaje específico según el tipo de error
            let userMessage = error.message;
            if (error.message.includes('CSRF')) {
                userMessage = getTextByMode({
                    niños: '🔒 Error de seguridad. ¡Recarga la página e intenta de nuevo!',
                    jóvenes: 'Error de seguridad. Recarga la página e intenta nuevamente.',
                    adultos: 'Error de autenticación. Por favor, recarga la página e intenta nuevamente.'
                });
            } else if (error.message.includes('500')) {
                userMessage = getTextByMode({
                    niños: '😰 El servidor está ocupado. ¡Intenta en unos minutos!',
                    jóvenes: 'Error del servidor. Intenta más tarde.',
                    adultos: 'Error interno del servidor. Intente más tarde.'
                });
            } else if (error.message.includes('Token de seguridad')) {
                userMessage = getTextByMode({
                    niños: '🔐 Problema de seguridad. ¡Recarga la página!',
                    jóvenes: 'Error de token de seguridad. Recarga la página.',
                    adultos: 'Error de token de seguridad. Recargue la página.'
                });
            }
            
            alert(userMessage);
        });
    };
  

    // const confirmarPagoQR = () => {
    //     setQrConfirmed(true);
        
    //     // Procesar el pago QR directamente
    //     router.post('/checkout/procesar', {
    //         direccion_id: direccion.id,
    //         tipo_pago_id: tipoPago.id,
    //         metodo_pago: 'qr',
    //         observaciones: observaciones
    //     });
    // };

    const confirmarPagoQR = () => {
        setQrConfirmed(true);
        router.post(route('checkout.procesar'), {
            direccion_id: direccion.id,
            tipo_pago_id: tipoPago.id,
            metodo_pago: 'qr',
            observaciones,
        });
    };

    const procesarPedido = () => {
        if (isQRPayment && !qrConfirmed) {
            // Para pago QR, primero mostrar QR
            if (!showQR) {
                generarQR();
                return;
            }
            // Si ya se mostró el QR, confirmar pago
            confirmarPagoQR();
        } else {
            // Para otros métodos de pago, procesar directamente
            router.post('/checkout/procesar', {
                direccion_id: direccion.id,
                tipo_pago_id: tipoPago.id,
                observaciones: observaciones
            });
        }
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '✅ ¡Confirma tu pedido!',
                jóvenes: 'Confirmar Pedido',
                adultos: 'Confirmar Pedido'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '✅ ¡Confirma tu pedido!',
                                jóvenes: '🎯 Confirmar Pedido',
                                adultos: 'Confirmar Pedido'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Revisa todo antes de confirmar tu pedido',
                                jóvenes: 'Revisa los detalles antes de confirmar',
                                adultos: 'Revise los detalles de su pedido antes de confirmar'
                            })}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    ✓
                                </div>
                                <span className={`ml-2 text-green-600 dark:text-green-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Revisar', jóvenes: 'Resumen', adultos: 'Resumen' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    ✓
                                </div>
                                <span className={`ml-2 text-green-600 dark:text-green-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Dirección', jóvenes: 'Entrega', adultos: 'Dirección' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    ✓
                                </div>
                                <span className={`ml-2 text-green-600 dark:text-green-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Pagar', jóvenes: 'Pago', adultos: 'Pago' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <span className={`ml-2 text-orange-600 dark:text-orange-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Confirmar', jóvenes: 'Confirmar', adultos: 'Confirmar' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Detalles del pedido */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Productos */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🛍️ Tus Productos',
                                            jóvenes: 'Productos del Pedido',
                                            adultos: 'Productos del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {carrito.detalles.map((detalle: DetalleCarrito) => (
                                        <div key={detalle.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <img 
                                                src={detalle.productoAlmacen?.producto?.imagen || `${import.meta.env.VITE_APP_URL || ''}/images/no-image.jpg`} 
                                                alt={detalle.productoAlmacen?.producto?.nombre || 'Producto'}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=150&h=150&fit=crop';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                    {detalle.productoAlmacen?.producto?.nombre || 'Producto sin nombre'}
                                                </h3>
                                                <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                    {detalle.productoAlmacen?.producto?.categoria?.nombre || 'Sin categoría'}
                                                </p>
                                                <p className={`text-sm text-gray-500 dark:text-gray-500 ${getModeClasses()}`}>
                                                    {detalle.productoAlmacen?.producto?.cod_producto || 'Sin código'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                    {detalle.cantidad} x {formatCurrency(detalle.precio_unitario)}
                                                </p>
                                                <p className={`text-lg font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                                    {formatCurrency(detalle.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📝 ¿Algo más que decir?',
                                            jóvenes: 'Observaciones',
                                            adultos: 'Observaciones (Opcional)'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <textarea
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Cuéntanos si hay algo especial...',
                                            jóvenes: 'Instrucciones especiales para tu pedido...',
                                            adultos: 'Instrucciones especiales para la entrega...'
                                        })}
                                        className={`w-full h-24 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getModeClasses()}`}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Sección de QR para pagos QR */}
                            {isQRPayment && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📱 ¡Tu Código QR!',
                                                jóvenes: 'Código QR de Pago',
                                                adultos: 'Código QR de Pago'
                                            })}
                                        </h2>
                                    </div>

                                    <div className="p-6">
                                        {!showQR ? (
                                            <div className="text-center py-8">
                                                <div className="text-6xl mb-4">📱</div>
                                                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: 'Haz clic en "Generar QR" para ver tu código',
                                                        jóvenes: 'Haz clic en "Generar QR" para proceder',
                                                        adultos: 'Haga clic en "Generar QR" para proceder con el pago'
                                                    })}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="py-6">
                                                {/* QR Code ya generado en ventana popup */}
                                                <div className="text-center">
                                                    <div className="text-6xl mb-4">✅</div>
                                                    <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: '¡QR generado en ventana nueva!',
                                                            jóvenes: 'QR generado en ventana nueva',
                                                            adultos: 'Código QR generado en ventana nueva'
                                                        })}
                                                    </p>
                                                    <p className={`text-sm text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: 'Busca la ventana del QR o haz clic en "Generar QR" de nuevo',
                                                            jóvenes: 'Busca la ventana del QR o genera uno nuevo',
                                                            adultos: 'Busque la ventana del QR o genere uno nuevo'
                                                        })}
                                                    </p>
                                                </div>

                                                {/* ► Sección QR sólo si isQRPayment === true */}
                                                {isQRPayment && (
                                                <div className="p-6">
                                                    <iframe
                                                        ref={iframeRef}
                                                        name="qr-frame"
                                                        id="qr-frame"
                                                        className={`w-full h-96 rounded-xl border ${showQR ? 'block' : 'hidden'}`}
                                                    />
                                                    {!showQR && (
                                                        <p className="text-center text-gray-500 mt-4">
                                                        Pulsa “Generar QR” para obtener el código
                                                        </p>
                                                    )}
                                                </div>
                                                )}


                                                {/* …dentro de la tarjeta QR… */}
                                                {isQRPayment && (
                                                <button
                                                    onClick={procesarPedido}
                                                    className="btn-primary w-full mt-6"
                                                >
                                                    {isQRPayment && !showQR
                                                    ? '📱 Generar QR'
                                                    : isQRPayment && showQR && !qrConfirmed
                                                        ? '✅ Confirmar Pago QR'
                                                        : 'Confirmar Pedido'}
                                                </button>
                                                )}


                                                {qrConfirmed && (
                                                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 mt-4">
                                                        <div className="flex items-center justify-center">
                                                            <span className="text-2xl mr-2">✅</span>
                                                            <p className={`text-green-800 dark:text-green-200 font-medium ${getModeClasses()}`}>
                                                                {getTextByMode({
                                                                    niños: '¡Pago confirmado!',
                                                                    jóvenes: 'Pago confirmado',
                                                                    adultos: 'Pago confirmado exitosamente'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resumen final */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🎯 Resumen Final',
                                            jóvenes: 'Resumen Final',
                                            adultos: 'Resumen Final'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Dirección */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white text-sm ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🏠 Entrega', jóvenes: 'Entregar en', adultos: 'Dirección de Entrega' })}
                                        </h3>
                                        <p className={`text-gray-600 dark:text-gray-400 text-sm ${getModeClasses()}`}>
                                            {direccion.nombre}
                                        </p>
                                        <p className={`text-gray-500 dark:text-gray-500 text-xs ${getModeClasses()}`}>
                                            {direccion.referencia}
                                        </p>
                                    </div>

                                    {/* Método de pago */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white text-sm ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '💳 Cómo pagas', jóvenes: 'Método de Pago', adultos: 'Método de Pago' })}
                                        </h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-lg">{getTipoPagoIcon(tipoPago.tipo_pago)}</span>
                                            <p className={`text-gray-600 dark:text-gray-400 text-sm ${getModeClasses()}`}>
                                                {tipoPago.tipo_pago}
                                            </p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🧾 Total', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-2xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🚚 Envío', jóvenes: 'Envío', adultos: 'Costo de Envío' })}
                                        </span>
                                        <span className={`font-medium text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '¡Gratis!', jóvenes: 'Gratis', adultos: 'Gratuito' })}
                                        </span>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    <div className="space-y-3">
                                        <button
                                            onClick={procesarPedido}
                                            className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center ${getModeClasses()}`}
                                        >
                                            {isQRPayment && !showQR 
                                                ? getTextByMode({
                                                    niños: '📱 ¡Generar QR!',
                                                    jóvenes: '📱 Generar QR',
                                                    adultos: '📱 Generar Código QR'
                                                })
                                                : isQRPayment && showQR && !qrConfirmed
                                                ? getTextByMode({
                                                    niños: '✅ ¡Confirmar Pago QR!',
                                                    jóvenes: '✅ Confirmar Pago QR',
                                                    adultos: '✅ Confirmar Pago QR'
                                                })
                                                : getTextByMode({
                                                    niños: '🎉 ¡Confirmar y Pedir!',
                                                    jóvenes: '✅ Confirmar Pedido',
                                                    adultos: 'Confirmar Pedido'
                                                })
                                            }
                                        </button>

                                        <button
                                            onClick={() => router.get('/checkout/pago')}
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Cambiar Pago',
                                                jóvenes: 'Cambiar Método de Pago',
                                                adultos: 'Cambiar Método de Pago'
                                            })}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 