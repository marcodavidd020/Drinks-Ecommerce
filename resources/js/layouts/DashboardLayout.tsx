import ModeSelector from '@/components/ModeSelector';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { useAppMode } from '@/contexts/AppModeContext';
import { Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    role?: string;
}

interface AuthProps {
    user?: User;
}

interface BreadcrumbItem {
    title: string;
    href?: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    header?: ReactNode;
    showModeSelector?: boolean;
    breadcrumbs?: BreadcrumbItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, header, showModeSelector = true, breadcrumbs }) => {
    const { settings } = useAppMode();
    const { props } = usePage();
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    // Obtener el usuario de las props de Inertia
    const user = (props.auth as AuthProps)?.user;

    const handleLogout = () => {
        router.post(
            '/logout',
            {},
            {
                onFinish: () => {
                    setShowUserDropdown(false);
                },
            },
        );
    };

    // Generar breadcrumbs automáticos basados en la URL si no se proporcionan
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        if (breadcrumbs) return breadcrumbs;

        const currentUrl = window.location.pathname;
        const pathSegments = currentUrl.split('/').filter((segment) => segment);

        const crumbs: BreadcrumbItem[] = [{ title: '🏠 Dashboard', href: '/dashboard' }];

        if (pathSegments.length > 0) {
            const sectionMap: Record<string, string> = {
                users: '👥 Usuarios',
                proveedores: '🏭 Proveedores',
                clientes: '👨‍💼 Clientes',
                productos: '📦 Productos',
                settings: '⚙️ Configuración',
            };

            for (let i = 0; i < pathSegments.length; i++) {
                const segment = pathSegments[i];
                const displayName = sectionMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
                const href = '/' + pathSegments.slice(0, i + 1).join('/');

                crumbs.push({
                    title: displayName,
                    href: i === pathSegments.length - 1 ? undefined : href,
                });
            }
        }

        return crumbs;
    };

    const currentBreadcrumbs = generateBreadcrumbs();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Contenido Principal */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Header del Dashboard */}
                <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="px-6 py-4">
                        {/* Breadcrumbs */}
                        <nav className="mb-4 flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                {currentBreadcrumbs.map((crumb, index) => (
                                    <li key={index} className="inline-flex items-center">
                                        {index > 0 && (
                                            <svg className="mx-1 h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                {crumb.title}
                                            </Link>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{crumb.title}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>

                        {/* Título y controles */}
                        <div className="flex items-center justify-between">
                            {/* Título - Solo mostrar si no hay header personalizado */}
                            <div className="flex items-center">
                                {!header && title && <h1 className="text-adaptive text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>}
                                {header}
                            </div>

                            {/* Usuario y selector de modos */}
                            <div className="flex items-center space-x-4">
                                {/* Selector de Modos */}
                                {showModeSelector && <ModeSelector />}

                                {/* Info del usuario */}
                                {user && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                                            className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.nombre}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role || 'Usuario'}</p>
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-medium text-white">
                                                {user.nombre.charAt(0).toUpperCase()}
                                            </div>
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Dropdown */}
                                        {showUserDropdown && (
                                            <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black dark:bg-gray-800">
                                                <Link
                                                    href={`/users/${user.id}`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    👤 Ver mi perfil
                                                </Link>
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    ✏️ Editar perfil
                                                </Link>
                                                <Link
                                                    href="/settings/profile"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    ⚙️ Configuración
                                                </Link>
                                                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                                                >
                                                    🚪 Cerrar sesión
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido Principal */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6">{children}</div>
                </main>
            </div>

            {/* Click fuera del dropdown para cerrarlo */}
            {showUserDropdown && <div className="fixed inset-0 z-10" onClick={() => setShowUserDropdown(false)} />}

            {/* Indicador de modo actual (solo en desarrollo) */}
            {import.meta.env.DEV && (
                <div className="bg-opacity-50 fixed bottom-4 left-4 z-50 rounded-lg bg-black px-3 py-2 text-xs text-white">
                    <div>Modo: {settings.ageMode}</div>
                    <div>Tema: {settings.currentTheme}</div>
                    <div>Fuente: {settings.fontSize}</div>
                    <div>Contraste: {settings.contrast}</div>
                    {user && <div>Usuario: {user.nombre}</div>}
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;
