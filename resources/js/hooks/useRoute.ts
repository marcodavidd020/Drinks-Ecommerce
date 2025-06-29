import { route as ziggyRoute } from 'ziggy-js';
import { useCallback } from 'react';

// Declaración global para Ziggy
declare global {
    interface Window {
        route: typeof ziggyRoute;
        Ziggy: {
            url: string;
            port: number | null;
            defaults: Record<string, any>;
            routes: Record<string, any>;
        };
    }
}

/**
 * Hook para usar las rutas de Laravel/Ziggy en React
 */
export function useRoute() {
    const route = useCallback((name: string, params?: any, absolute = true) => {
        // Usar la función global de Ziggy si está disponible
        if (window.route) {
            return window.route(name, params, absolute);
        }
        
        // Fallback si Ziggy no está cargado
        console.warn('Ziggy no está disponible. Asegúrate de incluir @routes en tu vista.');
        return '#';
    }, []);

    const current = useCallback((name?: string) => {
        // Para dashboard, usar comparación simple con window.location
        return window.location.pathname.includes(name || '');
    }, []);

    const has = useCallback((name: string) => {
        if (window.Ziggy && window.Ziggy.routes) {
            return name in window.Ziggy.routes;
        }
        return false;
    }, []);

    return {
        route,
        current,
        has
    };
}

/**
 * Tipos comunes de rutas para autocompletado
 */
export type RouteNames = 
    | 'dashboard'
    | 'home'
    | 'users.index'
    | 'users.show'
    | 'users.create'
    | 'users.edit'
    | 'admin.roles'
    | 'admin.permissions'
    | 'reports.index';

/**
 * Hook tipado para rutas específicas
 */
export function useTypedRoute() {
    const { route, current, has } = useRoute();

    const typedRoute = useCallback((name: RouteNames, params?: any, absolute = true) => {
        return route(name, params, absolute);
    }, [route]);

    const isCurrent = useCallback((name: RouteNames) => {
        return current(name);
    }, [current]);

    const hasRoute = useCallback((name: RouteNames) => {
        return has(name);
    }, [has]);

    return {
        route: typedRoute,
        current: isCurrent,
        has: hasRoute
    };
} 