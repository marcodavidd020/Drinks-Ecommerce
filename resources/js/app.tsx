import { createInertiaApp } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import '../css/app.css';
import { AppModeProvider } from './contexts/AppModeContext';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Define una URL base para todas las rutas generadas por Inertia
const appUrl = import.meta.env.PROD 
    ? '/inf513/grupo21sc/Drinks-Ecommerce/public' 
    : '';

// Configurar Axios para usar la URL base correcta
axios.defaults.withCredentials = true;
axios.defaults.baseURL = window.location.origin + appUrl;

// Configurar interceptor para todas las solicitudes Axios para asegurarnos que usen la URL base correcta
axios.interceptors.request.use(config => {
    // Asegurarse de que todas las URLs relativas incluyan el path base
    if (config.url && config.url.startsWith('/') && !config.url.startsWith(appUrl)) {
        config.url = appUrl + config.url;
    }
    return config;
});

// Reemplazar la función visit de Inertia para que use la URL base correcta
const originalVisit = router.visit;
router.visit = function(url: string, options?: any): void {
    // Si la URL es relativa y no incluye el path base, agregarlo
    if (typeof url === 'string' && url.startsWith('/') && !url.startsWith(appUrl) && appUrl !== '') {
        url = appUrl + url;
    }
    return originalVisit.call(this, url, options);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AppModeProvider>
                {' '}
                <App {...props} />{' '}
            </AppModeProvider>,
        );
    },
    progress: { color: '#4B5563' },
});
initializeTheme();
