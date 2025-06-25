import { useAppMode } from '@/contexts/AppModeContext';
import { ReactNode } from 'react';

interface FormField {
    type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'date';
    name: string;
    label: string;
    value: unknown;
    onChange: (value: unknown) => void;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string | number; label: string }>;
    rows?: number;
    step?: string;
    min?: string | number;
    span?: 1 | 2;
    error?: string;
}

interface FormSectionProps {
    title: string;
    fields?: FormField[];
    columns?: 1 | 2;
    children?: ReactNode;
}

export default function FormSection({ title, fields, columns = 2, children }: FormSectionProps) {
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
        return columns === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';
    };

    const getSpanClasses = (span: number = 1) => {
        if (span === 2 && columns === 2) {
            return 'md:col-span-2';
        }
        return '';
    };

    const baseInputClasses =
        'w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100';

    const renderField = (field: FormField) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            let value: string | number = e.target.value;
            if (field.type === 'number') {
                value = Number(e.target.value);
            }
            field.onChange(value);
        };

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        id={field.name}
                        value={String(field.value || '')}
                        onChange={handleChange}
                        rows={field.rows || 3}
                        className={baseInputClasses}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );

            case 'select':
                return (
                    <select id={field.name} value={String(field.value || '')} onChange={handleChange} className={baseInputClasses} required={field.required}>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            default:
                return (
                    <input
                        id={field.name}
                        type={field.type}
                        value={String(field.value || '')}
                        onChange={handleChange}
                        className={baseInputClasses}
                        placeholder={field.placeholder}
                        required={field.required}
                        step={field.step}
                        min={field.min}
                    />
                );
        }
    };

    return (
        <div className="space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{title}</h3>

            {children ? (
                children
            ) : fields && fields.length > 0 ? (
                <div className={`grid gap-4 ${getGridClasses()}`}>
                    {fields.map((field) => (
                        <div key={field.name} className={getSpanClasses(field.span)}>
                            <label htmlFor={field.name} className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {field.label}
                                {field.required && <span className="ml-1 text-red-500">*</span>}
                            </label>
                            {renderField(field)}
                            {field.error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{field.error}</p>}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
