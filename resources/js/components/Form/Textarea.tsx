import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    'w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none transition-colors',
                    'border-gray-300 bg-white text-gray-900',
                    'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100',
                    'focus:border-blue-500 focus:ring-blue-500',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                    'resize-vertical min-h-[80px]',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea }; 