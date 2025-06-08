import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { AppModeProvider } from './contexts/AppModeContext';
import { initializeTheme } from './hooks/use-appearance';
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
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
