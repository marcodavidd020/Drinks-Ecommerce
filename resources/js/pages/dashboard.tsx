import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import MetricCard from '@/components/dashboard/metric-card';
import ChartComparison from '@/components/dashboard/chart-comparison';
import DataTable from '@/components/dashboard/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    totalVentas: number;
    totalClientes: number;
    totalProductos: number;
    totalProveedores: number;
    ventasEsteMes: number;
    clientesEsteMes: number;
    pqrsPendientes: number;
    carritosAbandonados: number;
    productosStockBajo: number;
    ventasPorMes: Array<{
        mes: number;
        año: number;
        total: number;
    }>;
    productosMasVendidos: Array<{
        nombre: string;
        total_vendido: number;
    }>;
    ventasRecientes: Array<{
        id: number;
        fecha: string;
        total: number;
        estado: string;
    }>;
    pqrsRecientes: Array<{
        id: number;
        tipo: string;
        nombre_completo: string;
        descripcion: string;
        estado: string;
        fecha_creacion: string;
    }>;
    stockCritico: Array<{
        id: number;
        producto: string;
        almacen: string;
        stock: number;
        cod_producto: string;
    }>;
}

// Función para formatear números como moneda
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
};

export default function Dashboard(props: DashboardProps) {
    const {
        totalVentas,
        totalClientes,
        totalProductos,
        totalProveedores,
        ventasEsteMes,
        clientesEsteMes,
        pqrsPendientes,
        carritosAbandonados,
        productosStockBajo,
        ventasPorMes,
        productosMasVendidos,
        ventasRecientes,
        pqrsRecientes,
        stockCritico
    } = props;

    // Preparar datos para las gráficas
    const ventasChartData = useMemo(() => ({
        labels: ventasPorMes?.map(item => `${item.mes}/${item.año}`) || [],
        datasets: [{
            label: 'Ventas ($)',
            data: ventasPorMes?.map(item => item.total) || [],
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.3,
            fill: true
        }]
    }), [ventasPorMes]);

    const productosChartData = useMemo(() => ({
        labels: productosMasVendidos?.slice(0, 5).map(item => item.nombre) || [],
        datasets: [{
            data: productosMasVendidos?.slice(0, 5).map(item => item.total_vendido) || [],
            backgroundColor: [
                'rgba(79, 70, 229, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
                'rgb(79, 70, 229)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(139, 92, 246)'
            ],
            borderWidth: 2
        }]
    }), [productosMasVendidos]);

    // Configurar columnas para las tablas
    const ventasColumns = [
        { key: 'fecha', label: 'Fecha', format: 'date' as const },
        { key: 'total', label: 'Total', format: 'currency' as const },
        { key: 'estado', label: 'Estado', format: 'badge' as const }
    ];

    const stockColumns = [
        { key: 'producto', label: 'Producto' },
        { key: 'almacen', label: 'Almacén' },
        { key: 'stock', label: 'Stock Actual', format: 'number' as const },
        { key: 'cod_producto', label: 'Código' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Ejecutivo" />
            
            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Dashboard Ejecutivo
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Resumen completo de tu negocio
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Última actualización</p>
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {new Date().toLocaleTimeString('es-CO', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Métricas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard 
                        title="Total Ventas" 
                        value={formatCurrency(totalVentas)} 
                        subtitle="Ventas completadas"
                        icon="💰" 
                        colorClass="bg-green-500" 
                    />
                    <MetricCard 
                        title="Clientes" 
                        value={formatNumber(totalClientes)}
                        subtitle={`+${clientesEsteMes} este mes`}
                        icon="👥" 
                        colorClass="bg-blue-500" 
                        trend="up"
                        trendValue={`+${clientesEsteMes}`}
                    />
                    <MetricCard 
                        title="Productos" 
                        value={formatNumber(totalProductos)} 
                        subtitle="En catálogo"
                        icon="📦" 
                        colorClass="bg-purple-500" 
                    />
                    <MetricCard 
                        title="Proveedores" 
                        value={formatNumber(totalProveedores)} 
                        subtitle="Activos"
                        icon="🏢" 
                        colorClass="bg-indigo-500" 
                    />
                </div>

                {/* Métricas de Alerta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard 
                        title="PQRS Pendientes" 
                        value={formatNumber(pqrsPendientes)} 
                        subtitle="Requieren atención"
                        icon="⚠️" 
                        colorClass="bg-orange-500" 
                        trend={pqrsPendientes > 0 ? 'down' : 'neutral'}
                    />
                    <MetricCard 
                        title="Carritos Abandonados" 
                        value={formatNumber(carritosAbandonados)}
                        subtitle="Más de 7 días"
                        icon="🛒" 
                        colorClass="bg-red-500" 
                    />
                    <MetricCard 
                        title="Stock Crítico" 
                        value={formatNumber(productosStockBajo)}
                        subtitle="Productos con stock bajo"
                        icon="📉" 
                        colorClass="bg-yellow-500"
                        trend={productosStockBajo > 0 ? 'down' : 'up'}
                    />
                </div>

                {/* Ventas del Mes Destacadas */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-white bg-opacity-30 rounded-md flex items-center justify-center">
                                    <span className="text-white text-lg">📈</span>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-indigo-100 truncate">
                                        Ventas Este Mes
                                    </dt>
                                    <dd className="text-2xl font-bold text-white">
                                        {formatCurrency(ventasEsteMes)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficas */}
                <div className="space-y-8">
                    <ChartComparison 
                        title="Ventas por Mes" 
                        data={ventasChartData} 
                        chartType="line" 
                        height={350}
                    />
                    
                    <ChartComparison 
                        title="Productos Más Vendidos" 
                        data={productosChartData} 
                        chartType="doughnut" 
                        height={300}
                    />
                </div>

                {/* Tablas de Datos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DataTable 
                        title="Ventas Recientes" 
                        columns={ventasColumns} 
                        data={ventasRecientes || []}
                        emptyMessage="No hay ventas recientes" 
                    />

                    <DataTable 
                        title="Stock Crítico" 
                        columns={stockColumns} 
                        data={stockCritico || []}
                        emptyMessage="✅ Todos los productos tienen stock suficiente"
                        badge={stockCritico?.length > 0 ? {
                            text: `${stockCritico.length} productos`,
                            color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        } : undefined}
                    />
                </div>

                {/* PQRS Recientes */}
                {pqrsRecientes?.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                    PQRS Recientes
                                </h3>
                                {pqrsPendientes > 0 && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                        {pqrsPendientes} pendientes
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pqrsRecientes.map((pqrs) => (
                                    <div 
                                        key={pqrs.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                pqrs.tipo === 'queja' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                pqrs.tipo === 'reclamo' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                                pqrs.tipo === 'peticion' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                                {pqrs.tipo.charAt(0).toUpperCase() + pqrs.tipo.slice(1)}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(pqrs.fecha_creacion).toLocaleDateString('es-CO')}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            {pqrs.nombre_completo}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                            {pqrs.descripcion.substring(0, 100)}...
                                        </p>
                                        <div className="mt-2">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                pqrs.estado === 'pendiente' 
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                                {pqrs.estado.charAt(0).toUpperCase() + pqrs.estado.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
