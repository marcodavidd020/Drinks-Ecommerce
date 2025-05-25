<script setup lang="ts">
import ChartCard from '@/components/dashboard/ChartCard.vue';
import ChartCardFixed from '@/components/dashboard/ChartCardFixed.vue';

interface Props {
    title: string;
    data: any;
    chartType: 'line' | 'bar' | 'doughnut' | 'pie';
    options?: any;
}

const props = defineProps<Props>();
</script>

<template>
    <div class="space-y-6">
        <div class="text-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Comparación de Componentes: {{ title }}
            </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Versión Original (ChartCard.vue) -->
            <div class="space-y-2">
                <div
                    class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 class="text-sm font-medium text-green-800 dark:text-green-200 text-center">
                        ✅ ChartCard.vue (Original - Funciona)
                    </h3>
                </div>
                <ChartCard :title="`${title} (Original)`"
                    :chart-id="`${title.toLowerCase().replace(/\s+/g, '-')}-original`" :data="data"
                    :chart-type="chartType" :options="options" />
            </div>

            <!-- Versión Fixed (ChartCardFixed.vue) -->
            <div class="space-y-2">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 text-center">
                        🔧 ChartCardFixed.vue (Mejorado)
                    </h3>
                </div>
                <ChartCardFixed :title="`${title} (Fixed)`"
                    :chart-id="`${title.toLowerCase().replace(/\s+/g, '-')}-fixed`" :data="data" :chart-type="chartType"
                    :options="options" />
            </div>
        </div>

        <!-- Debug Info -->
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">📊 Debug Info:</h4>
            <div class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                <div>Data structure: {{ typeof data }}</div>
                <div>Has datasets: {{ data?.datasets ? 'Yes' : 'No' }}</div>
                <div>Datasets count: {{ data?.datasets?.length || 0 }}</div>
                <div>Labels count: {{ data?.labels?.length || 0 }}</div>
                <div>Chart type: {{ chartType }}</div>
            </div>
        </div>
    </div>
</template>