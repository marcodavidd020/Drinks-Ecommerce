<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';

interface Props {
    title: string;
    chartId: string;
    data: any;
    chartType: 'line' | 'bar' | 'doughnut' | 'pie';
    options?: any;
    height?: string;
}

const props = withDefaults(defineProps<Props>(), {
    height: '300px'
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: any = null;
let isCreatingChart = ref(false);

const destroyChart = () => {
    if (chartInstance) {
        console.log('🗑️ Destruyendo gráfica:', props.title);
        chartInstance.destroy();
        chartInstance = null;
    }
};

const createChart = async () => {
    if (isCreatingChart.value) {
        console.log('⏸️ Ya se está creando una gráfica para:', props.title);
        return;
    }

    console.log('🎯 Iniciando creación de gráfica:', props.title);
    console.log('📊 Datos recibidos:', props.data);

    // Verificar datos
    if (!props.data || !props.data.datasets || props.data.datasets.length === 0) {
        console.warn('⚠️ No hay datos válidos para:', props.title);
        return;
    }

    console.log('✅ Datos válidos, esperando ref...');

    // Esperar hasta que el ref esté disponible (máximo 10 intentos)
    let attempts = 0;
    const maxAttempts = 10;

    while (!canvasRef.value && attempts < maxAttempts) {
        console.log(`⏳ Intento ${attempts + 1}/${maxAttempts} - Esperando canvasRef...`);
        await new Promise(resolve => setTimeout(resolve, 50)); // Esperar 50ms
        attempts++;
    }

    // Verificar canvas después del retry
    if (!canvasRef.value) {
        console.error('❌ canvasRef.value sigue siendo null después de', maxAttempts, 'intentos');
        return;
    }

    console.log('✅ canvasRef.value está disponible, creando gráfica...');

    isCreatingChart.value = true;

    try {
        // Importar Chart.js
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);

        const ctx = canvasRef.value.getContext('2d');
        if (!ctx) {
            console.error('❌ No se pudo obtener el contexto 2D');
            return;
        }

        // Destruir gráfica anterior si existe
        destroyChart();

        // Detectar modo oscuro
        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#e5e7eb' : '#374151';
        const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

        // Configuraciones por defecto
        const defaultOptions = {
            line: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            callback: function (value: any) {
                                return props.title.includes('Ventas') || props.title.includes('Ingresos')
                                    ? '$' + value.toLocaleString()
                                    : value.toLocaleString();
                            }
                        },
                        grid: { color: gridColor }
                    }
                }
            },
            doughnut: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom' as const,
                        labels: { color: textColor }
                    }
                }
            },
            pie: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom' as const,
                        labels: { color: textColor }
                    }
                }
            },
            bar: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        };

        const chartOptions = props.options || (defaultOptions as any)[props.chartType] || {};

        // Crear la gráfica
        chartInstance = new Chart(ctx, {
            type: props.chartType,
            data: props.data,
            options: chartOptions
        });

        console.log('✅ Gráfica creada exitosamente:', props.title);

    } catch (error) {
        console.error('❌ Error creando gráfica:', error);
    } finally {
        isCreatingChart.value = false;
    }
};

onMounted(async () => {
    console.log('🚀 Componente montado:', props.title);
    await nextTick();

    // Intentar crear la gráfica después del montaje
    if (props.data && props.data.datasets && props.data.datasets.length > 0) {
        createChart();
    }
});

// Watch para cambios en los datos
watch(() => props.data, async () => {
    console.log('📊 Datos actualizados para:', props.title);
    if (props.data && props.data.datasets && props.data.datasets.length > 0) {
        destroyChart();
        await nextTick();
        createChart();
    }
}, { deep: true });

onUnmounted(() => {
    console.log('👋 Desmontando componente:', props.title);
    destroyChart();
});
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">{{ title }}</h3>
            <div :style="{ height }" class="relative">
                <canvas v-if="data && data.datasets && data.datasets.length > 0" ref="canvasRef" :id="chartId"
                    class="w-full h-full"></canvas>
                <div v-else class="flex items-center justify-center h-full">
                    <div class="text-center">
                        <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                            </path>
                        </svg>
                        <p class="text-sm text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>