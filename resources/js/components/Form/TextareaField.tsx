import { forwardRef } from 'react';
import { Textarea } from './Textarea';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({ label, error, required, containerClassName, id, ...props }, ref) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={containerClassName}>
                {label && (
                    <Label htmlFor={textareaId} required={required}>
                        {label}
                    </Label>
                )}
                <Textarea
                    id={textareaId}
                    error={!!error}
                    ref={ref}
                    {...props}
                />
                <ErrorMessage message={error} />
            </div>
        );
    }
);

TextareaField.displayName = 'TextareaField';

export { TextareaField };
