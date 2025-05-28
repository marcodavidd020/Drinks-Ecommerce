interface Column {
    key: string;
    label: string;
    format?: 'date' | 'currency' | 'badge' | 'number';
}

interface Badge {
    text: string;
    color: string;
}

interface DataTableProps {
    title: string;
    columns: Column[];
    data: any[];
    emptyMessage: string;
    badge?: Badge;
}

export default function DataTable({ 
    title, 
    columns, 
    data = [],
    emptyMessage, 
    badge 
}: DataTableProps) {
    const validData = Array.isArray(data) ? data : [];

    const formatValue = (value: any, format?: string) => {
        if (!value) return '-';
        
        switch (format) {
            case 'date':
                return new Date(value).toLocaleDateString('es-CO');
            case 'currency':
                return new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0
                }).format(value);
            case 'number':
                return new Intl.NumberFormat('es-CO').format(value);
            case 'badge':
                const badgeClass = value === 'completada' || value === 'resuelto' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : value === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
                
                return (
                    <span className={`text-adaptive inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
                        {value}
                    </span>
                );
            default:
                return value;
        }
    };

    return (
        <div className="card card-adaptive p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-adaptive text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
                {badge && (
                    <span className={`text-adaptive inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
                        {badge.text}
                    </span>
                )}
            </div>
            
            {validData.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-adaptive text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="text-adaptive px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {validData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="text-adaptive px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                                        >
                                            {formatValue(row[column.key], column.format)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 