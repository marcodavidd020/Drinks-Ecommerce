import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, Download, Eye } from 'lucide-react';

interface Stats {
    total_sales: number;
    total_purchases: number;
    total_products: number;
    total_clients: number;
    low_stock_products: number;
}

interface ReportsIndexProps {
    stats: Stats;
}

export default function ReportsIndex({ stats }: ReportsIndexProps) {
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

    const reports = [
        {
            title: getTextByMode({
                niños: '💰 Reportes de Ventas Geniales',
                jóvenes: '💰 Reportes de Ventas',
                adultos: 'Reportes de Ventas'
            }),
            description: getTextByMode({
                niños: 'Ve cuánto hemos vendido de bebidas súper ricas',
                jóvenes: 'Análisis completo de ventas y rendimiento',
                adultos: 'Análisis detallado de ventas por período, categorías y clientes'
            }),
            icon: BarChart3,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            viewHref: '/reports/sales',
            pdfHref: '/reports/sales/pdf',
            stats: `$${stats.total_sales.toLocaleString()}`,
            statsLabel: getTextByMode({
                niños: 'Total de Ventas',
                jóvenes: 'Total Ventas',
                adultos: 'Total de Ventas'
            })
        },
        {
            title: getTextByMode({
                niños: '📦 Inventario de Bebidas',
                jóvenes: '📦 Reportes de Inventario',
                adultos: 'Reportes de Inventario'
            }),
            description: getTextByMode({
                niños: 'Mira qué bebidas tenemos y cuáles se están acabando',
                jóvenes: 'Control de stock y productos disponibles',
                adultos: 'Estado actual del inventario, stock bajo y valorización'
            }),
            icon: Package,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            viewHref: '/reports/inventory',
            pdfHref: '/reports/inventory/pdf',
            stats: stats.total_products.toLocaleString(),
            statsLabel: getTextByMode({
                niños: 'Productos',
                jóvenes: 'Total Productos',
                adultos: 'Total de Productos'
            }),
            alert: stats.low_stock_products > 0 ? `${stats.low_stock_products} con stock bajo` : null
        },
        {
            title: getTextByMode({
                niños: '👥 Nuestros Clientes Favoritos',
                jóvenes: '👥 Reportes de Clientes',
                adultos: 'Reportes de Clientes'
            }),
            description: getTextByMode({
                niños: 'Conoce a las personas que más compran bebidas',
                jóvenes: 'Análisis del comportamiento de clientes',
                adultos: 'Análisis de comportamiento, compras y segmentación de clientes'
            }),
            icon: Users,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-200 dark:border-purple-800',
            viewHref: '/reports/clients',
            pdfHref: '/reports/clients/pdf',
            stats: stats.total_clients.toLocaleString(),
            statsLabel: getTextByMode({
                niños: 'Clientes',
                jóvenes: 'Total Clientes',
                adultos: 'Total de Clientes'
            })
        },
        {
            title: getTextByMode({
                niños: '🛒 Compras de Bebidas',
                jóvenes: '🛒 Reportes de Compras',
                adultos: 'Reportes de Compras'
            }),
            description: getTextByMode({
                niños: 'Ve qué bebidas hemos comprado para la tienda',
                jóvenes: 'Historial de compras y proveedores',
                adultos: 'Análisis de compras a proveedores, costos y categorías'
            }),
            icon: ShoppingCart,
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            viewHref: '/reports/purchases',
            pdfHref: '/reports/purchases/pdf',
            stats: `$${stats.total_purchases.toLocaleString()}`,
            statsLabel: getTextByMode({
                niños: 'Total Compras',
                jóvenes: 'Total Compras',
                adultos: 'Total de Compras'
            })
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📊 Reportes Súper Geniales',
                jóvenes: '📊 Centro de Reportes',
                adultos: 'Centro de Reportes'
            })}
        >
            <Head title={getTextByMode({
                niños: 'Reportes Geniales',
                jóvenes: 'Reportes',
                adultos: 'Reportes'
            })} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {getTextByMode({
                            niños: '📊 Reportes Súper Geniales',
                            jóvenes: '📊 Centro de Reportes',
                            adultos: 'Centro de Reportes'
                        })}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {getTextByMode({
                            niños: 'Aquí puedes ver toda la información súper importante de Arturo',
                            jóvenes: 'Genera y visualiza reportes detallados del negocio',
                            adultos: 'Genera y visualiza reportes detallados del negocio con capacidad de exportación a PDF'
                        })}
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Dinero Ganado',
                                        jóvenes: 'Total Vendido',
                                        adultos: 'Total Ventas'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">${stats.total_sales.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Bebidas Diferentes',
                                        jóvenes: 'Productos',
                                        adultos: 'Total Productos'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{stats.total_products}</p>
                            </div>
                            <Package className="h-8 w-8 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Amigos Clientes',
                                        jóvenes: 'Clientes',
                                        adultos: 'Total Clientes'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{stats.total_clients}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Dinero en Compras',
                                        jóvenes: 'Total Comprado',
                                        adultos: 'Total Compras'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">${stats.total_purchases.toLocaleString()}</p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-red-200" />
                        </div>
                    </div>
                </div>

                {/* Alert for Low Stock */}
                {stats.low_stock_products > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-yellow-800 dark:text-yellow-200">
                                    {getTextByMode({
                                        niños: `¡Atención! ${stats.low_stock_products} bebidas se están acabando`,
                                        jóvenes: `Alerta: ${stats.low_stock_products} productos con stock bajo`,
                                        adultos: `Atención: ${stats.low_stock_products} productos requieren reabastecimiento`
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reports.map((report, index) => (
                        <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${report.borderColor} p-6 hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${report.bgColor}`}>
                                        <report.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {report.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {report.stats}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {report.statsLabel}
                                    </span>
                                </div>
                                {report.alert && (
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                        ⚠️ {report.alert}
                                    </p>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <Link
                                    href={report.viewHref}
                                    className={`flex-1 bg-gradient-to-r ${report.color} text-white text-center py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>
                                        {getTextByMode({
                                            niños: 'Ver Reporte',
                                            jóvenes: 'Ver Reporte',
                                            adultos: 'Ver Reporte'
                                        })}
                                    </span>
                                </Link>
                                
                                <a
                                    href={report.pdfHref}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                                    title={getTextByMode({
                                        niños: 'Descargar PDF',
                                        jóvenes: 'Descargar PDF',
                                        adultos: 'Descargar PDF'
                                    })}
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {getTextByMode({
                            niños: '💡 Información Súper Útil',
                            jóvenes: '💡 Información Adicional',
                            adultos: 'Información Adicional'
                        })}
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <p>
                            {getTextByMode({
                                niños: '• Puedes ver los reportes en la pantalla o descargarlos como PDF para imprimirlos',
                                jóvenes: '• Los reportes se pueden visualizar en pantalla o descargar en formato PDF',
                                adultos: '• Todos los reportes pueden visualizarse en pantalla o exportarse a PDF para análisis offline'
                            })}
                        </p>
                        <p>
                            {getTextByMode({
                                niños: '• Los reportes se actualizan automáticamente con la información más nueva',
                                jóvenes: '• Los datos se actualizan en tiempo real con la información más reciente',
                                adultos: '• Los datos se actualizan en tiempo real reflejando la información más reciente del sistema'
                            })}
                        </p>
                        <p>
                            {getTextByMode({
                                niños: '• Puedes cambiar las fechas para ver reportes de diferentes días',
                                jóvenes: '• Utiliza los filtros de fecha para analizar períodos específicos',
                                adultos: '• Utilice los filtros de fecha para generar reportes de períodos específicos según sus necesidades'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 