import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface ShowHeaderProps {
    title: string;
    description: string;
    editHref?: string;
    backHref: string;
    editText?: string;
    backText?: string;
}

export default function ShowHeader({ 
    title, 
    description, 
    editHref, 
    backHref, 
    editText, 
    backText 
}: ShowHeaderProps) {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

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

    const defaultEditText = getTextByMode({
        niños: 'Editar',
        jóvenes: 'Editar',
        adultos: 'Editar',
    });

    const defaultBackText = getTextByMode({
        niños: 'Volver',
        jóvenes: 'Volver',
        adultos: 'Volver',
    });

    return (
        <div className="flex items-start justify-between">
            <div>
                <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                    {title}
                </h1>
                <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {description}
                </p>
            </div>

            <div className="flex space-x-3">
                {editHref && (
                    <Link
                        href={editHref}
                        className={`flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 ${getModeClasses()}`}
                    >
                        <span>✏️</span>
                        <span>{editText || defaultEditText}</span>
                    </Link>
                )}
                <Link
                    href={backHref}
                    className={`flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600 ${getModeClasses()}`}
                >
                    <span>⬅️</span>
                    <span>{backText || defaultBackText}</span>
                </Link>
            </div>
        </div>
    );
} 