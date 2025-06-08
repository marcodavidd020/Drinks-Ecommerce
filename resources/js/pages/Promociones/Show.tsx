import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

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
    pivot: {
        descuento_porcentaje?: number;
        descuento_fijo?: number;
    };
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'activa' | 'inactiva';
    estado_calculado: 'activa' | 'inactiva' | 'pendiente' | 'vencida';
    productos: Producto[];
    productos_count: number;
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

    const calcularPrecioConDescuento = (producto: Producto) => {
        if (producto.pivot.descuento_porcentaje && producto.pivot.descuento_porcentaje > 0) {
            return producto.precio_venta * (1 - producto.pivot.descuento_porcentaje / 100);
        } else if (producto.pivot.descuento_fijo && producto.pivot.descuento_fijo > 0) {
            return Math.max(0, producto.precio_venta - producto.pivot.descuento_fijo);
        }
        return producto.precio_venta;
    };

    const calcularAhorro = (producto: Producto) => {
        return producto.precio_venta - calcularPrecioConDescuento(producto);
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
                                {getEstadoBadge(promocion.estado_calculado)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {getTextByMode({
                                    niños: `¡Esta promoción tiene ${promocion.productos_count} productos con descuentos especiales!`,
                                    jóvenes: `Promoción con ${promocion.productos_count} productos incluidos`,
                                    adultos: `Promoción que incluye ${promocion.productos_count} productos con descuentos especiales`,
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
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(promocion.fecha_inicio)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🏁 Fecha de fin',
                                    jóvenes: 'Fecha de fin',
                                    adultos: 'Fecha de Finalización',
                                })}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(promocion.fecha_fin)}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🚦 Estado configurado',
                                    jóvenes: 'Estado configurado',
                                    adultos: 'Estado Configurado',
                                })}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {promocion.estado === 'activa' ? '🟢 Activa' : '⚫ Inactiva'}
                            </dd>
                        </div>

                        <div>
                            <dt className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📊 Productos incluidos',
                                    jóvenes: 'Productos incluidos',
                                    adultos: 'Productos Incluidos',
                                })}
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {promocion.productos_count} {promocion.productos_count === 1 ? 'producto' : 'productos'}
                            </dd>
                        </div>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🛍️ Productos en Promoción',
                            jóvenes: 'Productos Incluidos',
                            adultos: 'Productos Incluidos en la Promoción',
                        })}
                    </h2>

                    {promocion.productos.length > 0 ? (
                        <div className="space-y-4">
                            {promocion.productos.map((producto) => (
                                <div key={producto.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                {producto.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {producto.cod_producto}
                                                {producto.categoria && ` | ${producto.categoria.nombre}`}
                                            </p>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(calcularPrecioConDescuento(producto))}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                {formatCurrency(producto.precio_venta)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <dt className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '💰 Precio original',
                                                    jóvenes: 'Precio original',
                                                    adultos: 'Precio Original',
                                                })}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {formatCurrency(producto.precio_venta)}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '🎯 Descuento aplicado',
                                                    jóvenes: 'Descuento aplicado',
                                                    adultos: 'Descuento Aplicado',
                                                })}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                {producto.pivot.descuento_porcentaje
                                                    ? `${producto.pivot.descuento_porcentaje}%`
                                                    : formatCurrency(producto.pivot.descuento_fijo || 0)}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '💸 Ahorro total',
                                                    jóvenes: 'Ahorro total',
                                                    adultos: 'Ahorro Total',
                                                })}
                                            </dt>
                                            <dd className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(calcularAhorro(producto))}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-2">
                                {settings.ageMode === 'niños' ? '😔' : '🛍️'}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {getTextByMode({
                                    niños: '¡Esta promoción no tiene productos todavía!',
                                    jóvenes: 'No hay productos en esta promoción',
                                    adultos: 'Esta promoción no tiene productos asociados',
                                })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Información de Auditoría */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                    <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📅 Información de Fechas',
                            jóvenes: 'Información de Auditoría',
                            adultos: 'Información de Auditoría',
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
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
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
                            <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(promocion.updated_at)}
                            </dd>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 