<script setup lang="ts">
interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    colorClass?: string;
}

defineProps<Props>();
</script>

<template>
    <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
        <div class="p-5">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div :class="colorClass || 'bg-indigo-500'"
                        class="w-8 h-8 rounded-md flex items-center justify-center">
                        <span v-if="icon" class="text-white text-lg">{{ icon }}</span>
                        <svg v-else class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{{ title }}</dt>
                        <dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ value }}</dd>
                    </dl>
                </div>
            </div>
            <div v-if="subtitle || trendValue" class="mt-4">
                <div class="flex items-center text-sm">
                    <span v-if="trendValue" :class="{
                        'text-green-600': trend === 'up',
                        'text-red-600': trend === 'down',
                        'text-gray-600': trend === 'neutral'
                    }" class="flex items-center">
                        <svg v-if="trend === 'up'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <svg v-else-if="trend === 'down'" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                        </svg>
                        {{ trendValue }}
                    </span>
                    <span v-if="subtitle" :class="trendValue ? 'ml-2' : ''" class="text-gray-600 dark:text-gray-300">{{
                        subtitle }}</span>
                </div>
            </div>
        </div>
    </div>
</template>