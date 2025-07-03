import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

interface PageCountData {
    [key: string]: {
        count: number;
        lastVisit: string;
        firstVisit: string;
    };
}

export function usePageCounter() {
    const { url } = usePage();
    const [visitCount, setVisitCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const currentPage = url;
        const storageKey = 'bebifresh_page_counters';
        
        // Obtener datos existentes del localStorage
        const existingData: PageCountData = JSON.parse(
            localStorage.getItem(storageKey) || '{}'
        );

        // Actualizar contador para la página actual
        const now = new Date().toISOString();
        const pageData = existingData[currentPage];

        if (pageData) {
            // Página ya visitada, incrementar contador
            existingData[currentPage] = {
                count: pageData.count + 1,
                lastVisit: now,
                firstVisit: pageData.firstVisit
            };
        } else {
            // Primera visita a esta página
            existingData[currentPage] = {
                count: 1,
                lastVisit: now,
                firstVisit: now
            };
        }

        // Guardar en localStorage
        localStorage.setItem(storageKey, JSON.stringify(existingData));

        // Actualizar estados
        setVisitCount(existingData[currentPage].count);
        setTotalPages(Object.keys(existingData).length);

    }, [url]);

    // Función para obtener estadísticas completas
    const getPageStats = () => {
        const storageKey = 'bebifresh_page_counters';
        const data: PageCountData = JSON.parse(
            localStorage.getItem(storageKey) || '{}'
        );
        
        return {
            totalPages: Object.keys(data).length,
            totalVisits: Object.values(data).reduce((sum, page) => sum + page.count, 0),
            currentPageVisits: visitCount,
            mostVisitedPage: Object.entries(data).reduce(
                (max, [page, stats]) => 
                    stats.count > max.count ? { page, count: stats.count } : max,
                { page: '', count: 0 }
            )
        };
    };

    // Función para resetear contadores
    const resetCounters = () => {
        localStorage.removeItem('bebifresh_page_counters');
        setVisitCount(0);
        setTotalPages(0);
    };

    return {
        visitCount,
        totalPages,
        getPageStats,
        resetCounters
    };
} 