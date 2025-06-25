import { useAppMode } from '@/contexts/AppModeContext';
import { Link } from '@inertiajs/react';

interface Column {
    key: string;
    label: string;
    render?: (value: unknown, item: unknown) => React.ReactNode;
    className?: string;
}

interface Action {
    type: 'view' | 'edit' | 'delete' | 'toggle' | 'custom';
    href?: string;
    onClick?: (item: Record<string, unknown>) => void;
    icon: string;
    title: string;
    className?: string;
    condition?: (item: Record<string, unknown>) => boolean;
}

interface DataTableProps {
    data: Record<string, unknown>[];
    columns: Column[];
    actions: Action[];
    emptyState: {
        icon: string;
        title: string;
        description: string;
        showAddButton?: boolean;
        addButtonText?: string;
        addButtonHref?: string;
    };
    getItemKey: (item: Record<string, unknown>) => string | number;
}

export default function DataTable({ data, columns, actions, emptyState, getItemKey }: DataTableProps) {
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

    const renderCellValue = (column: Column, item: Record<string, unknown>) => {
        if (column.render) {
            return column.render(item[column.key], item);
        }
        const value = item[column.key];
        return value !== undefined && value !== null ? value : '-';
    };

    const renderAction = (action: Action, item: Record<string, unknown>, index: number) => {
        // Verificar condición si existe
        if (action.condition && !action.condition(item)) {
            return null;
        }

        const baseClasses = action.className || 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300';

        if (action.type === 'view') {
            return (
                <Link key={index} href={action.href?.replace(':id', String(item.id)) || ''} className={baseClasses} title={action.title}>
                    {action.icon}
                </Link>
            );
        }

        if (action.type === 'edit') {
            return (
                <Link key={index} href={action.href?.replace(':id', String(item.id)) || ''} className={baseClasses} title={action.title}>
                    {action.icon}
                </Link>
            );
        }

        if (action.type === 'delete' || action.type === 'toggle' || action.type === 'custom') {
            return (
                <button key={index} onClick={() => action.onClick?.(item)} className={baseClasses} title={action.title}>
                    {action.icon}
                </button>
            );
        }

        return null;
    };

    if (data.length === 0) {
        return (
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="p-12 text-center">
                    <div className="mb-4 text-6xl">{emptyState.icon}</div>
                    <h3 className={`mb-2 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{emptyState.title}</h3>
                    <p className={`mb-4 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>{emptyState.description}</p>
                    {emptyState.showAddButton && emptyState.addButtonHref && (
                        <Link
                            href={emptyState.addButtonHref}
                            className={`inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 ${getModeClasses()}`}
                        >
                            {emptyState.addButtonText}
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 ${getModeClasses()} ${column.className || ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th
                                    className={`px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400 ${getModeClasses()}`}
                                >
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                        {data.map((item) => (
                            <tr key={getItemKey(item)} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                {columns.map((column) => (
                                    <td key={column.key} className={`px-6 py-4 whitespace-nowrap ${getModeClasses()} ${column.className || ''}`}>
                                        {renderCellValue(column, item)}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td className={`px-6 py-4 text-right text-sm font-medium whitespace-nowrap ${getModeClasses()}`}>
                                        <div className="flex justify-end space-x-2">
                                            {actions.map((action, index) => renderAction(action, item, index))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
