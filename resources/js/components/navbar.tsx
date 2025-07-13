import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import axios from 'axios';

interface User {
    id: number;
    nombre: string;
    email: string;
    roles?: { name: string }[];
}

interface NavbarProps {
    user?: User;
}

export default function Navbar({ user }: NavbarProps) {
    const { settings } = useAppMode();
    const page = usePage();
    const { url } = page;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [carritoCount, setCarritoCount] = useState(0);

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

    // Verificar roles con Spatie
    const userRoles = (user?.roles as Array<{ name: string }>) || [];
    const hasRole = (role: string): boolean => {
        return userRoles.some(r => r.name === role);
    };
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    // Verificar tipo de usuario
    const isCliente = user && hasRole('cliente') && !hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);
    const isAdministrativo = user && hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);

    // Función para obtener el conteo del carrito
    const fetchCarritoCount = useCallback(async () => {
        if (!isCliente) return;
        
        try {
            const baseUrl = axios.defaults.baseURL;
            const response = await fetch(baseUrl + '/api/carrito/count', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCarritoCount(data.count || 0);
            }
        } catch (error) {
            console.error('Error obteniendo contador del carrito:', error);
        }
    }, [isCliente]);

    // Cargar el conteo del carrito al montar el componente
    useEffect(() => {
        fetchCarritoCount();
    }, [fetchCarritoCount]);

    // Escuchar eventos de actualización del carrito
    useEffect(() => {
        const handleCarritoUpdate = () => {
            fetchCarritoCount();
        };

        window.addEventListener('carrito-updated', handleCarritoUpdate);
        return () => window.removeEventListener('carrito-updated', handleCarritoUpdate);
    }, [fetchCarritoCount]);

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

    // Enlaces principales
    const getMainLinks = () => {
        if (isCliente) {
            // Enlaces para clientes
            return [
                { 
                    href: '/', 
                    label: getTextByMode({
                        niños: '🧃 Explorar Bebidas',
                        jóvenes: '🧃 Bebidas',
                        adultos: 'Explorar Bebidas'
                    }),
                    icon: '🧃'
                },
                { 
                    href: '/cliente/dashboard', 
                    label: getTextByMode({
                        niños: '🏠 Mi Dashboard',
                        jóvenes: '🏠 Dashboard',
                        adultos: 'Mi Dashboard'
                    }),
                    icon: '🏠'
                },
                { 
                    href: '/cliente/compras', 
                    label: getTextByMode({
                        niños: '📦 Mis Compras',
                        jóvenes: '📦 Compras',
                        adultos: 'Mis Compras'
                    }),
                    icon: '📦'
                }
            ];
        } else if (isAdministrativo) {
            // Enlaces para administrativos
            return [
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
                    href: '/dashboard', 
                    label: getTextByMode({
                        niños: '📊 Dashboard',
                        jóvenes: '📊 Dashboard',
                        adultos: 'Dashboard'
                    }),
                    icon: '📊'
                }
            ];
        } else {
            // Enlaces para usuarios no autenticados
            return [
                { 
                    href: '/', 
                    label: getTextByMode({
                        niños: '🧃 Bebidas',
                        jóvenes: '🧃 Bebidas',
                        adultos: 'Explorar Bebidas'
                    }),
                    icon: '🧃'
                }
            ];
        }
    };

    const mainLinks = getMainLinks();

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
                            <span className="text-3xl mr-2">🧃</span>
                            {getTextByMode({
                                niños: 'Arturo Kids',
                                jóvenes: 'Arturo Zone',
                                adultos: 'Arturo'
                            })}
                        </div>
                    </Link>

                    {/* Enlaces principales - Desktop */}
                    <div className="hidden md:flex items-center space-x-1">
                        {mainLinks.map((link) => (
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
                    </div>

                    {/* Usuario y botones - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Botón del carrito para clientes */}
                        {isCliente && (
                            <Link
                                href="/carrito"
                                className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${colors.text} ${colors.hover}`}
                            >
                                <div className="relative">
                                    <span className="text-lg">🛒</span>
                                    {carritoCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium text-[10px]">
                                            {carritoCount > 99 ? '99+' : carritoCount}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:inline">
                                    {getTextByMode({
                                        niños: 'Mi Carrito',
                                        jóvenes: 'Carrito',
                                        adultos: 'Carrito'
                                    })}
                                    {carritoCount > 0 && ` (${carritoCount})`}
                                </span>
                            </Link>
                        )}

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
                                        
                                        {/* Enlaces específicos por tipo de usuario */}
                                        {isCliente && (
                                            <>
                                                <Link
                                                    href="/cliente/dashboard"
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {getTextByMode({
                                                        niños: '🏠 Mi Dashboard',
                                                        jóvenes: '🏠 Dashboard',
                                                        adultos: 'Mi Dashboard'
                                                    })}
                                                </Link>
                                                <Link
                                                    href="/carrito"
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {getTextByMode({
                                                        niños: '🛒 Mi Carrito',
                                                        jóvenes: '🛒 Carrito',
                                                        adultos: 'Mi Carrito'
                                                    })}
                                                    {carritoCount > 0 && ` (${carritoCount})`}
                                                </Link>
                                            </>
                                        )}
                                        
                                        {isAdministrativo && (
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {getTextByMode({
                                                    niños: '📊 Dashboard Admin',
                                                    jóvenes: '📊 Dashboard',
                                                    adultos: 'Dashboard Admin'
                                                })}
                                            </Link>
                                        )}
                                        
                                        <Link
                                            href="/settings/profile"
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
                                {mainLinks.map((link) => (
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

                            {/* Carrito en móvil para clientes */}
                            {isCliente && (
                                <div className="border-t border-white/20 dark:border-gray-700 pt-4 pb-2">
                                    <Link
                                        href="/carrito"
                                        className={`flex items-center justify-between px-3 py-3 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <span className="text-xl">🛒</span>
                                                {carritoCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] h-[16px] flex items-center justify-center font-medium text-[10px]">
                                                        {carritoCount > 99 ? '99+' : carritoCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span>
                                                {getTextByMode({
                                                    niños: 'Mi Carrito de Bebidas',
                                                    jóvenes: 'Mi Carrito',
                                                    adultos: 'Mi Carrito'
                                                })}
                                            </span>
                                        </div>
                                        {carritoCount > 0 && (
                                            <span className="bg-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center font-medium">
                                                {carritoCount > 99 ? '99+' : carritoCount}
                                            </span>
                                        )}
                                    </Link>
                                </div>
                            )}

                            {/* Usuario/Auth en móvil */}
                            <div className="border-t border-white/20 dark:border-gray-700 pt-4">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className={`px-3 py-2 text-sm ${colors.text}`}>
                                            <div className="font-medium">👤 {user.nombre}</div>
                                            <div className="text-xs opacity-75">{user.email}</div>
                                        </div>
                                        
                                        {/* Enlaces específicos por tipo de usuario en móvil */}
                                        {isCliente && (
                                            <Link
                                                href="/cliente/dashboard"
                                                className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                🏠 {getTextByMode({
                                                    niños: 'Mi Dashboard',
                                                    jóvenes: 'Dashboard',
                                                    adultos: 'Mi Dashboard'
                                                })}
                                            </Link>
                                        )}
                                        
                                        {isAdministrativo && (
                                            <Link
                                                href="/dashboard"
                                                className={`block px-3 py-2 rounded-md text-base font-medium ${colors.text} ${colors.hover}`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                📊 {getTextByMode({
                                                    niños: 'Dashboard Admin',
                                                    jóvenes: 'Dashboard',
                                                    adultos: 'Dashboard Admin'
                                                })}
                                            </Link>
                                        )}
                                        
                                        <Link
                                            href="/settings/profile"
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