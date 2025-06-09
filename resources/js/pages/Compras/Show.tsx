import { InfoCard, ShowHeader } from '@/components/Show';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    categoria?: {
        id: number;
        nombre: string;
    };
}

interface DetalleCompra {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: Producto;
}

interface Compra {
    id: number;
    fecha: string;
    total: number;
    estado: 'pendiente' | 'recibida' | 'cancelada';
    observaciones?: string;
    proveedor: {
        id: number;
        nombre: string;
        email?: string;
        telefono?: string;
        direccion?: string;
    };
    detalles: DetalleCompra[];
    created_at: string;
    updated_at: string;
}

interface ComprasShowProps {
    compra: Compra;
}

export default function ComprasShow({ compra }: ComprasShowProps) {
    const { getTextByMode } = useAppModeText();

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

    const getEstadoBadge = (estado: string) => {
        const badges = {
            pendiente: { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', text: '⏳ Pendiente' },
            recibida: { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', text: '✅ Recibida' },
            cancelada: { class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', text: '❌ Cancelada' },
        };

        const badge = badges[estado as keyof typeof badges];
        return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${badge.class}`}>{badge.text}</span>;
    };

    const calcularTotalProductos = () => {
        return compra.detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: 'Detalle de Compra',
                jóvenes: 'Detalle de Compra',
                adultos: 'Detalle de Compra',
            })}
        >

            <Head
                title={getTextByMode({
                    niños: `🛍️ Compra #${compra.id}`,
                    jóvenes: `Compra #${compra.id}`,
                    adultos: `Compra #${compra.id}`,
                })}
            />

            <ShowHeader
                title={getTextByMode({
                    niños: `🛍️ Compra #${compra.id}`,
                    jóvenes: `Compra #${compra.id}`,
                    adultos: `Compra #${compra.id}`,
                })}
                description={getTextByMode({
                    niños: `Detalles completos de la compra realizada el ${formatDate(compra.fecha)}`,
                    jóvenes: `Detalles de la compra del ${formatDate(compra.fecha)}`,
                    adultos: `Información detallada de la compra realizada el ${formatDate(compra.fecha)}`,
                })}
                backHref={route('compras.index')}
                editHref={route('compras.edit', compra.id)}
            />

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Información Principal */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Datos Generales */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '📋 Información General',
                            jóvenes: 'Información General',
                            adultos: 'Información General de la Compra',
                        })}
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '🔢 ID de Compra',
                                        jóvenes: 'ID de Compra',
                                        adultos: 'ID de Compra',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">#{compra.id}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📅 Fecha de Compra',
                                        jóvenes: 'Fecha de Compra',
                                        adultos: 'Fecha de Compra',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(compra.fecha)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📊 Estado',
                                        jóvenes: 'Estado',
                                        adultos: 'Estado',
                                    })}
                                </dt>
                                <dd className="mt-1">{getEstadoBadge(compra.estado)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '💰 Total de la Compra',
                                        jóvenes: 'Total de la Compra',
                                        adultos: 'Total de la Compra',
                                    })}
                                </dt>
                                <dd className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(compra.total)}
                                </dd>
                            </div>

                            <div className="md:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📊 Resumen',
                                        jóvenes: 'Resumen',
                                        adultos: 'Resumen',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: `${compra.detalles.length} ${compra.detalles.length === 1 ? '🛍️ producto súper genial' : '🛍️ productos súper geniales'} • ${calcularTotalProductos()} 📦 unidades en total`,
                                        jóvenes: `${compra.detalles.length} ${compra.detalles.length === 1 ? 'producto diferente' : 'productos diferentes'} • ${calcularTotalProductos()} unidades totales`,
                                        adultos: `${compra.detalles.length} ${compra.detalles.length === 1 ? 'tipo de producto' : 'tipos de productos'} • ${calcularTotalProductos()} unidades totales`,
                                    })}
                                </dd>
                            </div>

                            {compra.observaciones && (
                                <div className="md:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '📝 Observaciones',
                                            jóvenes: 'Observaciones',
                                            adultos: 'Observaciones',
                                        })}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{compra.observaciones}</dd>
                                </div>
                            )}
                        </div>
                    </InfoCard>

                    {/* Lista de Productos */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '🛒 Productos Comprados',
                            jóvenes: 'Productos Comprados',
                            adultos: 'Productos Incluidos en la Compra',
                        })}
                    >
                        {compra.detalles.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                {getTextByMode({
                                                    niños: '📦 Producto',
                                                    jóvenes: 'Producto',
                                                    adultos: 'Producto',
                                                })}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                {getTextByMode({
                                                    niños: '🔢 Cantidad',
                                                    jóvenes: 'Cantidad',
                                                    adultos: 'Cantidad',
                                                })}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                {getTextByMode({
                                                    niños: '💰 Precio Unit.',
                                                    jóvenes: 'Precio Unitario',
                                                    adultos: 'Precio Unitario',
                                                })}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                {getTextByMode({
                                                    niños: '💵 Subtotal',
                                                    jóvenes: 'Subtotal',
                                                    adultos: 'Subtotal',
                                                })}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {compra.detalles.map((detalle) => (
                                            <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {detalle.producto.nombre}
                                                        </div>
                                                        {detalle.producto.categoria && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {detalle.producto.categoria.nombre}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {detalle.cantidad}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {formatCurrency(detalle.precio_unitario)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(detalle.subtotal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                {getTextByMode({
                                    niños: '😔 No hay productos en esta compra',
                                    jóvenes: 'No hay productos registrados',
                                    adultos: 'No hay productos registrados en esta compra',
                                })}
                            </div>
                        )}
                    </InfoCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Información del Proveedor */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '🏪 Proveedor',
                            jóvenes: 'Proveedor',
                            adultos: 'Información del Proveedor',
                        })}
                    >
                        <div className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '🏷️ Nombre',
                                        jóvenes: 'Nombre',
                                        adultos: 'Nombre',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{compra.proveedor.nombre}</dd>
                            </div>

                            {compra.proveedor.email && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '📧 Email',
                                            jóvenes: 'Email',
                                            adultos: 'Correo Electrónico',
                                        })}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        <a
                                            href={`mailto:${compra.proveedor.email}`}
                                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {compra.proveedor.email}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {compra.proveedor.telefono && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '📞 Teléfono',
                                            jóvenes: 'Teléfono',
                                            adultos: 'Teléfono',
                                        })}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                        <a
                                            href={`tel:${compra.proveedor.telefono}`}
                                            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {compra.proveedor.telefono}
                                        </a>
                                    </dd>
                                </div>
                            )}

                            {compra.proveedor.direccion && (
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '📍 Dirección',
                                            jóvenes: 'Dirección',
                                            adultos: 'Dirección',
                                        })}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{compra.proveedor.direccion}</dd>
                                </div>
                            )}
                        </div>
                    </InfoCard>

                    {/* Resumen Financiero */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '💰 Resumen Financiero',
                            jóvenes: 'Resumen Financiero',
                            adultos: 'Resumen Financiero',
                        })}
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📦 Productos',
                                        jóvenes: 'Productos',
                                        adultos: 'Total Productos',
                                    })}
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-gray-100">{compra.detalles.length}</dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '🔢 Unidades',
                                        jóvenes: 'Unidades',
                                        adultos: 'Total Unidades',
                                    })}
                                </dt>
                                <dd className="text-sm text-gray-900 dark:text-gray-100">{calcularTotalProductos()}</dd>
                            </div>

                            <div className="border-t border-gray-200 pt-4 dark:border-gray-600">
                                <div className="flex justify-between">
                                    <dt className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                        {getTextByMode({
                                            niños: '💰 Total',
                                            jóvenes: 'Total',
                                            adultos: 'Total',
                                        })}
                                    </dt>
                                    <dd className="text-base font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(compra.total)}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </InfoCard>

                    {/* Metadatos */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '🕒 Información del Sistema',
                            jóvenes: 'Información del Sistema',
                            adultos: 'Información del Sistema',
                        })}
                    >
                        <div className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📅 Creado',
                                        jóvenes: 'Creado',
                                        adultos: 'Fecha de Creación',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(compra.created_at)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '🔄 Actualizado',
                                        jóvenes: 'Actualizado',
                                        adultos: 'Última Actualización',
                                    })}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatDate(compra.updated_at)}</dd>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
