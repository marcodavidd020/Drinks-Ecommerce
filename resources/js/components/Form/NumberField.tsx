import { forwardRef } from 'react';
import { Input } from './Input';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
    allowDecimals?: boolean;
    allowNegative?: boolean;
}

const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
    ({ 
        label, 
        error, 
        required, 
        containerClassName, 
        allowDecimals = false,
        allowNegative = false,
        id, 
        step,
        min,
        ...props 
    }, ref) => {
        const inputId = id || `number-${Math.random().toString(36).substr(2, 9)}`;

        // Configurar step automáticamente si no se proporciona
        const finalStep = step !== undefined ? step : (allowDecimals ? '0.01' : '1');
        
        // Configurar min automáticamente si no se proporciona y no se permiten negativos
        const finalMin = min !== undefined ? min : (!allowNegative ? '0' : undefined);

        return (
            <div className={containerClassName}>
                {label && (
                    <Label htmlFor={inputId} required={required}>
                        {label}
                    </Label>
                )}
                <Input
                    type="number"
                    id={inputId}
                    error={!!error}
                    step={finalStep}
                    min={finalMin}
                    ref={ref}
                    {...props}
                />
                <ErrorMessage message={error} />
            </div>
        );
    }
);

NumberField.displayName = 'NumberField';

export { NumberField };
