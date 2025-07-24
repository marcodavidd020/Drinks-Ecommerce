import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    Download,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    ArrowLeft,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Helper function to generate correct URLs for production
const getAppUrl = (path: string) => {
    const appUrl = import.meta.env.PROD 
        ? '/inf513/grupo21sc/Drinks-Ecommerce/public' 
        : '';
    return appUrl + path;
};

interface Sale {
    id: number;
    fecha: string;
    total: number;
    estado: string;
    cliente: {
        user: {
            nombre: string;
        } | null;
    } | null;
    detalles: Array<{
        id: number;
        producto_almacen: {
            producto: {
                nombre: string;
            };
        };
    }>;
}

interface SalesStats {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
}

interface CategorySale {
    categoria: string;
    total: number;
}

interface Filters {
    start_date: string;
    end_date: string;
    [key: string]: string; // Add index signature for TypeScript compatibility
}

interface SalesReportProps {
    sales: Sale[];
    salesStats: SalesStats;
    salesByCategory: CategorySale[];
    filters: Filters;
}

export default function SalesReport({
    sales,
    salesStats,
    salesByCategory,
    filters
}: SalesReportProps) {
    const { settings } = useAppMode();
    const [localFilters, setLocalFilters] = useState(filters);

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

    const handleFilterChange = (field: keyof Filters, value: string) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        router.get(getAppUrl('/reports/sales'), localFilters, {
            preserveState: true,
        });
    };

    const resetFilters = () => {
        setLocalFilters({
            start_date: '',
            end_date: '',
        });
        router.get(getAppUrl('/reports/sales'), {}, {
            preserveState: true,
        });
    };

    const downloadPDF = () => {
        window.open(`${getAppUrl('/reports/sales/pdf')}?${new URLSearchParams(localFilters).toString()}`, '_blank');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'pendiente': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'Pendiente' },
            'completada': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Completada' },
            'cancelada': { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Cancelada' },
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    // Preparar datos para las gráficas
    const categoryChartData = {
        labels: salesByCategory.map(cat => cat.categoria),
        datasets: [
            {
                label: getTextByMode({
                    niños: 'Ventas por Categoría',
                    jóvenes: 'Ventas por Categoría',
                    adultos: 'Ventas por Categoría'
                }),
                data: salesByCategory.map(cat => cat.total),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Gráfico de tendencias de ventas por fecha
    const salesByDate = sales.reduce((acc, sale) => {
        const date = formatDate(sale.fecha);
        acc[date] = (acc[date] || 0) + sale.total;
        return acc;
    }, {} as Record<string, number>);

    const trendChartData = {
        labels: Object.keys(salesByDate).slice(-10), // Últimas 10 fechas
        datasets: [
            {
                label: getTextByMode({
                    niños: 'Tendencia de Ventas',
                    jóvenes: 'Tendencia de Ventas',
                    adultos: 'Tendencia de Ventas'
                }),
                data: Object.values(salesByDate).slice(-10),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Gráfico de dona para distribución de estados
    const salesByStatus = sales.reduce((acc, sale) => {
        acc[sale.estado] = (acc[sale.estado] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusChartData = {
        labels: Object.keys(salesByStatus).map(status => {
            const statusMap = {
                'pendiente': 'Pendiente',
                'completada': 'Completada',
                'cancelada': 'Cancelada'
            };
            return statusMap[status as keyof typeof statusMap] || status;
        }),
        datasets: [
            {
                data: Object.values(salesByStatus),
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(245, 158, 11, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: settings.currentTheme === 'noche' ? '#f3f4f6' : '#374151',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: settings.currentTheme === 'noche' ? '#f3f4f6' : '#374151',
                },
                grid: {
                    color: settings.currentTheme === 'noche' ? '#374151' : '#e5e7eb',
                },
            },
            x: {
                ticks: {
                    color: settings.currentTheme === 'noche' ? '#f3f4f6' : '#374151',
                },
                grid: {
                    color: settings.currentTheme === 'noche' ? '#374151' : '#e5e7eb',
                },
            },
        },
    };

    const lineChartOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                ticks: {
                    ...chartOptions.scales.y.ticks,
                    callback: function(value: any) {
                        return 'Bs ' + value.toLocaleString();
                    }
                }
            }
        }
    };

    const title = getTextByMode({
        niños: '📊 Reporte de Ventas',
        jóvenes: '📊 Reporte de Ventas',
        adultos: 'Reporte de Ventas'
    });

    return (
        <DashboardLayout title={title}>
            <Head title={title} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href={getAppUrl('/reports')}>
                            <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {getTextByMode({
                                    niños: 'Volver a Reportes',
                                    jóvenes: 'Volver a Reportes',
                                    adultos: 'Volver a Reportes'
                                })}
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                {getTextByMode({
                                    niños: '¡Mira cuántas bebidas hemos vendido!',
                                    jóvenes: 'Análisis detallado de las ventas',
                                    adultos: 'Análisis detallado de las ventas realizadas'
                                })}
                            </p>
                        </div>
                        <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
                            <Download className="h-4 w-4 mr-2" />
                            {getTextByMode({
                                niños: 'Descargar PDF',
                                jóvenes: 'Descargar PDF',
                                adultos: 'Descargar PDF'
                            })}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold">
                            {getTextByMode({
                                niños: 'Filtros Súper Útiles',
                                jóvenes: 'Filtros de Búsqueda',
                                adultos: 'Filtros de Búsqueda'
                            })}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {getTextByMode({
                                    niños: 'Desde cuándo',
                                    jóvenes: 'Fecha de inicio',
                                    adultos: 'Fecha de inicio'
                                })}
                            </label>
                            <Input
                                type="date"
                                value={localFilters.start_date}
                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {getTextByMode({
                                    niños: 'Hasta cuándo',
                                    jóvenes: 'Fecha de fin',
                                    adultos: 'Fecha de fin'
                                })}
                            </label>
                            <Input
                                type="date"
                                value={localFilters.end_date}
                                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                                {getTextByMode({
                                    niños: 'Buscar',
                                    jóvenes: 'Aplicar',
                                    adultos: 'Aplicar Filtros'
                                })}
                            </Button>
                            <Button variant="outline" onClick={resetFilters}>
                                {getTextByMode({
                                    niños: 'Limpiar',
                                    jóvenes: 'Limpiar',
                                    adultos: 'Limpiar'
                                })}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Dinero Total Ganado',
                                        jóvenes: 'Total Vendido',
                                        adultos: 'Total de Ventas'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">Bs {salesStats.total_sales.toLocaleString()}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Ventas Realizadas',
                                        jóvenes: 'Total de Órdenes',
                                        adultos: 'Total de Órdenes'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{salesStats.total_orders}</p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Promedio por Venta',
                                        jóvenes: 'Promedio por Orden',
                                        adultos: 'Promedio por Orden'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">Bs {salesStats.average_order_value.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-200" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Gráfico de barras - Ventas por categoría */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📊 Ventas por Tipo de Bebida',
                                jóvenes: '📊 Ventas por Categoría',
                                adultos: 'Ventas por Categoría'
                            })}
                        </h3>
                        <div className="h-80">
                            <Bar data={categoryChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Gráfico de línea - Tendencia de ventas */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📈 Tendencia de Ventas',
                                jóvenes: '📈 Tendencia de Ventas',
                                adultos: 'Tendencia de Ventas'
                            })}
                        </h3>
                        <div className="h-80">
                            <Line data={trendChartData} options={lineChartOptions} />
                        </div>
                    </div>
                </div>

                {/* Gráfico de dona - Estados de ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
                    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🍩 Estados de las Ventas',
                            jóvenes: '🍩 Distribución por Estado',
                            adultos: 'Distribución por Estado'
                        })}
                    </h3>
                    <div className="flex justify-center">
                        <div className="w-80 h-80">
                            <Doughnut data={statusChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Sales by Category Cards */}
                {salesByCategory.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🏷️ Detalle por Tipo de Bebida',
                                jóvenes: '🏷️ Detalle por Categoría',
                                adultos: 'Detalle por Categoría'
                            })}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {salesByCategory.map((category, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {category.categoria}
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                            Bs {category.total.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500">
                                            {salesStats.total_sales > 0 ?
                                                ((category.total / salesStats.total_sales) * 100).toFixed(1)
                                                : 0}% del total
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sales Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📋 Lista de Todas las Ventas',
                                jóvenes: '📋 Detalle de Ventas',
                                adultos: 'Detalle de Ventas'
                            })}
                        </h3>
                    </div>

                    {sales.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Cuándo',
                                                jóvenes: 'Fecha',
                                                adultos: 'Fecha'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Cliente',
                                                jóvenes: 'Cliente',
                                                adultos: 'Cliente'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Bebidas',
                                                jóvenes: 'Productos',
                                                adultos: 'Productos'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Total',
                                                jóvenes: 'Total',
                                                adultos: 'Total'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Estado',
                                                jóvenes: 'Estado',
                                                adultos: 'Estado'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {sales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {formatDate(sale.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {sale.cliente?.user?.nombre || 'Cliente eliminado'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                                                {sale.detalles?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                                                Bs {sale.total.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStatusBadge(sale.estado)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {getTextByMode({
                                    niños: 'No hay ventas',
                                    jóvenes: 'Sin ventas',
                                    adultos: 'Sin ventas'
                                })}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {getTextByMode({
                                    niños: 'No hemos vendido bebidas en estas fechas',
                                    jóvenes: 'No se encontraron ventas en el período seleccionado',
                                    adultos: 'No se encontraron ventas en el período seleccionado'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
} 