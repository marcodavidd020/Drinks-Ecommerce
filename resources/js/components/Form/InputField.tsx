import { forwardRef } from 'react';
import { Input } from './Input';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, required, containerClassName, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={containerClassName}>
                {label && (
                    <Label htmlFor={inputId} required={required}>
                        {label}
                    </Label>
                )}
                <Input
                    id={inputId}
                    error={!!error}
                    ref={ref}
                    {...props}
                />
                <ErrorMessage message={error} />
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export { InputField }; 
