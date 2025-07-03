import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface Direccion {
    id: number;
    nombre: string;
    longitud: number;
    latitud: number;
    referencia: string;
}

interface Carrito {
    id: number;
    total: number;
}

interface CheckoutDireccionProps {
    carrito: Carrito;
    direcciones: Direccion[];
    total: number;
}

export default function CheckoutDireccion({ carrito, direcciones, total }: CheckoutDireccionProps) {
    const { settings } = useAppMode();
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newDireccion, setNewDireccion] = useState({
        nombre: '',
        referencia: '',
        google_maps_url: '',
        latitud: '',
        longitud: ''
    });
    const [extracting, setExtracting] = useState(false);

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

    /**
     * Extraer coordenadas de URL de Google Maps
     * Formatos soportados:
     * - https://www.google.com/maps/@-17.8075221,-63.189861,14z
     * - https://maps.google.com/?q=-17.8075221,-63.189861
     * - https://goo.gl/maps/... (redirige a formato estándar)
     */
    const extractCoordinatesFromUrl = (url: string) => {
        try {
            // Patrón 1: @latitud,longitud,zoom
            const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*),?\d*z?/;
            const match1 = url.match(pattern1);
            
            if (match1) {
                return {
                    latitud: parseFloat(match1[1]),
                    longitud: parseFloat(match1[2])
                };
            }

            // Patrón 2: ?q=latitud,longitud
            const pattern2 = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
            const match2 = url.match(pattern2);
            
            if (match2) {
                return {
                    latitud: parseFloat(match2[1]),
                    longitud: parseFloat(match2[2])
                };
            }

            // Patrón 3: /place/@latitud,longitud,zoom
            const pattern3 = /\/place\/@(-?\d+\.?\d*),(-?\d+\.?\d*),?\d*/;
            const match3 = url.match(pattern3);
            
            if (match3) {
                return {
                    latitud: parseFloat(match3[1]),
                    longitud: parseFloat(match3[2])
                };
            }

            return null;
        } catch (error) {
            console.error('Error extrayendo coordenadas:', error);
            return null;
        }
    };

    const handleUrlChange = (url: string) => {
        setNewDireccion(prev => ({ ...prev, google_maps_url: url }));
        
        if (url.trim()) {
            setExtracting(true);
            
            // Simular extracción de coordenadas (en tiempo real)
            setTimeout(() => {
                const coords = extractCoordinatesFromUrl(url);
                
                if (coords) {
                    setNewDireccion(prev => ({
                        ...prev,
                        latitud: coords.latitud.toString(),
                        longitud: coords.longitud.toString()
                    }));
                } else {
                    // Limpiar coordenadas si no se pueden extraer
                    setNewDireccion(prev => ({
                        ...prev,
                        latitud: '',
                        longitud: ''
                    }));
                }
                setExtracting(false);
            }, 500);
        } else {
            setNewDireccion(prev => ({
                ...prev,
                latitud: '',
                longitud: ''
            }));
        }
    };

    const guardarDireccion = () => {
        if (!newDireccion.nombre.trim()) {
            alert(getTextByMode({
                niños: '¡Oops! Ponle un nombre a tu dirección',
                jóvenes: 'Por favor ingresa un nombre',
                adultos: 'Debe ingresar un nombre para la dirección'
            }));
            return;
        }

        if (!newDireccion.referencia.trim()) {
            alert(getTextByMode({
                niños: '¡Oops! Describe dónde queda',
                jóvenes: 'Por favor agrega una referencia',
                adultos: 'Debe agregar una referencia o descripción'
            }));
            return;
        }

        if (!newDireccion.latitud || !newDireccion.longitud) {
            alert(getTextByMode({
                niños: '¡Oops! Necesitamos el enlace de Google Maps',
                jóvenes: 'Por favor pega el enlace de Google Maps',
                adultos: 'Debe proporcionar una URL válida de Google Maps'
            }));
            return;
        }

        setProcessing(true);
        
        router.post('/checkout/direccion/store', {
            nombre: newDireccion.nombre,
            referencia: newDireccion.referencia,
            latitud: parseFloat(newDireccion.latitud),
            longitud: parseFloat(newDireccion.longitud),
        }, {
            onSuccess: () => {
                setShowForm(false);
                setNewDireccion({
                    nombre: '',
                    referencia: '',
                    google_maps_url: '',
                    latitud: '',
                    longitud: ''
                });
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
                alert(getTextByMode({
                    niños: '¡Oops! No pudimos guardar la dirección',
                    jóvenes: 'Error al guardar la dirección',
                    adultos: 'Error al guardar la dirección. Intente nuevamente.'
                }));
            }
        });
    };

    const continuarAlPago = () => {
        if (!direccionSeleccionada) {
            alert(getTextByMode({
                niños: '¡Oops! Debes elegir una dirección',
                jóvenes: 'Por favor selecciona una dirección',
                adultos: 'Debe seleccionar una dirección de entrega'
            }));
            return;
        }

        setProcessing(true);
        router.post('/checkout/pago', {
            direccion_id: direccionSeleccionada
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🏠 ¿Dónde quieres recibir tus bebidas?',
                jóvenes: 'Dirección de Entrega',
                adultos: 'Seleccionar Dirección de Entrega'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🏠 ¡Elige dónde quieres recibir tus bebidas!',
                                jóvenes: '📍 Dirección de Entrega',
                                adultos: 'Seleccionar Dirección de Entrega'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Selecciona el lugar más cómodo para ti',
                                jóvenes: 'Elige dónde quieres recibir tu pedido',
                                adultos: 'Seleccione la dirección donde desea recibir su pedido'
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
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className={`ml-2 text-blue-600 dark:text-blue-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Dirección', jóvenes: 'Entrega', adultos: 'Dirección' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <span className={`ml-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Pagar', jóvenes: 'Pago', adultos: 'Pago' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Direcciones disponibles */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📍 Direcciones Disponibles',
                                                jóvenes: 'Zonas de Entrega',
                                                adultos: 'Direcciones de Entrega Disponibles'
                                            })}
                                        </h2>
                                        <button
                                            onClick={() => setShowForm(!showForm)}
                                            className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${getModeClasses()}`}
                                        >
                                            <span>{showForm ? '❌' : '➕'}</span>
                                            <span>
                                                {showForm ? 
                                                    getTextByMode({ niños: 'Cancelar', jóvenes: 'Cancelar', adultos: 'Cancelar' }) :
                                                    getTextByMode({ niños: 'Agregar', jóvenes: 'Nueva Dirección', adultos: 'Agregar Dirección' })
                                                }
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Formulario para nueva dirección */}
                                    {showForm && (
                                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <h3 className={`text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '🏠 Agregar Nueva Dirección',
                                                    jóvenes: 'Nueva Dirección de Entrega',
                                                    adultos: 'Agregar Nueva Dirección'
                                                })}
                                            </h3>

                                            <div className="space-y-4">
                                                {/* Nombre de la dirección */}
                                                <div>
                                                    <label className={`block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: '🏷️ Nombre (ej: Mi Casa)',
                                                            jóvenes: 'Nombre de la dirección',
                                                            adultos: 'Nombre de la dirección'
                                                        })}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newDireccion.nombre}
                                                        onChange={(e) => setNewDireccion(prev => ({ ...prev, nombre: e.target.value }))}
                                                        placeholder={getTextByMode({
                                                            niños: 'Mi Casa, Trabajo, Escuela...',
                                                            jóvenes: 'Casa, Trabajo, Universidad...',
                                                            adultos: 'Casa, Oficina, etc.'
                                                        })}
                                                        className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                {/* URL de Google Maps */}
                                                <div>
                                                    <label className={`block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: '🗺️ Enlace de Google Maps',
                                                            jóvenes: 'URL de Google Maps',
                                                            adultos: 'URL de Google Maps'
                                                        })}
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={newDireccion.google_maps_url}
                                                        onChange={(e) => handleUrlChange(e.target.value)}
                                                        placeholder="https://www.google.com/maps/@-17.8075221,-63.189861,14z"
                                                        className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <p className={`text-xs text-blue-700 dark:text-blue-300 mt-1 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: 'Pega aquí el enlace que te da Google Maps',
                                                            jóvenes: 'Copia y pega el enlace de Google Maps',
                                                            adultos: 'Copie la URL completa y péguela arriba'
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Coordenadas extraídas */}
                                                {(newDireccion.latitud && newDireccion.longitud) && (
                                                    <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-700">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-green-600 dark:text-green-400">✅</span>
                                                            <span className={`text-green-800 dark:text-green-200 font-medium ${getModeClasses()}`}>
                                                                {getTextByMode({
                                                                    niños: '¡Coordenadas encontradas!',
                                                                    jóvenes: 'Coordenadas detectadas',
                                                                    adultos: 'Coordenadas extraídas correctamente'
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className={`text-sm text-green-700 dark:text-green-300 mt-1 ${getModeClasses()}`}>
                                                            📍 Lat: {newDireccion.latitud}, Lng: {newDireccion.longitud}
                                                        </div>
                                                    </div>
                                                )}

                                                {extracting && (
                                                    <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="animate-spin text-yellow-600 dark:text-yellow-400">⏳</span>
                                                            <span className={`text-yellow-800 dark:text-yellow-200 ${getModeClasses()}`}>
                                                                {getTextByMode({
                                                                    niños: 'Buscando la ubicación...',
                                                                    jóvenes: 'Extrayendo coordenadas...',
                                                                    adultos: 'Extrayendo coordenadas...'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Referencia */}
                                                <div>
                                                    <label className={`block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: '📝 Describe el lugar',
                                                            jóvenes: 'Referencia o descripción',
                                                            adultos: 'Referencia o descripción'
                                                        })}
                                                    </label>
                                                    <textarea
                                                        value={newDireccion.referencia}
                                                        onChange={(e) => setNewDireccion(prev => ({ ...prev, referencia: e.target.value }))}
                                                        placeholder={getTextByMode({
                                                            niños: 'Cerca del parque, casa color azul, portón verde...',
                                                            jóvenes: 'Zona centro, edificio Torre Azul, 3er piso...',
                                                            adultos: 'Referencias adicionales para facilitar la entrega'
                                                        })}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                {/* Botones del formulario */}
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={guardarDireccion}
                                                        disabled={processing}
                                                        className={`flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors ${getModeClasses()}`}
                                                    >
                                                        {processing ? 
                                                            getTextByMode({ niños: '⏳ Guardando...', jóvenes: 'Guardando...', adultos: 'Guardando...' }) :
                                                            getTextByMode({ niños: '💾 Guardar', jóvenes: 'Guardar Dirección', adultos: 'Guardar Dirección' })
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => setShowForm(false)}
                                                        disabled={processing}
                                                        className={`flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors ${getModeClasses()}`}
                                                    >
                                                        {getTextByMode({ niños: '❌ Cancelar', jóvenes: 'Cancelar', adultos: 'Cancelar' })}
                                                    </button>
                                                </div>

                                                {/* Instrucciones de Google Maps */}
                                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    <h4 className={`font-medium text-gray-900 dark:text-white mb-2 ${getModeClasses()}`}>
                                                        {getTextByMode({
                                                            niños: '🤔 ¿Cómo obtengo el enlace?',
                                                            jóvenes: '¿Cómo obtener la URL?',
                                                            adultos: '¿Cómo obtener la URL de Google Maps?'
                                                        })}
                                                    </h4>
                                                    <ol className={`text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside ${getModeClasses()}`}>
                                                        <li>{getTextByMode({ niños: 'Abre Google Maps', jóvenes: 'Ve a Google Maps', adultos: 'Abra Google Maps en su navegador' })}</li>
                                                        <li>{getTextByMode({ niños: 'Busca tu dirección', jóvenes: 'Busca tu ubicación', adultos: 'Busque su dirección exacta' })}</li>
                                                        <li>{getTextByMode({ niños: 'Haz clic en "Compartir"', jóvenes: 'Haz clic en "Compartir"', adultos: 'Haga clic en el botón "Compartir"' })}</li>
                                                        <li>{getTextByMode({ niños: 'Copia el enlace aquí', jóvenes: 'Copia la URL completa', adultos: 'Copie la URL completa y péguela arriba' })}</li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de direcciones existentes */}
                                    <div className="space-y-4">
                                        {direcciones.map((direccion) => (
                                            <div 
                                                key={direccion.id}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                                    direccionSeleccionada === direccion.id
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                                }`}
                                                onClick={() => setDireccionSeleccionada(direccion.id)}
                                            >
                                                <div className="flex items-start space-x-4">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                        direccionSeleccionada === direccion.id
                                                            ? 'border-blue-500 bg-blue-500'
                                                            : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                        {direccionSeleccionada === direccion.id && (
                                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                            {direccion.nombre}
                                                        </h3>
                                                        <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                            {direccion.referencia}
                                                        </p>
                                                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="text-lg mr-2">
                                                                {settings.ageMode === 'niños' ? '🗺️' : '📍'}
                                                            </span>
                                                            <span>{direccion.latitud}, {direccion.longitud}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {direcciones.length === 0 && !showForm && (
                                            <div className="text-center py-8">
                                                <div className="text-6xl mb-4">🏠</div>
                                                <h3 className={`text-lg font-medium text-gray-900 dark:text-white mb-2 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '¡No hay direcciones aún!',
                                                        jóvenes: 'Sin direcciones registradas',
                                                        adultos: 'No hay direcciones registradas'
                                                    })}
                                                </h3>
                                                <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: 'Agrega una dirección para continuar',
                                                        jóvenes: 'Agrega tu primera dirección',
                                                        adultos: 'Agregue una dirección para continuar con su pedido'
                                                    })}
                                                </p>
                                                <button
                                                    onClick={() => setShowForm(true)}
                                                    className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${getModeClasses()}`}
                                                >
                                                    {getTextByMode({
                                                        niños: '➕ Agregar mi primera dirección',
                                                        jóvenes: 'Agregar Dirección',
                                                        adultos: 'Agregar Nueva Dirección'
                                                    })}
                                                </button>
                                            </div>
                                        )}
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
                                            niños: '💰 Tu Pedido',
                                            jóvenes: 'Resumen',
                                            adultos: 'Resumen del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🧾 Total', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
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
                                            onClick={continuarAlPago}
                                            disabled={!direccionSeleccionada || processing}
                                            className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center ${
                                                direccionSeleccionada && !processing
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            } ${getModeClasses()}`}
                                        >
                                            {processing ? (
                                                getTextByMode({
                                                    niños: '⏳ Procesando...',
                                                    jóvenes: 'Procesando...',
                                                    adultos: 'Procesando...'
                                                })
                                            ) : (
                                                getTextByMode({
                                                    niños: '💳 ¡Continuar al Pago!',
                                                    jóvenes: 'Continuar al Pago',
                                                    adultos: 'Continuar al Pago'
                                                })
                                            )}
                                        </button>

                                        <button
                                            onClick={() => router.get('/checkout')}
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Regresar',
                                                jóvenes: 'Volver al Resumen',
                                                adultos: 'Volver al Resumen'
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