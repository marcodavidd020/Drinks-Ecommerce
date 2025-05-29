import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    from?: number;
    to?: number;
    total?: number;
}

interface PaginationProps {
    links: PaginationLink[];
    meta: PaginationMeta;
    searchParams: Record<string, any>;
    entityName: string;
}

export default function Pagination({ links, meta, searchParams, entityName }: PaginationProps) {
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
                <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {getTextByMode({
                        niños: `Mostrando ${meta?.from || 0} a ${meta?.to || 0} de ${meta?.total || 0} ${entityName}`,
                        jóvenes: `Mostrando ${meta?.from || 0} a ${meta?.to || 0} de ${meta?.total || 0} ${entityName}`,
                        adultos: `Mostrando ${meta?.from || 0} a ${meta?.to || 0} de ${meta?.total || 0} ${entityName}`
                    })}
                </div>
                <div className="flex space-x-1">
                    {links?.map((link, index) => (
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                data={searchParams}
                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                    link.active 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                } ${getModeClasses()}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={index}
                                className={`px-3 py-2 text-sm rounded-md text-gray-400 dark:text-gray-600 ${getModeClasses()}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )) || []}
                </div>
            </div>
        </div>
    );
} 