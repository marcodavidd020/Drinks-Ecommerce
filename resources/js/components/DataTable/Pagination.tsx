import { useAppModeText } from '@/hooks/useAppModeText';
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
    const { getTextByMode, getModeClasses } = useAppModeText();

    // Si no hay metadatos o enlaces válidos, no renderizar el componente
    if (!meta || !meta.total || meta.total === 0 || !links || links.length === 0) {
        return null;
    }

    // Información de paginación formateada
    const from = meta?.from || 0;
    const to = meta?.to || 0;
    const total = meta?.total || 0;
    const currentPage = meta?.current_page || 1;
    const lastPage = meta?.last_page || 1;

    // Filtrar enlaces para obtener navegación específica
    const prevLink = links.find(link => link.label.includes('Anterior') || link.label.includes('Previous') || link.label.includes('&laquo;'));
    const nextLink = links.find(link => link.label.includes('Siguiente') || link.label.includes('Next') || link.label.includes('&raquo;'));
    
    // Enlaces de páginas numeradas (excluyendo anterior/siguiente)
    const pageLinks = links.filter(link => 
        !link.label.includes('Anterior') && 
        !link.label.includes('Previous') && 
        !link.label.includes('Siguiente') && 
        !link.label.includes('Next') &&
        !link.label.includes('&laquo;') &&
        !link.label.includes('&raquo;') &&
        link.url
    );

    // Crear URL para primera y última página
    const firstPageUrl = pageLinks.length > 0 ? pageLinks[0].url?.replace(/page=\d+/, 'page=1') : null;
    const lastPageUrl = pageLinks.length > 0 ? pageLinks[0].url?.replace(/page=\d+/, `page=${lastPage}`) : null;

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                {/* Información de registros */}
                <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {total > 0 ? (
                        getTextByMode({
                            niños: `🔍 Mostrando ${from} a ${to} de ${total} ${entityName}`,
                            jóvenes: `Mostrando ${from} a ${to} de ${total} ${entityName}`,
                            adultos: `Mostrando ${from} a ${to} de ${total} ${entityName}`,
                        })
                    ) : (
                        getTextByMode({
                            niños: '😔 No hay registros',
                            jóvenes: 'No hay registros',
                            adultos: 'No hay registros para mostrar',
                        })
                    )}
                </div>

                {/* Navegación de páginas */}
                {lastPage > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {/* Primera página */}
                        {currentPage > 2 && (
                            <Link
                                href={firstPageUrl || '#'}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${getModeClasses()}`}
                                title={getTextByMode({
                                    niños: '¡Ir a la primera página!',
                                    jóvenes: 'Ir a la primera página',
                                    adultos: 'Primera página',
                                })}
                            >
                                {getTextByMode({
                                    niños: '⏮️ Primera',
                                    jóvenes: '⏮️ Primera',
                                    adultos: '⏮️',
                                })}
                            </Link>
                        )}

                        {/* Página anterior */}
                        {prevLink && prevLink.url && (
                            <Link
                                href={prevLink.url}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${getModeClasses()}`}
                                title={getTextByMode({
                                    niños: '¡Ir a la página anterior!',
                                    jóvenes: 'Página anterior',
                                    adultos: 'Página anterior',
                                })}
                            >
                                {getTextByMode({
                                    niños: '⬅️ Anterior',
                                    jóvenes: '⬅️ Anterior',
                                    adultos: '⬅️',
                                })}
                            </Link>
                        )}

                        {/* Páginas numeradas */}
                        {pageLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                    link.active
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                } ${getModeClasses()}`}
                                title={link.active 
                                    ? getTextByMode({
                                        niños: '📍 Página actual',
                                        jóvenes: 'Página actual',
                                        adultos: 'Página actual',
                                    })
                                    : getTextByMode({
                                        niños: `¡Ir a la página ${link.label}!`,
                                        jóvenes: `Ir a la página ${link.label}`,
                                        adultos: `Página ${link.label}`,
                                    })
                                }
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Página siguiente */}
                        {nextLink && nextLink.url && (
                            <Link
                                href={nextLink.url}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${getModeClasses()}`}
                                title={getTextByMode({
                                    niños: '¡Ir a la siguiente página!',
                                    jóvenes: 'Página siguiente',
                                    adultos: 'Página siguiente',
                                })}
                            >
                                {getTextByMode({
                                    niños: 'Siguiente ➡️',
                                    jóvenes: 'Siguiente ➡️',
                                    adultos: '➡️',
                                })}
                            </Link>
                        )}

                        {/* Última página */}
                        {currentPage < lastPage - 1 && (
                            <Link
                                href={lastPageUrl || '#'}
                                data={searchParams}
                                className={`rounded-md px-3 py-2 text-sm transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 ${getModeClasses()}`}
                                title={getTextByMode({
                                    niños: '¡Ir a la última página!',
                                    jóvenes: 'Ir a la última página',
                                    adultos: 'Última página',
                                })}
                            >
                                {getTextByMode({
                                    niños: 'Última ⏭️',
                                    jóvenes: 'Última ⏭️',
                                    adultos: '⏭️',
                                })}
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Información adicional de paginación */}
            {lastPage > 1 && (
                <div className={`mt-2 text-center text-xs text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                    {getTextByMode({
                        niños: `📄 Página ${currentPage} de ${lastPage}`,
                        jóvenes: `Página ${currentPage} de ${lastPage}`,
                        adultos: `Página ${currentPage} de ${lastPage}`,
                    })}
                </div>
            )}
        </div>
    );
}
