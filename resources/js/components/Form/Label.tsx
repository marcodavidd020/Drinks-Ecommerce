import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useAppMode } from '@/contexts/AppModeContext';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, required, ...props }, ref) => {
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

        return (
            <label
                ref={ref}
                className={cn(
                    'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300',
                    getModeClasses(),
                    className
                )}
                {...props}
            >
                {children}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
        );
    }
);

Label.displayName = 'Label';

export { Label };
