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
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const { url } = usePage();
    const { settings } = useAppMode();

    // Cerrar menú al cambiar el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
                    button: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                };
            case 'jóvenes':
                return {
                    bg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
                    text: 'text-white',
                    hover: 'hover:bg-white/10',
                    button: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                };
            default:
                return {
                    bg: 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700',
                    text: 'text-gray-900 dark:text-gray-100',
                    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
                    button: 'bg-blue-600 hover:bg-blue-700 text-white'
                };
        }
    };

    const colors = getModeColors();

    // Enlaces principales
    const mainLinks = [
        { 
            href: '/', 
            label: getTextByMode({
                niños: '🏠 Inicio',
                jóvenes: '🏠 Home',
                adultos: 'Inicio'
            })
        },
        { 
            href: '/productos', 
            label: getTextByMode({
                niños: '🛍️ Cositas',
                jóvenes: '🛍️ Products',
                adultos: 'Productos'
            })
        },
        { 
            href: '/categorias', 
            label: getTextByMode({
                niños: '📦 Tipos',
                jóvenes: '📦 Categories',
                adultos: 'Categorías'
            })
        },
        { 
            href: '/promociones', 
            label: getTextByMode({
                niños: '🎉 Ofertas',
                jóvenes: '🎉 Deals',
                adultos: 'Promociones'
            })
        },
        { 
            href: '/contacto', 
            label: getTextByMode({
                niños: '📞 Ayuda',
                jóvenes: '📞 Contact',
                adultos: 'Contacto'
            })
        }
    ];

    // Enlaces de administración para usuarios autenticados
    const adminLinks = user ? [
        { 
            href: '/dashboard', 
            label: getTextByMode({
                niños: '🎮 Mi Panel',
                jóvenes: '📊 Dashboard',
                adultos: 'Dashboard'
            })
        },
        { 
            href: '/users', 
            label: getTextByMode({
                niños: '👥 Usuarios',
                jóvenes: '👥 Users',
                adultos: 'Usuarios'
            })
        },
        { 
            href: '/clientes', 
            label: getTextByMode({
                niños: '😊 Amigos',
                jóvenes: '👥 Clientes',
                adultos: 'Clientes'
            })
        },
        { 
            href: '/proveedores', 
            label: getTextByMode({
                niños: '🏭 Proveedores',
                jóvenes: '🏭 Suppliers',
                adultos: 'Proveedores'
            })
        },
        { 
            href: '/reportes', 
            label: getTextByMode({
                niños: '📊 Reportes',
                jóvenes: '📊 Reports',
                adultos: 'Reportes'
            })
        }
    ] : [];

    const isCurrentRoute = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
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
                        {mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${colors.hover}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Enlaces de admin si está autenticado */}
                        {user && (
                            <div className="ml-4 pl-4 border-l border-white/20">
                                {adminLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${colors.hover} ml-1`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Usuario y botones - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className={`text-sm ${colors.text}`}>
                                    {getTextByMode({
                                        niños: `¡Hola ${user.nombre}! 👋`,
                                        jóvenes: `Hey ${user.nombre}! 👋`,
                                        adultos: `Bienvenido, ${user.nombre}`
                                    })}
                                </span>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors.button}`}
                                >
                                    {getTextByMode({
                                        niños: '👋 Salir',
                                        jóvenes: '👋 Logout',
                                        adultos: 'Cerrar Sesión'
                                    })}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
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
                                            ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
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
                    <div className="md:hidden border-t border-white/20">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Enlaces principales */}
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Enlaces de admin si está autenticado */}
                            {user && (
                                <>
                                    <div className="border-t border-white/20 my-2"></div>
                                    {adminLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </>
                            )}

                            {/* Usuario/Auth en móvil */}
                            <div className="border-t border-white/20 pt-4">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className={`px-3 py-2 text-sm ${colors.text}`}>
                                            {getTextByMode({
                                                niños: `¡Hola ${user.nombre}! 👋`,
                                                jóvenes: `Hey ${user.nombre}! 👋`,
                                                adultos: `Bienvenido, ${user.nombre}`
                                            })}
                                        </div>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {getTextByMode({
                                                niños: '👋 Salir',
                                                jóvenes: '👋 Logout',
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
                                            {getTextByMode({
                                                niños: '🔐 Entrar',
                                                jóvenes: '🔐 Login',
                                                adultos: 'Iniciar Sesión'
                                            })}
                                        </Link>
                                        <Link
                                            href="/register"
                                            className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                            onClick={() => setIsMenuOpen(false)}
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
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 