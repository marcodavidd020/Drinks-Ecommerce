import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface PriceFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
    currency?: string;
}

const PriceField = forwardRef<HTMLInputElement, PriceFieldProps>(
    ({ label, error, required, containerClassName, currency = '$', id, className, ...props }, ref) => {
        const inputId = id || `price-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={containerClassName}>
                {label && (
                    <Label htmlFor={inputId} required={required}>
                        {label}
                    </Label>
                )}
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{currency}</span>
                    </div>
                    <input
                        type="number"
                        id={inputId}
                        className={cn(
                            'w-full rounded-md border py-2 pr-3 pl-7 focus:ring-2 focus:outline-none transition-colors',
                            'border-gray-300 bg-white text-gray-900',
                            'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
                            'focus:border-blue-500 focus:ring-blue-500',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                            className
                        )}
                        step="0.01"
                        min="0"
                        ref={ref}
                        {...props}
                    />
                </div>
                <ErrorMessage message={error} />
            </div>
        );
    }
);

PriceField.displayName = 'PriceField';

export { PriceField }; 