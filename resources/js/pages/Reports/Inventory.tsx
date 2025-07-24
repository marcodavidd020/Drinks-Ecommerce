import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { useState } from 'react';
import { 
    Package, 
    Download, 
    AlertTriangle, 
    TrendingUp,
    ArrowLeft,
    Filter,
    CheckCircle,
    AlertCircle
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

interface InventoryItem {
    id: number;
    stock: number;
    precio_venta: number;
    producto_nombre: string;
    producto: {
        nombre: string;
        categoria: {
            nombre: string;
        };
    } | null;
    almacen: {
        nombre: string;
    } | null;
}

interface InventoryStats {
    total_products: number;
    total_value: number;
    low_stock_count: number;
}

interface CategoryStock {
    categoria: string;
    stock: number;
}

interface Filters {
    low_stock_threshold: number;
}

interface InventoryReportProps {
    inventory: InventoryItem[];
    inventoryStats: InventoryStats;
    stockByCategory: CategoryStock[];
    lowStockProducts: InventoryItem[];
    filters: Filters;
}

export default function InventoryReport({ 
    inventory, 
    inventoryStats, 
    stockByCategory, 
    lowStockProducts,
    filters 
}: InventoryReportProps) {
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
        setLocalFilters(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    };

    const applyFilters = () => {
        const params = {
            low_stock_threshold: localFilters.low_stock_threshold
        };
        router.get(getAppUrl('/reports/inventory'), params, {
            preserveState: true,
        });
    };

    const resetFilters = () => {
        setLocalFilters({ low_stock_threshold: 10 });
        router.get(getAppUrl('/reports/inventory'), { low_stock_threshold: 10 }, {
            preserveState: true,
        });
    };

    const downloadPDF = () => {
        const params = new URLSearchParams({
            low_stock_threshold: localFilters.low_stock_threshold.toString()
        });
        window.open(`${getAppUrl('/reports/inventory/pdf')}?${params.toString()}`, '_blank');
    };

    const getStockBadge = (stock: number, threshold: number) => {
        if (stock === 0) {
            return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Sin Stock</Badge>;
        } else if (stock <= threshold) {
            return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Bajo Stock</Badge>;
        } else {
            return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">En Stock</Badge>;
        }
    };

    // Preparar datos para las gráficas
    const categoryChartData = {
        labels: stockByCategory.map(cat => cat.categoria),
        datasets: [
            {
                label: getTextByMode({
                    niños: 'Stock por Categoría',
                    jóvenes: 'Stock por Categoría',
                    adultos: 'Stock por Categoría'
                }),
                data: stockByCategory.map(cat => cat.stock),
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

    // Gráfico de productos con bajo stock
    const lowStockChartData = {
        labels: lowStockProducts.slice(0, 10).map(item => item.producto_nombre),
        datasets: [
            {
                label: getTextByMode({
                    niños: 'Productos con Bajo Stock',
                    jóvenes: 'Productos con Bajo Stock',
                    adultos: 'Productos con Bajo Stock'
                }),
                data: lowStockProducts.slice(0, 10).map(item => item.stock),
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Gráfico de dona para distribución de stock
    const stockDistribution = {
        enStock: inventory.filter(item => item.stock > localFilters.low_stock_threshold).length,
        bajoStock: inventory.filter(item => item.stock > 0 && item.stock <= localFilters.low_stock_threshold).length,
        sinStock: inventory.filter(item => item.stock === 0).length,
    };

    const distributionChartData = {
        labels: [
            getTextByMode({
                niños: 'En Stock',
                jóvenes: 'En Stock',
                adultos: 'En Stock'
            }),
            getTextByMode({
                niños: 'Bajo Stock',
                jóvenes: 'Bajo Stock',
                adultos: 'Bajo Stock'
            }),
            getTextByMode({
                niños: 'Sin Stock',
                jóvenes: 'Sin Stock',
                adultos: 'Sin Stock'
            }),
        ],
        datasets: [
            {
                data: [stockDistribution.enStock, stockDistribution.bajoStock, stockDistribution.sinStock],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
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

    const title = getTextByMode({
        niños: '📦 Reporte de Inventario',
        jóvenes: '📦 Reporte de Inventario',
        adultos: 'Reporte de Inventario'
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
                                    niños: '¡Mira qué bebidas tenemos en el almacén!',
                                    jóvenes: 'Análisis detallado del inventario',
                                    adultos: 'Análisis detallado del inventario disponible'
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
                                    niños: 'Stock Mínimo',
                                    jóvenes: 'Umbral de Stock Bajo',
                                    adultos: 'Umbral de Stock Bajo'
                                })}
                            </label>
                            <Input
                                type="number"
                                value={localFilters.low_stock_threshold}
                                onChange={(e) => handleFilterChange('low_stock_threshold', e.target.value)}
                                placeholder="10"
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
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Total de Bebidas',
                                        jóvenes: 'Total de Productos',
                                        adultos: 'Total de Productos'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{inventoryStats.total_products}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Valor Total',
                                        jóvenes: 'Valor Total',
                                        adultos: 'Valor Total del Inventario'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">${inventoryStats.total_value.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Bajo Stock',
                                        jóvenes: 'Productos con Bajo Stock',
                                        adultos: 'Productos con Bajo Stock'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{inventoryStats.low_stock_count}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-200" />
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Gráfico de barras - Stock por categoría */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📊 Stock por Tipo de Bebida',
                                jóvenes: '📊 Stock por Categoría',
                                adultos: 'Stock por Categoría'
                            })}
                        </h3>
                        <div className="h-80">
                            <Bar data={categoryChartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Gráfico de línea - Productos con bajo stock */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '⚠️ Productos con Bajo Stock',
                                jóvenes: '⚠️ Productos con Bajo Stock',
                                adultos: 'Productos con Bajo Stock'
                            })}
                        </h3>
                        <div className="h-80">
                            <Line data={lowStockChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Gráfico de dona - Distribución de stock */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
                    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🍩 Distribución del Stock',
                            jóvenes: '🍩 Distribución del Stock',
                            adultos: 'Distribución del Stock'
                        })}
                    </h3>
                    <div className="flex justify-center">
                        <div className="w-80 h-80">
                            <Doughnut data={distributionChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⚠️ ¡Bebidas que Necesitan Reposición!',
                                    jóvenes: '⚠️ Productos que Necesitan Reposición',
                                    adultos: 'Productos que Necesitan Reposición'
                                })}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {lowStockProducts.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {item.producto_nombre}
                                        </span>
                                        {getStockBadge(item.stock, localFilters.low_stock_threshold)}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p>Stock: {item.stock} unidades</p>
                                        <p>Precio: ${item.precio_venta.toLocaleString()}</p>
                                        {item.almacen && (
                                            <p>Almacén: {item.almacen.nombre}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Inventory Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📋 Lista de Todas las Bebidas',
                                jóvenes: '📋 Detalle del Inventario',
                                adultos: 'Detalle del Inventario'
                            })}
                        </h3>
                    </div>

                    {inventory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Bebida',
                                                jóvenes: 'Producto',
                                                adultos: 'Producto'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Tipo',
                                                jóvenes: 'Categoría',
                                                adultos: 'Categoría'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Cantidad',
                                                jóvenes: 'Stock',
                                                adultos: 'Stock'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Precio',
                                                jóvenes: 'Precio',
                                                adultos: 'Precio'
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
                                    {inventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto_nombre}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto?.categoria?.nombre || 'Sin categoría'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
                                                {item.stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                                                ${item.precio_venta.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStockBadge(item.stock, localFilters.low_stock_threshold)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {getTextByMode({
                                    niños: 'No hay bebidas',
                                    jóvenes: 'Sin productos',
                                    adultos: 'Sin productos'
                                })}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {getTextByMode({
                                    niños: 'No tenemos bebidas en el inventario',
                                    jóvenes: 'No se encontraron productos en el inventario',
                                    adultos: 'No se encontraron productos en el inventario'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
} 