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
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const resetFilters = { low_stock_threshold: 10 };
        setLocalFilters(resetFilters);
        router.get(getAppUrl('/reports/inventory'), resetFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const downloadPDF = () => {
        const params = new URLSearchParams({
            low_stock_threshold: localFilters.low_stock_threshold.toString()
        });
        window.open(`${getAppUrl('/reports/inventory/pdf')}?${params.toString()}`, '_blank');
    };

    const getStockBadge = (stock: number, threshold: number) => {
        if (stock <= threshold) {
            return (
                <Badge variant="destructive" className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Bajo Stock</span>
                </Badge>
            );
        } else if (stock <= 50) {
            return (
                <Badge variant="secondary" className="flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Stock Medio</span>
                </Badge>
            );
        } else {
            return (
                <Badge variant="default" className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Stock Bueno</span>
                </Badge>
            );
        }
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Inventario de Bebidas',
                jóvenes: '📦 Reportes de Inventario',
                adultos: 'Reportes de Inventario'
            })}
        >
            <Head title={getTextByMode({
                niños: 'Inventario de Bebidas',
                jóvenes: 'Reportes de Inventario',
                adultos: 'Reportes de Inventario'
            })} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <Link
                                href={getAppUrl('/reports')}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {getTextByMode({
                                    niños: '📦 Inventario de Bebidas',
                                    jóvenes: '📦 Reportes de Inventario',
                                    adultos: 'Reportes de Inventario'
                                })}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {getTextByMode({
                                niños: 'Mira todas las bebidas que tenemos en la tienda',
                                jóvenes: 'Estado actual del inventario y stock disponible',
                                adultos: 'Estado actual del inventario, stock bajo y valorización de productos'
                            })}
                        </p>
                    </div>
                    <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700">
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
                                jóvenes: 'Configuración de Filtros',
                                adultos: 'Configuración de Filtros'
                            })}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {getTextByMode({
                                    niños: 'Cuándo las bebidas se están acabando',
                                    jóvenes: 'Umbral de stock bajo',
                                    adultos: 'Umbral de stock bajo'
                                })}
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={localFilters.low_stock_threshold}
                                onChange={(e) => handleFilterChange('low_stock_threshold', e.target.value)}
                                placeholder="10"
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <Button onClick={applyFilters} className="bg-green-600 hover:bg-green-700">
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
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Total Bebidas',
                                        jóvenes: 'Total Productos',
                                        adultos: 'Total en Stock'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{inventoryStats.total_products.toLocaleString()}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Valor de Todas las Bebidas',
                                        jóvenes: 'Valor Total del Inventario',
                                        adultos: 'Valor Total del Inventario'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">${inventoryStats.total_value.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">
                                    {getTextByMode({
                                        niños: 'Bebidas que se Están Acabando',
                                        jóvenes: 'Productos con Stock Bajo',
                                        adultos: 'Productos con Stock Bajo'
                                    })}
                                </p>
                                <p className="text-2xl font-bold">{inventoryStats.low_stock_count}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-200" />
                        </div>
                    </div>
                </div>

                {/* Alert for Low Stock */}
                {inventoryStats.low_stock_count > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-red-800 dark:text-red-200">
                                    {getTextByMode({
                                        niños: `¡Atención! ${inventoryStats.low_stock_count} bebidas se están acabando y necesitas comprar más`,
                                        jóvenes: `Alerta: ${inventoryStats.low_stock_count} productos requieren reabastecimiento urgente`,
                                        adultos: `Atención: ${inventoryStats.low_stock_count} productos requieren reabastecimiento inmediato`
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock by Category */}
                {stockByCategory.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            {getTextByMode({
                                niños: '🏷️ Bebidas por Tipo',
                                jóvenes: '🏷️ Stock por Categoría',
                                adultos: 'Stock por Categoría'
                            })}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stockByCategory.map((category, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {category.categoria}
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {category.stock.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500">
                                            {inventoryStats.total_products > 0 ? 
                                                ((category.stock / inventoryStats.total_products) * 100).toFixed(1) 
                                                : 0}% del total
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Low Stock Products */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5" />
                                <span>
                                    {getTextByMode({
                                        niños: '⚠️ Bebidas que se Están Acabando',
                                        jóvenes: '⚠️ Productos con Stock Bajo',
                                        adultos: 'Productos con Stock Bajo'
                                    })}
                                </span>
                            </h3>
                        </div>
                        
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
                                                niños: 'Cuántas Quedan',
                                                jóvenes: 'Stock',
                                                adultos: 'Stock Actual'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Precio',
                                                jóvenes: 'Precio',
                                                adultos: 'Precio'
                                            })}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Valor Total',
                                                jóvenes: 'Valor en Stock',
                                                adultos: 'Valor en Stock'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {lowStockProducts.map((item) => (
                                        <tr key={item.id} className="hover:bg-red-50 dark:hover:bg-red-900/10">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto?.nombre || item.producto_nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto?.categoria?.nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                                                ${item.precio_venta.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                                                ${(item.stock * item.precio_venta).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Complete Inventory Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {getTextByMode({
                                niños: '📋 Todas las Bebidas en la Tienda',
                                jóvenes: '📋 Inventario Completo',
                                adultos: 'Inventario Completo'
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Dónde Está',
                                                jóvenes: 'Almacén',
                                                adultos: 'Almacén'
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
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {getTextByMode({
                                                niños: 'Valor Total',
                                                jóvenes: 'Valor Total',
                                                adultos: 'Valor Total'
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
                                        <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                            item.stock <= localFilters.low_stock_threshold ? 'bg-red-50 dark:bg-red-900/10' : ''
                                        }`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto?.nombre || item.producto_nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.producto?.categoria?.nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {item.almacen?.nombre || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.stock <= localFilters.low_stock_threshold 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : item.stock <= 50 
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                                                ${item.precio_venta.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-semibold">
                                                ${(item.stock * item.precio_venta).toLocaleString()}
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
                                    niños: 'No hay bebidas en el inventario',
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