import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { formatCurrency } from '@/lib/currency';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    categoria?: Categoria;
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    descuento: string;
    estado_calculado?: 'activa' | 'inactiva' | 'pendiente' | 'vencida';
    producto: Producto;
    created_at: string;
    updated_at: string;
}

interface PromocionShowProps {
    promocion: Promocion;
}

export default function PromocionShow({ promocion }: PromocionShowProps) {
    const { settings } = useAppMode();

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Extraer porcentaje del texto del descuento
    const extraerPorcentaje = (descuentoTexto: string): number => {
        const match = descuentoTexto.match(/(\d+(?:\.\d+)?)%/);
        return match ? parseFloat(match[1]) : 0;
    };

    // Extraer monto fijo del texto del descuento
    const extraerMontoFijo = (descuentoTexto: string): number => {
        const matches = [
            /\$\s*(\d+(?:\.\d+)?)/,  // $5.50
            /(\d+(?:\.\d+)?)\s*pesos/i,  // 5 pesos
            /(\d+(?:\.\d+)?)\s*bs/i,     // 5 bs
            /(\d+(?:\.\d+)?)\s*bolivianos/i // 5 bolivianos
        ];
        
        for (const regex of matches) {
            const match = descuentoTexto.match(regex);
            if (match) {
                return parseFloat(match[1]);
            }
        }
        return 0;
    };

    const getEstadoBadge = (estadoCalculado: string) => {
        const estadoConfig = {
            activa: {
                class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
                icon: '🟢',
                text: getTextByMode({
                    niños: '¡Activa!',
                    jóvenes: 'Activa',
                    adultos: 'Activa',
                }),
            },
            inactiva: {
                class: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
                icon: '⚫',
                text: getTextByMode({
                    niños: 'Pausada',
                    jóvenes: 'Inactiva',
                    adultos: 'Inactiva',
                }),
            },
            pendiente: {
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
                icon: '🟡',
                text: getTextByMode({
                    niños: '¡Próximamente!',
                    jóvenes: 'Pendiente',
                    adultos: 'Pendiente',
                }),
            },
            vencida: {
                class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
                icon: '🔴',
                text: getTextByMode({
                    niños: 'Terminada',
                    jóvenes: 'Vencida',
                    adultos: 'Vencida',
                }),
            },
        };

        const config = estadoConfig[estadoCalculado as keyof typeof estadoConfig] || estadoConfig.inactiva;

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.class}`}>
                <span className="mr-2">{config.icon}</span>
                {config.text}
            </span>
        );
    };

    const calcularPrecioConDescuento = () => {
        const porcentaje = extraerPorcentaje(promocion.descuento);
        const montoFijo = extraerMontoFijo(promocion.descuento);
        
        if (porcentaje > 0) {
            return promocion.producto.precio_venta * (1 - porcentaje / 100);
        } else if (montoFijo > 0) {
            return Math.max(0, promocion.producto.precio_venta - montoFijo);
        }
        
        return promocion.producto.precio_venta;
    };

    const calcularAhorro = () => {
        return promocion.producto.precio_venta - calcularPrecioConDescuento();
    };

    const obtenerDescripcionDescuento = () => {
        const porcentaje = extraerPorcentaje(promocion.descuento);
        const montoFijo = extraerMontoFijo(promocion.descuento);
        
        if (porcentaje > 0) {
            return `${porcentaje}%`;
        } else if (montoFijo > 0) {
            return formatCurrency(montoFijo);
        } else {
            return promocion.descuento || 'No especificado';
        }
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🏷️ Detalles de Promoción',
                jóvenes: 'Detalles de Promoción',
                adultos: 'Detalles de la Promoción',
            })}
        >
            <Head title={`Promoción: ${promocion.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {promocion.nombre}
                                </h1>
                                {getEstadoBadge(promocion.estado_calculado || 'activa')}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getTextByMode({
                                    niños: `¡Esta promoción tiene un descuento para ${promocion.producto.nombre}!`,
                                    jóvenes: `Promoción con descuento`,
                                    adultos: `Promoción con descuento para ${promocion.producto.nombre}`,
                                })}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <a
                                href={`/promociones/${promocion.id}/edit`}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getModeClasses()}`}
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {getTextByMode({
                                    niños: '✏️ Editar',
                                    jóvenes: 'Editar',
                                    adultos: 'Editar Promoción',
                                })}
                            </a>
                            <a
                                href="/promociones"
                                className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getModeClasses()}`}
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                {getTextByMode({
                                    niños: '🔙 Volver',
                                    jóvenes: 'Volver',
                                    adultos: 'Volver a la Lista',
                                })}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Información General */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📋 Información de la Promoción',
                            jóvenes: 'Información General',
                            adultos: 'Información General',
                        })}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📅 Fecha de inicio',
                                    jóvenes: 'Fecha de inicio',
                                    adultos: 'Fecha de Inicio',
                                })}
                            </dt>
                            <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {formatDate(promocion.fecha_inicio)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🏁 Fecha de fin',
                                    jóvenes: 'Fecha de fin',
                                    adultos: 'Fecha de Fin',
                                })}
                            </dt>
                            <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {formatDate(promocion.fecha_fin)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🚦 Estado actual',
                                    jóvenes: 'Estado',
                                    adultos: 'Estado Actual',
                                })}
                            </dt>
                            <dd className="mt-1">
                                {getEstadoBadge(promocion.estado_calculado || 'activa')}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '💰 Descuento',
                                    jóvenes: 'Descuento',
                                    adultos: 'Descuento',
                                })}
                            </dt>
                            <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {obtenerDescripcionDescuento()}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Información del Producto */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🛍️ Producto en Promoción',
                            jóvenes: 'Producto',
                            adultos: 'Producto en Promoción',
                        })}
                    </h2>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {promocion.producto.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {promocion.producto.cod_producto}
                                    {promocion.producto.categoria && ` | ${promocion.producto.categoria.nombre}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(calcularPrecioConDescuento())}
                                </div>
                                {calcularAhorro() > 0 && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                        {formatCurrency(promocion.producto.precio_venta)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información de Precios */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '💰 Información de Precios',
                            jóvenes: 'Precios',
                            adultos: 'Información de Precios',
                        })}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '💰 Precio original',
                                    jóvenes: 'Precio original',
                                    adultos: 'Precio Original',
                                })}
                            </dt>
                            <dd className={`mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {formatCurrency(promocion.producto.precio_venta)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎯 Descuento aplicado',
                                    jóvenes: 'Descuento',
                                    adultos: 'Descuento Aplicado',
                                })}
                            </dt>
                            <dd className={`mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                {obtenerDescripcionDescuento()}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '💸 Ahorro total',
                                    jóvenes: 'Ahorro',
                                    adultos: 'Ahorro Total',
                                })}
                            </dt>
                            <dd className={`mt-1 text-lg font-semibold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                {calcularAhorro() > 0 ? formatCurrency(calcularAhorro()) : 'Sin ahorro'}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Descripción del Descuento */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📝 Descripción del Descuento',
                            jóvenes: 'Descripción',
                            adultos: 'Descripción del Descuento',
                        })}
                    </h2>
                    <p className={`text-sm text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                        {promocion.descuento || 'No hay descripción disponible'}
                    </p>
                </div>

                {/* Información de Fechas */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📅 Información de Fechas',
                            jóvenes: 'Fechas',
                            adultos: 'Información de Fechas',
                        })}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📅 Creada el',
                                    jóvenes: 'Fecha de creación',
                                    adultos: 'Fecha de Creación',
                                })}
                            </dt>
                            <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {formatDate(promocion.created_at)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔄 Última actualización',
                                    jóvenes: 'Última actualización',
                                    adultos: 'Última Actualización',
                                })}
                            </dt>
                            <dd className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {formatDate(promocion.updated_at)}
                            </dd>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 