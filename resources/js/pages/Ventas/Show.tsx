import { InfoCard, ShowHeader } from '@/components/Show';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    categoria?: Categoria;
}

interface DetalleVenta {
    id: number;
    producto: Producto;
    cantidad: number;
    precio_unitario: number;
    total: number;
}

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    nit: string;
}

interface Venta {
    id: number;
    fecha: string;
    fecha_formateada: string;
    total: number;
    estado: 'pendiente' | 'completada' | 'cancelada';
    observaciones?: string;
    total_productos: number;
    cliente: Cliente;
    detalles: DetalleVenta[];
    created_at: string;
    updated_at: string;
}

interface VentaShowProps {
    venta: Venta;
}

export default function VentaShow({ venta }: VentaShowProps) {
    const { settings } = useAppMode();
    const [isUpdating, setIsUpdating] = useState(false);

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

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'completada':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'cancelada':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const handleChangeEstado = (estado: string) => {
        if (isUpdating) return;

        if (confirm(`¿Está seguro de cambiar el estado de la venta a "${estado}"?`)) {
            setIsUpdating(true);
            router.post(
                `/ventas/${venta.id}/estado`,
                { estado },
                {
                    onSuccess: () => {
                        setIsUpdating(false);
                    },
                    onError: () => {
                        setIsUpdating(false);
                        alert('Ha ocurrido un error al cambiar el estado de la venta.');
                    },
                }
            );
        }
    };

    // Campos para la sección de información básica
    const basicInfoFields = [
        {
            label: getTextByMode({
                niños: '🔢 Número de Venta',
                jóvenes: 'Número de Venta',
                adultos: 'Número de Venta',
            }),
            value: `#${venta.id.toString().padStart(6, '0')}`,
        },
        {
            label: getTextByMode({
                niños: '👤 Cliente',
                jóvenes: 'Cliente',
                adultos: 'Cliente',
            }),
            value: (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {venta.cliente.nombre}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {venta.cliente.email}
                        {venta.cliente.nit && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                NIT: {venta.cliente.nit}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📅 Fecha',
                jóvenes: 'Fecha',
                adultos: 'Fecha de Venta',
            }),
            value: venta.fecha_formateada || formatDate(venta.fecha),
        },
        {
            label: getTextByMode({
                niños: '🚦 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            }),
            value: (
                <div className="flex items-center space-x-2">
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getEstadoColor(venta.estado)}`}
                    >
                        {venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1)}
                    </span>
                    
                    {venta.estado !== 'completada' && (
                        <button
                            type="button"
                            onClick={() => handleChangeEstado('completada')}
                            disabled={isUpdating}
                            className="ml-2 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:hover:bg-green-900/20"
                        >
                            Completar
                        </button>
                    )}
                    
                    {venta.estado !== 'cancelada' && (
                        <button
                            type="button"
                            onClick={() => handleChangeEstado('cancelada')}
                            disabled={isUpdating}
                            className="ml-2 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📦 Productos',
                jóvenes: 'Productos',
                adultos: 'Cantidad de Productos',
            }),
            value: (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        venta.total_productos > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    {venta.total_productos}{' '}
                    {getTextByMode({
                        niños: venta.total_productos === 1 ? 'producto' : 'productos',
                        jóvenes: 'prod.',
                        adultos: 'unidades',
                    })}
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '💰 Total',
                jóvenes: 'Valor Total',
                adultos: 'Valor Total',
            }),
            value: (
                <span className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(venta.total)}
                </span>
            ),
        },
        {
            label: getTextByMode({
                niños: '📝 Observaciones',
                jóvenes: 'Observaciones',
                adultos: 'Observaciones',
            }),
            value:
                venta.observaciones ||
                getTextByMode({
                    niños: '¡No hay observaciones!',
                    jóvenes: 'Sin observaciones',
                    adultos: 'No hay observaciones disponibles',
                }),
            span: 2 as const,
        },
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📝 Detalle de Venta',
                jóvenes: 'Detalle de Venta',
                adultos: 'Detalle de Venta',
            })}
        >
            <Head title={`Venta #${venta.id}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: `📝 ¡Venta #${venta.id.toString().padStart(6, '0')}!`,
                        jóvenes: `Venta #${venta.id.toString().padStart(6, '0')}`,
                        adultos: `Venta #${venta.id.toString().padStart(6, '0')}`,
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todos los detalles de esta venta!',
                        jóvenes: 'Información detallada de la venta',
                        adultos: 'Información detallada de la operación de venta',
                    })}
                    backHref="/ventas"
                    backText={getTextByMode({
                        niños: '¡Volver a ventas!',
                        jóvenes: 'Volver a ventas',
                        adultos: 'Volver a ventas',
                    })}
                />

                <InfoCard
                    title={getTextByMode({
                        niños: '📋 Información Básica',
                        jóvenes: 'Información de la Venta',
                        adultos: 'Información de la Venta',
                    })}
                    fields={basicInfoFields}
                />

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className={`mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📦 Productos Vendidos',
                            jóvenes: 'Productos Vendidos',
                            adultos: 'Detalle de Productos',
                        })}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '📦 Producto',
                                            jóvenes: 'Producto',
                                            adultos: 'Producto',
                                        })}
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '🔢 Cantidad',
                                            jóvenes: 'Cantidad',
                                            adultos: 'Cantidad',
                                        })}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '💰 Precio',
                                            jóvenes: 'Precio Unitario',
                                            adultos: 'Precio Unitario',
                                        })}
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '💰 Total',
                                            jóvenes: 'Total',
                                            adultos: 'Subtotal',
                                        })}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {venta.detalles.map((detalle) => (
                                    <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {detalle.producto.nombre}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {detalle.producto.cod_producto}
                                                {detalle.producto.categoria && (
                                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {detalle.producto.categoria.nombre}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm">
                                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {detalle.cantidad} {detalle.cantidad === 1 ? 'unidad' : 'unidades'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                                            {formatCurrency(detalle.precio_unitario)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(detalle.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100"
                                    >
                                        {getTextByMode({
                                            niños: '📊 Total Productos:',
                                            jóvenes: 'Total Productos:',
                                            adultos: 'Total Productos:',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-100">
                                        {venta.total_productos}
                                    </td>
                                    <td className="px-6 py-4 text-right text-base font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(venta.total)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 