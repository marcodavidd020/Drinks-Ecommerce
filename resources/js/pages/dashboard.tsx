import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';
import MetricCard from '@/components/dashboard/metric-card';
import ChartComparison from '@/components/dashboard/chart-comparison';
import DataTable from '@/components/dashboard/data-table';

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalProducts: number;
        totalClients: number;
        totalProviders: number;
        totalOrders: number;
        totalRevenue: number;
        lowStockProducts: number;
        pendingPqrs: number;
        abandonedCarts: number;
        growth: {
            users: number;
            products: number;
            orders: number;
            revenue: number;
        };
    };
    chartData: {
        salesByMonth: Array<{
            year: number;
            month: number;
            total: number;
            orders_count: number;
        }>;
        topProducts: Array<{
            nombre: string;
            total_vendido: number;
            total_ingresos: number;
        }>;
        salesByCategory: Array<{
            nombre: string;
            total_ingresos: number;
        }>;
    };
    recentActivity: {
        recentSales: Array<{
            id: number;
            fecha: string;
            total: number;
            estado: string;
            cliente_nombre: string;
        }>;
        lowStockProducts: Array<{
            id: number;
            nombre: string;
            cod_producto: string;
            stock_total: number;
        }>;
        recentPqrs: Array<{
            id: number;
            tipo: string;
            asunto: string;
            estado: string;
            created_at: string;
            cliente_nombre: string;
        }>;
    };
    alerts: Array<{
        type: 'warning' | 'info' | 'success' | 'error';
        title: string;
        message: string;
        action?: string;
        actionText?: string;
    }>;
}

export default function Dashboard({ stats, chartData, recentActivity, alerts }: DashboardProps) {
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

    // Preparar datos para gráficos
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const salesChartData = {
        labels: chartData.salesByMonth.map(item => `${monthNames[item.month - 1]} ${item.year}`),
        datasets: [
            {
                label: getTextByMode({
                    niños: '💰 Dinero Ganado',
                    jóvenes: '💰 Revenue',
                    adultos: 'Ingresos'
                }),
                data: chartData.salesByMonth.map(item => item.total),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true
            }
        ]
    };

    const categoryChartData = {
        labels: chartData.salesByCategory.map(item => item.nombre),
        datasets: [
            {
                label: getTextByMode({
                    niños: '💰 Dinero por Tipo',
                    jóvenes: '💰 Revenue by Category',
                    adultos: 'Ingresos por Categoría'
                }),
                data: chartData.salesByCategory.map(item => item.total_ingresos),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
                borderWidth: 2
            }
        ]
    };

    return (
        <DashboardLayout 
            title={getTextByMode({
                niños: '🏠 ¡Mi Panel Súper Genial!',
                jóvenes: '📊 Dashboard',
                adultos: 'Panel de Control'
            })}
        >
            <Head title="Dashboard" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Alertas importantes */}
                {alerts && alerts.length > 0 && (
                    <div className="space-y-3">
                        {alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${
                                    alert.type === 'warning' 
                                        ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-600' 
                                        : 'bg-blue-50 border-blue-400 dark:bg-blue-900/20 dark:border-blue-600'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`text-sm font-medium ${
                                            alert.type === 'warning' 
                                                ? 'text-yellow-800 dark:text-yellow-200' 
                                                : 'text-blue-800 dark:text-blue-200'
                                        } ${getModeClasses()}`}>
                                            {settings.ageMode === 'niños' ? '⚠️' : ''} {alert.title}
                                        </h3>
                                        <p className={`text-sm ${
                                            alert.type === 'warning' 
                                                ? 'text-yellow-700 dark:text-yellow-300' 
                                                : 'text-blue-700 dark:text-blue-300'
                                        } mt-1 ${getModeClasses()}`}>
                                            {alert.message}
                                        </p>
                                    </div>
                                    {alert.action && (
                                        <button
                                            onClick={() => window.location.href = alert.action!}
                                            className={`text-xs px-3 py-1 rounded ${
                                                alert.type === 'warning' 
                                                    ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700' 
                                                    : 'bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700'
                                            } transition-colors ${getModeClasses()}`}
                                        >
                                            {alert.actionText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title={getTextByMode({
                            niños: '👥 Usuarios',
                            jóvenes: '👥 Users',
                            adultos: 'Total Usuarios'
                        })}
                        value={stats.totalUsers}
                        subtitle={getTextByMode({
                            niños: `¡+${stats.growth.users}% este mes! 🎉`,
                            jóvenes: `+${stats.growth.users}% growth`,
                            adultos: `+${stats.growth.users}% este mes`
                        })}
                        icon="👥"
                        colorClass="bg-blue-500"
                        trend={stats.growth.users >= 0 ? 'up' : 'down'}
                        trendValue={`${stats.growth.users >= 0 ? '+' : ''}${stats.growth.users}%`}
                    />
                    <MetricCard
                        title={getTextByMode({
                            niños: '📦 Productos',
                            jóvenes: '📦 Products',
                            adultos: 'Total Productos'
                        })}
                        value={stats.totalProducts}
                        subtitle={getTextByMode({
                            niños: `¡+${stats.growth.products}% nuevos!`,
                            jóvenes: `+${stats.growth.products}% new`,
                            adultos: `+${stats.growth.products}% este mes`
                        })}
                        icon="📦"
                        colorClass="bg-green-500"
                        trend={stats.growth.products >= 0 ? 'up' : 'down'}
                        trendValue={`${stats.growth.products >= 0 ? '+' : ''}${stats.growth.products}%`}
                    />
                    <MetricCard
                        title={getTextByMode({
                            niños: '🛒 Órdenes',
                            jóvenes: '🛒 Orders',
                            adultos: 'Total Órdenes'
                        })}
                        value={stats.totalOrders}
                        subtitle={getTextByMode({
                            niños: `¡+${stats.growth.orders}% más ventas!`,
                            jóvenes: `+${stats.growth.orders}% sales`,
                            adultos: `+${stats.growth.orders}% este mes`
                        })}
                        icon="🛒"
                        colorClass="bg-yellow-500"
                        trend={stats.growth.orders >= 0 ? 'up' : 'down'}
                        trendValue={`${stats.growth.orders >= 0 ? '+' : ''}${stats.growth.orders}%`}
                    />
                    <MetricCard
                        title={getTextByMode({
                            niños: '💰 Ganancias',
                            jóvenes: '💰 Revenue',
                            adultos: 'Ingresos Totales'
                        })}
                        value={new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(stats.totalRevenue)}
                        subtitle={getTextByMode({
                            niños: `¡+${stats.growth.revenue}% más plata!`,
                            jóvenes: `+${stats.growth.revenue}% growth`,
                            adultos: `+${stats.growth.revenue}% este mes`
                        })}
                        icon="💰"
                        colorClass="bg-purple-500"
                        trend={stats.growth.revenue >= 0 ? 'up' : 'down'}
                        trendValue={`${stats.growth.revenue >= 0 ? '+' : ''}${stats.growth.revenue}%`}
                    />
                </div>

                {/* Métricas secundarias */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                        title={getTextByMode({
                            niños: '👨‍💼 Clientes',
                            jóvenes: '👨‍💼 Clients',
                            adultos: 'Total Clientes'
                        })}
                        value={stats.totalClients}
                        icon="👨‍💼"
                        colorClass="bg-indigo-500"
                    />
                    <MetricCard
                        title={getTextByMode({
                            niños: '🏭 Proveedores',
                            jóvenes: '🏭 Suppliers',
                            adultos: 'Total Proveedores'
                        })}
                        value={stats.totalProviders}
                        icon="🏭"
                        colorClass="bg-pink-500"
                    />
                    <MetricCard
                        title={getTextByMode({
                            niños: '⚠️ Stock Bajo',
                            jóvenes: '⚠️ Low Stock',
                            adultos: 'Productos Stock Crítico'
                        })}
                        value={stats.lowStockProducts}
                        icon="⚠️"
                        colorClass="bg-red-500"
                    />
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartComparison 
                        title={getTextByMode({
                            niños: '📈 Ventas por Mes',
                            jóvenes: '📈 Monthly Sales',
                            adultos: 'Evolución de Ventas Mensuales'
                        })}
                        data={salesChartData}
                        chartType="line"
                        height={300}
                    />
                    <ChartComparison 
                        title={getTextByMode({
                            niños: '🍰 Ventas por Categoría',
                            jóvenes: '🍰 Sales by Category',
                            adultos: 'Distribución por Categorías'
                        })}
                        data={categoryChartData}
                        chartType="doughnut"
                        height={300}
                    />
                </div>

                {/* Actividad reciente */}
                <div className="space-y-6">
                    {/* Primera fila - Ventas recientes (ancho completo) */}
                    <div className="grid grid-cols-1">
                        <DataTable 
                            title={getTextByMode({
                                niños: '🛒 Últimas Ventas Súper Geniales',
                                jóvenes: '🛒 Ventas Recientes',
                                adultos: 'Ventas Recientes'
                            })}
                            columns={[
                                { key: 'numero_venta', label: 'N° Venta' },
                                { key: 'cliente_nombre', label: 'Cliente' },
                                { key: 'total', label: 'Total', format: 'currency' },
                                { key: 'fecha', label: 'Fecha', format: 'date' },
                                { key: 'estado', label: 'Estado', format: 'badge' }
                            ]}
                            data={recentActivity.recentSales}
                            emptyMessage={getTextByMode({
                                niños: '¡No hay ventas todavía! 😔',
                                jóvenes: 'No hay ventas recientes',
                                adultos: 'No hay ventas recientes'
                            })}
                        />
                    </div>

                    {/* Segunda fila - Stock crítico y PQRS (2 columnas) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DataTable 
                            title={getTextByMode({
                                niños: '⚠️ ¡Productos que se Están Acabando!',
                                jóvenes: '⚠️ Stock Crítico',
                                adultos: 'Productos con Stock Crítico'
                            })}
                            columns={[
                                { key: 'nombre', label: 'Producto' },
                                { key: 'cod_producto', label: 'Código' },
                                { key: 'stock_total', label: 'Stock', format: 'number' }
                            ]}
                            data={recentActivity.lowStockProducts}
                            emptyMessage={getTextByMode({
                                niños: '¡Todo el stock está súper bien! 🎉',
                                jóvenes: 'Stock niveles están bien',
                                adultos: 'No hay productos con stock crítico'
                            })}
                            badge={{
                                text: stats.lowStockProducts.toString(),
                                color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                            }}
                        />

                        <DataTable 
                            title={getTextByMode({
                                niños: '📝 Últimas Quejas y Sugerencias',
                                jóvenes: '📝 PQRS Recientes',
                                adultos: 'PQRS Recientes'
                            })}
                            columns={[
                                { key: 'tipo', label: 'Tipo' },
                                { key: 'cliente_nombre', label: 'Cliente' },
                                { key: 'estado', label: 'Estado', format: 'badge' },
                                { key: 'created_at', label: 'Fecha', format: 'date' }
                            ]}
                            data={recentActivity.recentPqrs}
                            emptyMessage={getTextByMode({
                                niños: '¡No hay quejas! ¡Todo está genial! 😊',
                                jóvenes: 'No hay PQRS recientes',
                                adultos: 'No hay PQRS recientes'
                            })}
                            badge={stats.pendingPqrs > 0 ? {
                                text: `${stats.pendingPqrs} pendientes`,
                                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                            } : undefined}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
