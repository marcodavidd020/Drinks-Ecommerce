import { useAppMode } from '@/contexts/AppModeContext';

interface InfoField {
    label: string;
    value: string | number | React.ReactNode;
    span?: 1 | 2;
    icon?: string;
}

interface InfoCardProps {
    title: string;
    fields: InfoField[];
    columns?: 1 | 2 | 3;
    className?: string;
}

export default function InfoCard({ title, fields, columns = 2, className = '' }: InfoCardProps) {
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

    const getGridClasses = () => {
        switch (columns) {
            case 1:
                return 'grid-cols-1';
            case 3:
                return 'grid-cols-1 sm:grid-cols-3';
            default:
                return 'grid-cols-1 sm:grid-cols-2';
        }
    };

    const getSpanClasses = (span: number = 1) => {
        if (span === 2 && columns >= 2) {
            return 'sm:col-span-2';
        }
        return '';
    };

    return (
        <div className={`rounded-lg bg-white p-6 shadow dark:bg-gray-800 ${className}`}>
            <h2 className={`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                {title}
            </h2>

            <div className={`grid gap-4 ${getGridClasses()}`}>
                {fields.map((field, index) => (
                    <div key={index} className={getSpanClasses(field.span)}>
                        <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {field.icon && <span className="mr-1">{field.icon}</span>}
                            {field.label}
                        </label>
                        <div className={`mt-1 text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {field.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 