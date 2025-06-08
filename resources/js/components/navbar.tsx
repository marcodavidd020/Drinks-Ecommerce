import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';

interface User {
    id: number;
    nombre: string;
    email: string;
    role?: string;
}

interface NavbarProps {
    user?: User;
}

export default function Navbar({ user }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { url } = usePage();
    const { settings } = useAppMode();

    // Cerrar menús al cambiar el tamaño de pantalla o hacer click fuera
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
                setIsUserMenuOpen(false);
            }
        };

        const handleClickOutside = () => {
            setIsUserMenuOpen(false);
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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

    const getModeColors = () => {
        switch (settings.ageMode) {
            case 'niños':
                return {
                    bg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500',
                    text: 'text-white',
                    hover: 'hover:bg-white/20',
                    button: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
                    active: 'bg-white/30'
                };
            case 'jóvenes':
                return {
                    bg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
                    text: 'text-white',
                    hover: 'hover:bg-white/10',
                    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm',
                    active: 'bg-white/20'
                };
            default:
                return {
                    bg: 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700',
                    text: 'text-gray-900 dark:text-gray-100',
                    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white',
                    active: 'bg-gray-100 dark:bg-gray-800'
                };
        }
    };

    const colors = getModeColors();

    // Verificar si es administrador o superadministrador
    const isAdmin = user && (user.role === 'administrador' || user.role === 'superadministrador');
    const isClient = user && user.role === 'cliente';

    // Enlaces públicos para todos los usuarios
    const publicLinks = [
        { 
            href: '/', 
            label: getTextByMode({
                niños: '🏠 Inicio',
                jóvenes: '🏠 Home',
                adultos: 'Inicio'
            }),
            icon: '🏠'
        },
        { 
            href: '/productos', 
            label: getTextByMode({
                niños: '🛍️ Cositas',
                jóvenes: '🛍️ Products',
                adultos: 'Productos'
            }),
            icon: '🛍️'
        },
        { 
            href: '/categorias', 
            label: getTextByMode({
                niños: '📦 Tipos',
                jóvenes: '📦 Categories',
                adultos: 'Categorías'
            }),
            icon: '📦'
        },
        { 
            href: '/promociones', 
            label: getTextByMode({
                niños: '🎉 Ofertas',
                jóvenes: '🎉 Deals',
                adultos: 'Promociones'
            }),
            icon: '🎉'
        }
    ];

    // Enlaces para clientes autenticados
    const clientLinks = [
        { 
            href: '/mi-cuenta', 
            label: getTextByMode({
                niños: '👤 Mi Perfil',
                jóvenes: '👤 Mi Cuenta',
                adultos: 'Mi Cuenta'
            }),
            icon: '👤'
        },
        { 
            href: '/mis-pedidos', 
            label: getTextByMode({
                niños: '📦 Mis Pedidos',
                jóvenes: '📦 Pedidos',
                adultos: 'Mis Pedidos'
            }),
            icon: '📦'
        }
    ];

    // Enlaces para administradores
    const adminLinks = [
        { 
            href: '/dashboard', 
            label: getTextByMode({
                niños: '🎮 Panel Admin',
                jóvenes: '📊 Dashboard',
                adultos: 'Dashboard'
            }),
            icon: '📊'
        },
        { 
            href: '/usuarios', 
            label: getTextByMode({
                niños: '👥 Usuarios',
                jóvenes: '👥 Users',
                adultos: 'Usuarios'
            }),
            icon: '👥'
        },
        { 
            href: '/clientes', 
            label: getTextByMode({
                niños: '😊 Clientes',
                jóvenes: '👥 Clientes',
                adultos: 'Clientes'
            }),
            icon: '👥'
        },
        { 
            href: '/reportes', 
            label: getTextByMode({
                niños: '📊 Reportes',
                jóvenes: '📊 Reports',
                adultos: 'Reportes'
            }),
            icon: '📊'
        }
    ];

    const isCurrentRoute = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    const handleUserMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <nav className={`sticky top-0 z-50 ${colors.bg} ${getModeClasses()}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className={`text-2xl font-bold ${colors.text}`}>
                            {settings.ageMode === 'niños' && '🌟 '}
                            {settings.ageMode === 'jóvenes' && '🔥 '}
                            {getTextByMode({
                                niños: 'TiendaKids',
                                jóvenes: 'ShopZone',
                                adultos: 'Nuestra Tienda'
                            })}
                        </div>
                    </Link>

                    {/* Enlaces principales - Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${
                                    isCurrentRoute(link.href) ? colors.active : colors.hover
                                }`}
                            >
                                <span className="hidden lg:inline">{link.icon} </span>
                                {link.label}
                            </Link>
                        ))}

                        {/* Enlaces específicos para clientes */}
                        {isClient && (
                            <>
                                <div className="mx-2 h-6 w-px bg-white/20 dark:bg-gray-600"></div>
                                {clientLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${
                                            isCurrentRoute(link.href) ? colors.active : colors.hover
                                        }`}
                                    >
                                        <span className="hidden lg:inline">{link.icon} </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </>
                        )}

                        {/* Enlaces específicos para administradores */}
                        {isAdmin && (
                            <>
                                <div className="mx-2 h-6 w-px bg-white/20 dark:bg-gray-600"></div>
                                {adminLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${
                                            isCurrentRoute(link.href) ? colors.active : colors.hover
                                        }`}
                                    >
                                        <span className="hidden lg:inline">{link.icon} </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Usuario y botones - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={handleUserMenuClick}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${colors.hover}`}
                                >
                                    <span className="text-lg">👤</span>
                                    <span className="hidden lg:inline">
                                        {getTextByMode({
                                            niños: `¡Hola ${user.nombre.split(' ')[0]}!`,
                                            jóvenes: `Hey ${user.nombre.split(' ')[0]}!`,
                                            adultos: user.nombre.split(' ')[0]
                                        })}
                                    </span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                            <div className="font-medium">{user.nombre}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                        <Link
                                            href="/perfil"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {getTextByMode({
                                                niños: '⚙️ Mi Perfil',
                                                jóvenes: '⚙️ Perfil',
                                                adultos: 'Mi Perfil'
                                            })}
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {getTextByMode({
                                                niños: '👋 Salir',
                                                jóvenes: '👋 Logout',
                                                adultos: 'Cerrar Sesión'
                                            })}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.button}`}
                                >
                                    {getTextByMode({
                                        niños: '🔐 Entrar',
                                        jóvenes: '🔐 Login',
                                        adultos: 'Iniciar Sesión'
                                    })}
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                        settings.ageMode === 'adultos' 
                                            ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400'
                                            : 'border-white/30 text-white hover:bg-white/20'
                                    }`}
                                >
                                    {getTextByMode({
                                        niños: '✨ Registro',
                                        jóvenes: '✨ Sign Up',
                                        adultos: 'Registrarse'
                                    })}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Botón de menú móvil */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-md ${colors.text} ${colors.hover}`}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menú móvil */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/20 dark:border-gray-700">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Enlaces públicos */}
                            <div className="space-y-1">
                                {publicLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${
                                            isCurrentRoute(link.href) ? colors.active : colors.hover
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.icon} {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Enlaces para clientes */}
                            {isClient && (
                                <>
                                    <div className="border-t border-white/20 dark:border-gray-700 my-2 pt-2">
                                        <div className={`px-3 py-1 text-xs font-medium ${colors.text} opacity-75`}>
                                            {getTextByMode({
                                                niños: '👤 Mi Zona',
                                                jóvenes: 'Mi Cuenta',
                                                adultos: 'Área Personal'
                                            })}
                                        </div>
                                        {clientLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${
                                                    isCurrentRoute(link.href) ? colors.active : colors.hover
                                                }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.icon} {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Enlaces para administradores */}
                            {isAdmin && (
                                <>
                                    <div className="border-t border-white/20 dark:border-gray-700 my-2 pt-2">
                                        <div className={`px-3 py-1 text-xs font-medium ${colors.text} opacity-75`}>
                                            {getTextByMode({
                                                niños: '🎮 Panel Admin',
                                                jóvenes: 'Administración',
                                                adultos: 'Panel de Administración'
                                            })}
                                        </div>
                                        {adminLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${
                                                    isCurrentRoute(link.href) ? colors.active : colors.hover
                                                }`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.icon} {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Usuario/Auth en móvil */}
                            <div className="border-t border-white/20 dark:border-gray-700 pt-4">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className={`px-3 py-2 text-sm ${colors.text}`}>
                                            <div className="font-medium">👤 {user.nombre}</div>
                                            <div className="text-xs opacity-75">{user.email}</div>
                                        </div>
                                        <Link
                                            href="/perfil"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            ⚙️ {getTextByMode({
                                                niños: 'Mi Perfil',
                                                jóvenes: 'Perfil',
                                                adultos: 'Mi Perfil'
                                            })}
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            👋 {getTextByMode({
                                                niños: 'Salir',
                                                jóvenes: 'Logout',
                                                adultos: 'Cerrar Sesión'
                                            })}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            href="/login"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            🔐 {getTextByMode({
                                                niños: 'Entrar',
                                                jóvenes: 'Login',
                                                adultos: 'Iniciar Sesión'
                                            })}
                                        </Link>
                                        <Link
                                            href="/register"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            ✨ {getTextByMode({
                                                niños: 'Registro',
                                                jóvenes: 'Sign Up',
                                                adultos: 'Registrarse'
                                            })}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 