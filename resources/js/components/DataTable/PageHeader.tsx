import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface PageHeaderProps {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    buttonColor?: 'blue' | 'green' | 'purple' | 'red';
}

export default function PageHeader({ 
    title,
    description, 
    buttonText, 
    buttonHref, 
    buttonColor = 'blue' 
}: PageHeaderProps) {
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

    const getButtonColorClasses = () => {
        const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors text-white';
        switch (buttonColor) {
            case 'green':
                return `${baseClasses} bg-green-600 hover:bg-green-700`;
            case 'purple':
                return `${baseClasses} bg-purple-600 hover:bg-purple-700`;
            case 'red':
                return `${baseClasses} bg-red-600 hover:bg-red-700`;
            default:
                return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
        }
    };

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                    {title}
                </h1>
                <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {description}
                </p>
            </div>
            
            {buttonText && buttonHref && buttonHref !== '#' && (
                <Link
                    href={buttonHref}
                    className={`${getButtonColorClasses()} ${getModeClasses()}`}
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
} 