import { useAppMode } from '@/contexts/AppModeContext';

interface Filter {
    type: 'search' | 'select' | 'per_page';
    placeholder?: string;
    value: any;
    onChange: (value: any) => void;
    options?: Array<{ value: string | number; label: string }>;
    colSpan?: number;
}

interface SearchFiltersProps {
    filters: Filter[];
}

export default function SearchFilters({ filters }: SearchFiltersProps) {
    const { settings } = useAppMode();

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

    const getColSpanClass = (colSpan?: number) => {
        switch (colSpan) {
            case 2:
                return 'md:col-span-2';
            case 3:
                return 'md:col-span-3';
            default:
                return '';
        }
    };

    // Asegurar que el valor nunca sea null
    const getSafeValue = (value: any, defaultValue: any = '') => {
        return value === null || value === undefined ? defaultValue : value;
    };

    const renderFilter = (filter: Filter, index: number) => {
        const baseInputClasses =
            'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100';

        switch (filter.type) {
            case 'search':
                return (
                    <div key={index} className={getColSpanClass(filter.colSpan)}>
                        <input
                            type="text"
                            placeholder={filter.placeholder}
                            value={getSafeValue(filter.value)}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className={baseInputClasses}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={index}>
                        <select value={getSafeValue(filter.value)} onChange={(e) => filter.onChange(e.target.value)} className={baseInputClasses}>
                            {filter.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'per_page':
                return (
                    <div key={index}>
                        <select
                            value={getSafeValue(filter.value, 10)}
                            onChange={(e) => filter.onChange(Number(e.target.value))}
                            className={baseInputClasses}
                        >
                            <option value={10}>10 por página</option>
                            <option value={25}>25 por página</option>
                            <option value={50}>50 por página</option>
                        </select>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">{filters.map((filter, index) => renderFilter(filter, index))}</div>
        </div>
    );
}
