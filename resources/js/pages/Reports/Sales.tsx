import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { useState } from 'react';
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
        router.get('/reports/sales', localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const resetFilters = {
            start_date: firstDay.toISOString().split('T')[0],
            end_date: today.toISOString().split('T')[0],
        };
        setLocalFilters(resetFilters);
        router.get('/reports/sales', resetFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const downloadPDF = () => {
        const params = new URLSearchParams(localFilters);
        window.open(`/reports/sales/pdf?${params.toString()}`, '_blank');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO');
    };

    const getStatusBadge = (status: string) => {
        const statusMap = {
            completada: { label: 'Completada', variant: 'default' as const },
            pendiente: { label: 'Pendiente', variant: 'secondary' as const },
            cancelada: { label: 'Cancelada', variant: 'destructive' as const },
        };
        
        const statusInfo = statusMap[status as keyof typeof statusMap] || 
                          { label: status, variant: 'secondary' as const };
        
        return (
            <Badge variant={statusInfo.variant}>
                {statusInfo.label}
            </Badge>
        );
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '💰 Reportes de Ventas Geniales',
                jóvenes: '💰 Reportes de Ventas',
                adultos: 'Reportes de Ventas'
            })}
        >
            <Head title={getTextByMode({
                niños: 'Ventas Geniales',
                jóvenes: 'Reportes de Ventas',
                adultos: 'Reportes de Ventas'
            })} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href="/reports"
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {getTextByMode({
                                    niños: '💰 Reportes de Ventas Geniales',
                                    jóvenes: '💰 Reportes de Ventas',
                                    adultos: 'Reportes de Ventas'
                                })}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {getTextByMode({
                                niños: 'Ve todas las ventas súper geniales que hemos hecho',
                                jóvenes: 'Análisis detallado de todas las ventas realizadas',
                                adultos: 'Análisis detallado de ventas por período, categorías y rendimiento'
                            })}
                        </p>
                    </div>
                    <Button onClick={downloadPDF} className="bg-red-600 hover:bg-red-700">
                        <Download className="h-4 w-4 mr-2" />
                        {getTextByMode({
                            niños: 'Descargar PDF',
                            jóvenes: 'Descargar PDF',
                            adultos: 'Exportar PDF'
                        })}
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                    <div className="flex items-center space-x-2 mb-4">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <p className="text-2xl font-bold">${salesStats.total_sales.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold">${salesStats.average_order_value.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-200" />
                        </div>
                    </div>
                </div>

                {/* Sales by Category */}
                {salesByCategory.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {getTextByMode({
                                niños: '🏷️ Ventas por Tipo de Bebida',
                                jóvenes: '🏷️ Ventas por Categoría',
                                adultos: 'Ventas por Categoría'
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
                                            ${category.total.toLocaleString()}
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                                                ${sale.total.toLocaleString()}
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