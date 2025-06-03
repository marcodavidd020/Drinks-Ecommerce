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

    // Debug: console log para ver qué datos recibimos
    console.log('Pagination - meta:', meta);
    console.log('Pagination - links:', links);

    // Si no hay metadatos válidos, renderizar componente básico
    if (!meta) {
        return (
            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <div className={`text-center text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {getTextByMode({
                        niños: '📄 Sin información de paginación',
                        jóvenes: 'Sin información de paginación',
                        adultos: 'Sin información de paginación',
                    })}
                </div>
            </div>
        );
    }

    // Información de paginación formateada
    const total = meta?.total || 0;
    const from = meta?.from || (total > 0 ? 1 : 0);
    const to = meta?.to || total;
    const currentPage = meta?.current_page || 1;
    const lastPage = meta?.last_page || 1;

    // Siempre mostrar información de paginación si hay datos
    const showPaginationInfo = true;

    // Filtrar enlaces para obtener navegación específica
    const prevLink = links?.find(link => link.label.includes('&laquo;') || link.label.includes('Anterior') || link.label.includes('Previous'));
    const nextLink = links?.find(link => link.label.includes('&raquo;') || link.label.includes('Siguiente') || link.label.includes('Next'));
    
    // Enlaces de páginas numeradas (excluyendo anterior/siguiente)
    const pageLinks = links?.filter(link => 
        !link.label.includes('&laquo;') &&
        !link.label.includes('&raquo;') &&
        !link.label.includes('Anterior') && 
        !link.label.includes('Previous') && 
        !link.label.includes('Siguiente') && 
        !link.label.includes('Next') &&
        link.url &&
        !isNaN(parseInt(link.label))
    ) || [];

    // Crear URLs para navegación manual si no hay enlaces
    const createPaginationUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return '?' + params.toString();
    };

    const firstPageUrl = pageLinks.length > 0 
        ? pageLinks[0].url?.replace(/page=\d+/, 'page=1') 
        : createPaginationUrl(1);
    
    const lastPageUrl = pageLinks.length > 0 
        ? pageLinks[0].url?.replace(/page=\d+/, `page=${lastPage}`) 
        : createPaginationUrl(lastPage);

    const prevPageUrl = prevLink?.url || (currentPage > 1 ? createPaginationUrl(currentPage - 1) : null);
    const nextPageUrl = nextLink?.url || (currentPage < lastPage ? createPaginationUrl(currentPage + 1) : null);

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                {/* Información de registros */}
                <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                    {total > 0 ? (
                        getTextByMode({
                            niños: `🔍 Mostrando ${from} a ${to} de ${total} ${entityName}s`,
                            jóvenes: `Mostrando ${from} a ${to} de ${total} ${entityName}s`,
                            adultos: `Mostrando ${from} a ${to} de ${total} ${entityName}s`,
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
                {lastPage > 1 && total > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {/* Primera página */}
                        {currentPage > 2 && firstPageUrl && (
                            <Link
                                href={firstPageUrl}
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
                        {prevPageUrl && (
                            <Link
                                href={prevPageUrl}
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

                        {/* Páginas numeradas o generar manualmente */}
                        {pageLinks.length > 0 ? (
                            pageLinks.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
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
                            ))
                        ) : (
                            // Generar páginas manualmente si no hay enlaces
                            Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                                let pageNum;
                                if (lastPage <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= lastPage - 2) {
                                    pageNum = lastPage - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }
                                
                                return (
                                    <Link
                                        key={pageNum}
                                        href={createPaginationUrl(pageNum)}
                                        className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                            pageNum === currentPage
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                        } ${getModeClasses()}`}
                                        title={pageNum === currentPage 
                                            ? getTextByMode({
                                                niños: '📍 Página actual',
                                                jóvenes: 'Página actual',
                                                adultos: 'Página actual',
                                            })
                                            : getTextByMode({
                                                niños: `¡Ir a la página ${pageNum}!`,
                                                jóvenes: `Ir a la página ${pageNum}`,
                                                adultos: `Página ${pageNum}`,
                                            })
                                        }
                                    >
                                        {pageNum}
                                    </Link>
                                );
                            })
                        )}

                        {/* Página siguiente */}
                        {nextPageUrl && (
                            <Link
                                href={nextPageUrl}
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
                        {currentPage < lastPage - 1 && lastPageUrl && (
                            <Link
                                href={lastPageUrl}
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
