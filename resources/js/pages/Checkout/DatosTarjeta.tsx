import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface TipoPago {
    id: number;
    tipo_pago: string;
}

interface Direccion {
    id: number;
    nombre: string;
    referencia: string;
}

interface Carrito {
    id: number;
    total: number;
}

interface CheckoutDatosTarjetaProps {
    direccion: Direccion;
    tipoPago: TipoPago;
    total: number;
}

export default function CheckoutDatosTarjeta({ direccion, tipoPago, total }: CheckoutDatosTarjetaProps) {
    const { settings } = useAppMode();
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        numeroTarjeta: '',
        nombreTitular: '',
        fechaExpiracion: '',
        cvv: '',
        tipoTarjeta: 'credito'
    });

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Formatear número de tarjeta
        if (name === 'numeroTarjeta') {
            const cleanValue = value.replace(/\D/g, '');
            const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1-');
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Formatear fecha de expiración
        else if (name === 'fechaExpiracion') {
            const cleanValue = value.replace(/\D/g, '');
            const formattedValue = cleanValue.replace(/(\d{2})(?=\d)/, '$1/');
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Formatear CVV
        else if (name === 'cvv') {
            const cleanValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: cleanValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const procesarPago = () => {
        if (!formData.numeroTarjeta || !formData.nombreTitular || !formData.fechaExpiracion || !formData.cvv) {
            alert(getTextByMode({
                niños: '¡Oops! Completa todos los campos',
                jóvenes: 'Por favor completa todos los campos',
                adultos: 'Debe completar todos los campos'
            }));
            return;
        }

        setProcessing(true);
        
        // Simular procesamiento de pago con tarjeta
        setTimeout(() => {
            // Simular éxito en el 90% de los casos
            const exito = Math.random() > 0.1;
            
            if (exito) {
                router.post('/checkout/procesar', {
                    direccion_id: direccion.id,
                    tipo_pago_id: tipoPago.id,
                    metodo_pago: 'tarjeta',
                    datos_tarjeta: {
                        numero_tarjeta: formData.numeroTarjeta.replace(/-/g, ''),
                        nombre_titular: formData.nombreTitular,
                        tipo_tarjeta: formData.tipoTarjeta,
                        // Por seguridad, no enviamos CVV ni fecha completa
                        ultimo_digitos: formData.numeroTarjeta.replace(/-/g, '').slice(-4)
                    }
                });
            } else {
                setProcessing(false);
                alert(getTextByMode({
                    niños: '¡Ups! Hubo un problema con tu tarjeta',
                    jóvenes: 'Error al procesar el pago',
                    adultos: 'Error al procesar el pago. Verifique los datos de la tarjeta'
                }));
            }
        }, 3000);
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '💳 Datos de la Tarjeta',
                jóvenes: 'Datos de Tarjeta',
                adultos: 'Datos de la Tarjeta'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '💳 ¡Datos de tu Tarjeta!',
                                jóvenes: '💳 Datos de Tarjeta',
                                adultos: 'Datos de la Tarjeta'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Escribe los números de tu tarjeta',
                                jóvenes: 'Ingresa los datos de tu tarjeta',
                                adultos: 'Ingrese los datos de su tarjeta de crédito/débito'
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
                                    {getTextByMode({ niños: 'Tipo Pago', jóvenes: 'Pago', adultos: 'Pago' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-blue-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <span className={`ml-2 text-blue-600 dark:text-blue-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Tarjeta', jóvenes: 'Datos', adultos: 'Datos' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Formulario de datos de tarjeta */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '💳 Información de la Tarjeta',
                                            jóvenes: 'Datos de la Tarjeta',
                                            adultos: 'Información de la Tarjeta'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Tipo de tarjeta */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: 'Tipo de Tarjeta', jóvenes: 'Tipo', adultos: 'Tipo de Tarjeta' })}
                                        </label>
                                        <select
                                            name="tipoTarjeta"
                                            value={formData.tipoTarjeta}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="credito">Tarjeta de Crédito</option>
                                            <option value="debito">Tarjeta de Débito</option>
                                        </select>
                                    </div>

                                    {/* Número de tarjeta */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🔢 Número de Tarjeta', jóvenes: 'Número', adultos: 'Número de Tarjeta' })}
                                        </label>
                                        <input
                                            type="text"
                                            name="numeroTarjeta"
                                            value={formData.numeroTarjeta}
                                            onChange={handleInputChange}
                                            placeholder="1234-5678-9012-3456"
                                            maxLength={19}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Nombre del titular */}
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '👤 Nombre del Titular', jóvenes: 'Titular', adultos: 'Nombre del Titular' })}
                                        </label>
                                        <input
                                            type="text"
                                            name="nombreTitular"
                                            value={formData.nombreTitular}
                                            onChange={handleInputChange}
                                            placeholder="Juan Pérez"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    {/* Fecha de expiración y CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '📅 Fecha', jóvenes: 'Vencimiento', adultos: 'Fecha de Vencimiento' })}
                                            </label>
                                            <input
                                                type="text"
                                                name="fechaExpiracion"
                                                value={formData.fechaExpiracion}
                                                onChange={handleInputChange}
                                                placeholder="MM/AA"
                                                maxLength={5}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '🔐 CVV', jóvenes: 'CVV', adultos: 'CVV' })}
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="123"
                                                maxLength={4}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Mensaje de seguridad */}
                                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center">
                                            <span className="text-blue-600 dark:text-blue-400 text-2xl mr-3">🔒</span>
                                            <div className={`text-sm text-blue-800 dark:text-blue-200 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: 'Tus datos están súper seguros con nosotros',
                                                    jóvenes: 'Tus datos están protegidos y seguros',
                                                    adultos: 'Sus datos están protegidos con encriptación SSL'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📋 Tu Pedido',
                                            jóvenes: 'Resumen Final',
                                            adultos: 'Resumen del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Dirección seleccionada */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white text-sm ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🏠 Entrega', jóvenes: 'Entregar en', adultos: 'Dirección de Entrega' })}
                                        </h3>
                                        <p className={`text-gray-600 dark:text-gray-400 text-sm ${getModeClasses()}`}>
                                            {direccion.nombre}
                                        </p>
                                    </div>

                                    {/* Método de pago */}
                                    <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                                        <h3 className={`font-semibold text-blue-900 dark:text-blue-200 text-sm ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '💳 Pago', jóvenes: 'Método de Pago', adultos: 'Método de Pago' })}
                                        </h3>
                                        <p className={`text-blue-700 dark:text-blue-300 text-sm ${getModeClasses()}`}>
                                            {tipoPago.tipo_pago}
                                        </p>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🧾 Total', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={procesarPago}
                                            disabled={processing}
                                            className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center ${
                                                processing
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                                            } ${getModeClasses()}`}
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                    {getTextByMode({
                                                        niños: '⏳ Procesando...',
                                                        jóvenes: 'Procesando...',
                                                        adultos: 'Procesando Pago...'
                                                    })}
                                                </div>
                                            ) : (
                                                getTextByMode({
                                                    niños: '✅ ¡Pagar Ahora!',
                                                    jóvenes: 'Pagar Ahora',
                                                    adultos: 'Procesar Pago'
                                                })
                                            )}
                                        </button>

                                        <button
                                            onClick={() => router.get('/checkout/pago')}
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Cambiar Pago',
                                                jóvenes: 'Volver a Pago',
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