import { useMemo } from 'react';

export function useRoute() {
    return useMemo(() => {
        // Verificar si window.route está disponible
        if (typeof window !== 'undefined' && window.route) {
            return (name: string, params?: any, absolute?: boolean): string => {
                try {
                    return window.route(name, params, absolute);
                } catch (error) {
                    console.warn(`Error generating route for "${name}":`, error);
                    return `/${name.replace('.', '/')}`;
                }
            };
        }
        
        // Fallback cuando window.route no está disponible
        return (name: string, params?: any, absolute?: boolean): string => {
            return `/${name.replace('.', '/')}`;
        };
    }, []);
} 