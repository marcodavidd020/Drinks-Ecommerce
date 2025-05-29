import { useAppMode } from '@/contexts/AppModeContext';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    from?: number;
    to?: number;
    total?: number;
    current_page?: number;
    last_page?: number;
}

interface PaginationProps {
    links: PaginationLink[];
    meta: PaginationMeta;
    searchParams: Record<string, any>;
    entityName: string;
}

export default function Pagination({ links, meta, searchParams, entityName }: PaginationProps) {
    const { settings } = useAppMode();

    // Si no hay metadatos o enlaces válidos, no renderizar el componente
    if (!meta || !meta.total || meta.total === 0 || !links || links.length === 0) {
        return null;
    }

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

    // Información de paginación formateada
    const from = meta?.from || 0;
    const to = meta?.to || 0;
    const total = meta?.total || 0;
    const currentPage = meta?.current_page || 1;
    const lastPage = meta?.last_page || 1;

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {getTextByMode({
                        niños: `Mostrando ${from} a ${to} de ${total} ${entityName}`,
                        jóvenes: `Mostrando ${from} a ${to} de ${total} ${entityName}`,
                        adultos: `Mostrando ${from} a ${to} de ${total} ${entityName}`,
                    })}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                    {links
                        ?.filter((link) => link.url)
                        .map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                } ${getModeClasses()}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
