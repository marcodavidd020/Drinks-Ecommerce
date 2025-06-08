import { cn } from '@/lib/utils';

interface ErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
    message?: string;
}

export function ErrorMessage({ message, className, ...props }: ErrorMessageProps) {
    if (!message) return null;

    return (
        <p
            className={cn(
                'mt-1 text-sm text-red-600 dark:text-red-400',
                className
            )}
            {...props}
        >
            {message}
        </p>
    );
}
