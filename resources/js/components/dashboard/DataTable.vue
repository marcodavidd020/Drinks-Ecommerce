<script setup lang="ts">
interface Column {
    key: string;
    label: string;
    format?: 'currency' | 'date' | 'badge' | 'text';
    badgeColors?: Record<string, string>;
}

interface Props {
    title: string;
    columns: Column[];
    data: any[];
    emptyMessage?: string;
    badge?: {
        text: string;
        color: string;
        count?: number;
    };
}

const props = withDefaults(defineProps<Props>(), {
    emptyMessage: 'No hay datos disponibles'
});

const formatValue = (value: any, format?: string, badgeColors?: Record<string, string>) => {
    if (!value && value !== 0) return '-';

    switch (format) {
        case 'currency':
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(value);
        case 'date':
            return new Date(value).toLocaleDateString('es-CO');
        case 'badge':
            return { value, color: badgeColors?.[value] || 'bg-gray-100 text-gray-800' };
        default:
            return value;
    }
};

const getBadgeClass = (value: string, badgeColors?: Record<string, string>) => {
    const defaultColors: Record<string, string> = {
        'completada': 'bg-green-100 text-green-800',
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'cancelada': 'bg-red-100 text-red-800',
        'resuelto': 'bg-green-100 text-green-800',
        'activo': 'bg-blue-100 text-blue-800',
        'inactivo': 'bg-gray-100 text-gray-800'
    };

    return badgeColors?.[value] || defaultColors[value] || 'bg-gray-100 text-gray-800';
};
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
                <span v-if="badge" :class="badge.color"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ badge.text }}
                    <span v-if="badge.count !== undefined" class="ml-1">{{ badge.count }}</span>
                </span>
            </div>

            <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th v-for="column in columns" :key="column.key"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {{ column.label }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="(item, index) in data" :key="index"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap text-sm">
                                <template v-if="column.format === 'badge'">
                                    <span :class="getBadgeClass(item[column.key], column.badgeColors)"
                                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                                        {{ item[column.key].charAt(0).toUpperCase() + item[column.key].slice(1) }}
                                    </span>
                                </template>
                                <template v-else-if="column.format === 'currency'">
                                    <span class="font-medium text-gray-900 dark:text-gray-100">{{
                                        formatValue(item[column.key], column.format) }}</span>
                                </template>
                                <template v-else>
                                    <span
                                        :class="column.format === 'date' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'">
                                        {{ formatValue(item[column.key], column.format) }}
                                    </span>
                                </template>
                            </td>
                        </tr>
                        <tr v-if="data.length === 0">
                            <td :colspan="columns.length"
                                class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                <div class="flex flex-col items-center">
                                    <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                        </path>
                                    </svg>
                                    {{ emptyMessage }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>