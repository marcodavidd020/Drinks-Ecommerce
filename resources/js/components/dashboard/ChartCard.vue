<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import type { Chart } from 'chart.js';

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

const chartRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let isCreatingChart = ref(false);

const createChart = async () => {
    if (isCreatingChart.value) {
        console.log('⏸️ Ya se está creando una gráfica para:', props.title);
        return;
    }

    isCreatingChart.value = true;
    console.log('🎯 CreateChart iniciado para:', props.title);
    console.log('📊 Datos recibidos:', props.data);

    try {
        // Verificar si hay datos primero
        if (!props.data) {
            console.error('❌ props.data es null/undefined');
            return;
        }

        if (!props.data.datasets) {
            console.error('❌ props.data.datasets es null/undefined');
            return;
        }

        if (props.data.datasets.length === 0) {
            console.error('❌ props.data.datasets está vacío');
            return;
        }

        console.log('✅ Datos válidos, esperando ref...');

        // Esperar hasta que el ref esté disponible (máximo 10 intentos)
        let attempts = 0;
        const maxAttempts = 10;

        while (!chartRef.value && attempts < maxAttempts) {
            console.log(`⏳ Intento ${attempts + 1}/${maxAttempts} - Esperando chartRef...`);
            await new Promise(resolve => setTimeout(resolve, 50)); // Esperar 50ms
            attempts++;
        }

        if (!chartRef.value) {
            console.error('❌ chartRef.value sigue siendo null después de', maxAttempts, 'intentos');
            return;
        }

        console.log('✅ chartRef.value está disponible, creando gráfica...');

        // Destruir gráfica anterior si existe para evitar conflictos de canvas
        destroyChart();

        // Importar Chart.js dinámicamente
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);

        const ctx = chartRef.value.getContext('2d');
        if (!ctx) return;

        // Detectar modo oscuro
        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#e5e7eb' : '#374151';
        const gridColor = isDarkMode ? '#374151' : '#e5e7eb';

        // Configuración por defecto según el tipo de gráfica
        const defaultOptions = {
            line: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
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
                        grid: {
                            color: gridColor
                        }
                    }
                }
            },
            doughnut: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom' as const,
                        labels: {
                            color: textColor
                        }
                    }
                }
            },
            bar: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                }
            }
        };

        const chartOptions = props.options || (defaultOptions as any)[props.chartType] || {};

        console.log('🎨 Configuración final de la gráfica:', {
            type: props.chartType,
            data: props.data,
            options: chartOptions
        });

        chartInstance = new Chart(ctx, {
            type: props.chartType,
            data: props.data,
            options: chartOptions
        });

        console.log('✅ Gráfica creada exitosamente:', chartInstance);

    } catch (error) {
        console.error('❌ Error creando gráfica:', error);
        destroyChart(); // Limpiar en caso de error
    } finally {
        isCreatingChart.value = false;
    }
};

const destroyChart = () => {
    if (chartInstance) {
        console.log('🗑️ Destruyendo gráfica:', props.title);
        try {
            chartInstance.destroy();
            chartInstance = null;
        } catch (error) {
            console.error('❌ Error destruyendo gráfica:', error);
            chartInstance = null; // Forzar limpieza
        }
    }
};



onMounted(async () => {
    // Esperar hasta que el DOM esté completamente renderizado
    await nextTick();
    console.log('🚀 onMounted + nextTick ejecutado para:', props.title);

    // Si ya tenemos datos, crear la gráfica
    if (props.data && props.data.datasets && props.data.datasets.length > 0) {
        createChart();
    }
});

watch(() => props.data, async () => {
    console.log('📊 Datos actualizados para:', props.title);
    destroyChart();
    await nextTick();
    createChart();
}, { deep: true });

onUnmounted(() => {
    console.log('👋 Desmontando componente:', props.title);
    destroyChart();
});

// Limpiar al desmontar el componente
defineExpose({
    destroy: destroyChart
});
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">{{ title }}</h3>
            <div :style="{ height }" class="relative">
                <canvas v-if="data && data.datasets && data.datasets.length > 0" ref="chartRef" :id="chartId"
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