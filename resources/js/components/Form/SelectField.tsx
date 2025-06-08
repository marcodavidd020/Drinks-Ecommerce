import { forwardRef } from 'react';
import { Select } from './Select';
import { Label } from './Label';
import { ErrorMessage } from './ErrorMessage';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
    options?: SelectOption[];
    placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, error, required, containerClassName, options, placeholder, id, children, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={containerClassName}>
                {label && (
                    <Label htmlFor={selectId} required={required}>
                        {label}
                    </Label>
                )}
                <Select
                    id={selectId}
                    error={!!error}
                    ref={ref}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                    {children}
                </Select>
                <ErrorMessage message={error} />
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';

export { SelectField }; 