<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import MetricCard from '@/components/dashboard/MetricCard.vue';
import ChartComparison from '@/components/dashboard/ChartComparison.vue';
import DataTable from '@/components/dashboard/DataTable.vue';

interface Props {
    totalVentas: number;
    totalClientes: number;
    totalProductos: number;
    totalProveedores: number;
    ventasEsteMes: number;
    clientesEsteMes: number;
    pqrsPendientes: number;
    carritosAbandonados: number;
    productosStockBajo: number;
    ventasPorMes: any[];
    productosMasVendidos: any[];
    ventasRecientes: any[];
    pqrsRecientes: any[];
    stockCritico: any[];
}

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Preparar datos para las gráficas
const ventasChartData = computed(() => ({
    labels: props.ventasPorMes.map(item => `${item.mes}/${item.año}`),
    datasets: [{
        label: 'Ventas ($)',
        data: props.ventasPorMes.map(item => item.total),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.1,
        fill: true
    }]
}));

const productosChartData = computed(() => ({
    labels: props.productosMasVendidos.slice(0, 5).map(item => item.nombre),
    datasets: [{
        data: props.productosMasVendidos.slice(0, 5).map(item => item.total_vendido),
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
}));

// Configurar columnas para las tablas
const ventasColumns = [
    { key: 'fecha', label: 'Fecha', format: 'date' as const },
    { key: 'total', label: 'Total', format: 'currency' as const },
    { key: 'estado', label: 'Estado', format: 'badge' as const }
];

const stockColumns = [
    { key: 'producto', label: 'Producto' },
    { key: 'almacen', label: 'Almacén' },
    { key: 'stock', label: 'Stock Actual' },
    { key: 'cod_producto', label: 'Código' }
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
};
</script>

<template>

    <Head title="Dashboard Ejecutivo" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-6 p-6">
            <!-- Header -->
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Ejecutivo</h1>
                            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Resumen completo de tu negocio</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500 dark:text-gray-400">Última actualización</p>
                            <p class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ new
                                Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Métricas Principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Ventas" :value="formatCurrency(totalVentas)" subtitle="Ventas completadas"
                    icon="💰" color-class="bg-green-500" />
                <MetricCard title="Clientes" :value="formatNumber(totalClientes)"
                    :subtitle="`+${clientesEsteMes} este mes`" icon="👥" color-class="bg-blue-500" trend="up"
                    :trend-value="`+${clientesEsteMes}`" />
                <MetricCard title="Productos" :value="formatNumber(totalProductos)" subtitle="En catálogo" icon="📦"
                    color-class="bg-purple-500" />
                <MetricCard title="Proveedores" :value="formatNumber(totalProveedores)" subtitle="Activos" icon="🏢"
                    color-class="bg-indigo-500" />
            </div>

            <!-- Métricas de Alerta -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="PQRS Pendientes" :value="formatNumber(pqrsPendientes)" subtitle="Requieren atención"
                    icon="⚠️" color-class="bg-orange-500" :trend="pqrsPendientes > 0 ? 'down' : 'neutral'" />
                <MetricCard title="Carritos Abandonados" :value="formatNumber(carritosAbandonados)"
                    subtitle="Más de 7 días" icon="🛒" color-class="bg-red-500" />
                <MetricCard title="Stock Crítico" :value="formatNumber(productosStockBajo)"
                    subtitle="Productos con stock bajo" icon="📉" color-class="bg-yellow-500"
                    :trend="productosStockBajo > 0 ? 'down' : 'up'" />
            </div>

            <!-- Ventas del Mes -->
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-8 h-8 bg-white bg-opacity-30 rounded-md flex items-center justify-center">
                                <span class="text-white text-lg">📈</span>
                            </div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-indigo-100 truncate">Ventas Este Mes</dt>
                                <dd class="text-2xl font-bold text-white">{{ formatCurrency(ventasEsteMes) }}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficas -->
            <div class="space-y-8">
                <ChartComparison title="Ventas por Mes" :data="ventasChartData" chart-type="line" />

                <ChartComparison title="Productos Más Vendidos" :data="productosChartData" chart-type="doughnut" />
            </div>

            <!-- Tablas de Datos -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable title="Ventas Recientes" :columns="ventasColumns" :data="ventasRecientes"
                    empty-message="No hay ventas recientes" />

                <DataTable title="Stock Crítico" :columns="stockColumns" :data="stockCritico"
                    empty-message="✅ Todos los productos tienen stock suficiente" :badge="stockCritico.length > 0 ? {
                        text: `${stockCritico.length} productos`,
                        color: 'bg-red-100 text-red-800'
                    } : undefined" />
            </div>

            <!-- PQRS Recientes -->
            <div v-if="pqrsRecientes.length > 0" class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">PQRS Recientes</h3>
                        <span v-if="pqrsPendientes > 0"
                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            {{ pqrsPendientes }} pendientes
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="pqrs in pqrsRecientes" :key="pqrs.id"
                            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between mb-2">
                                <span :class="{
                                    'bg-red-100 text-red-800': pqrs.tipo === 'queja',
                                    'bg-orange-100 text-orange-800': pqrs.tipo === 'reclamo',
                                    'bg-blue-100 text-blue-800': pqrs.tipo === 'peticion',
                                    'bg-green-100 text-green-800': pqrs.tipo === 'sugerencia'
                                }" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ pqrs.tipo.charAt(0).toUpperCase() + pqrs.tipo.slice(1) }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ new Date(pqrs.fecha_creacion).toLocaleDateString('es-CO') }}
                                </span>
                            </div>
                            <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ pqrs.nombre_completo }}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ pqrs.descripcion.substring(0,
                                100) }}...</p>
                            <div class="mt-2">
                                <span :class="{
                                    'bg-yellow-100 text-yellow-800': pqrs.estado === 'pendiente',
                                    'bg-green-100 text-green-800': pqrs.estado === 'resuelto'
                                }" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                                    {{ pqrs.estado.charAt(0).toUpperCase() + pqrs.estado.slice(1) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
