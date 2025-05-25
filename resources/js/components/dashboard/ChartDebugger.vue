<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    ventasPorMes: any[];
    productosMasVendidos: any[];
}

const props = defineProps<Props>();

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
        ]
    }]
}));
</script>

<template>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-4">🔍 Chart Debugger</h2>

        <!-- Datos Originales -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Ventas Por Mes (Raw Data)</h3>
                <pre
                    class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(ventasPorMes, null, 2) }}</pre>
            </div>

            <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Productos Más Vendidos (Raw Data)</h3>
                <pre
                    class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-40">{{ JSON.stringify(productosMasVendidos, null, 2) }}</pre>
            </div>
        </div>

        <!-- Datos Procesados para Chart.js -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Datos Procesados - Ventas Chart</h3>
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
                    <p><strong>Labels:</strong> {{ JSON.stringify(ventasChartData.labels) }}</p>
                    <p><strong>Data:</strong> {{ JSON.stringify(ventasChartData.datasets[0].data) }}</p>
                    <p><strong>Has Data:</strong> {{ ventasChartData.datasets[0].data.length > 0 ? '✅' : '❌' }}</p>
                </div>
            </div>

            <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Datos Procesados - Productos Chart</h3>
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs">
                    <p><strong>Labels:</strong> {{ JSON.stringify(productosChartData.labels) }}</p>
                    <p><strong>Data:</strong> {{ JSON.stringify(productosChartData.datasets[0].data) }}</p>
                    <p><strong>Has Data:</strong> {{ productosChartData.datasets[0].data.length > 0 ? '✅' : '❌' }}</p>
                </div>
            </div>
        </div>

        <!-- Validaciones -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Validaciones</h3>
            <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>{{ ventasPorMes ? '✅' : '❌' }} ventasPorMes existe</li>
                <li>{{ ventasPorMes && Array.isArray(ventasPorMes) ? '✅' : '❌' }} ventasPorMes es array</li>
                <li>{{ ventasPorMes && ventasPorMes.length > 0 ? '✅' : '❌' }} ventasPorMes tiene datos ({{
                    ventasPorMes?.length || 0 }})</li>
                <li>{{ productosMasVendidos ? '✅' : '❌' }} productosMasVendidos existe</li>
                <li>{{ productosMasVendidos && Array.isArray(productosMasVendidos) ? '✅' : '❌' }} productosMasVendidos
                    es array</li>
                <li>{{ productosMasVendidos && productosMasVendidos.length > 0 ? '✅' : '❌' }} productosMasVendidos tiene
                    datos ({{ productosMasVendidos?.length || 0 }})</li>
            </ul>
        </div>
    </div>
</template>