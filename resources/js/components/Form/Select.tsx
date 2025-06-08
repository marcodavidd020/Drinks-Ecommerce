import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, children, ...props }, ref) => {
        return (
            <select
                className={cn(
                    'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none transition-colors',
                    'border-gray-300 bg-white text-gray-900',
                    'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
                    'focus:border-blue-500 focus:ring-blue-500',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';

export { Select };
