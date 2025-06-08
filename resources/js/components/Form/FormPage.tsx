import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface FormPageProps {
    title: string;
    description: string;
    backHref: string;
    backText: string;
    children: ReactNode;
}

export default function FormPage({ title, description, backHref, backText, children }: FormPageProps) {
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
        <div className={`space-y-6 ${getModeClasses()}`}>
            <div className="mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href={backHref}
                        className={`font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ${getModeClasses()}`}
                    >
                        ←{' '}{backText}
                    </Link>
                </div>
                <h1 className={`mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                    {title}
                </h1>
                <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {description}
                </p>
            </div>
            
            {children}
        </div>
    );
} 