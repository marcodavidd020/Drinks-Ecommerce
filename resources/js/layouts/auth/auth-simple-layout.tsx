import AppLogoIcon from '@/components/app-logo-icon';
import { useAppModeText } from '@/hooks/useAppModeText';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { getTextByMode } = useAppModeText();

    const getBackgroundPattern = () => {
        return 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950 dark:via-slate-950 dark:to-zinc-950';
    };

    const brandName = getTextByMode({
        niños: '🏪 Mi Tienda Genial',
        jóvenes: '🛒 TechStore',
        adultos: 'Sistema de Gestión'
    });

    return (
        <div className={`${getBackgroundPattern()} min-h-screen flex items-center justify-center relative overflow-hidden bg-adaptive`}>
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 dark:bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/20 dark:bg-purple-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200/20 dark:bg-pink-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto p-6">
                {/* Contenedor principal con mejor diseño */}
                <div className="card-adaptive backdrop-blur-xl shadow-2xl rounded-2xl border-adaptive overflow-hidden">
                    {/* Header con logo y branding */}
                    <div className="relative px-8 pt-8 pb-6 text-center">
                        {/* Decoración superior */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        
                        <Link 
                            href={route('home')} 
                            className="inline-flex flex-col items-center gap-3 group transition-all duration-300 hover:scale-105"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                                    <AppLogoIcon className="size-10 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-adaptive">
                                    {brandName}
                                </h2>
                                <p className="text-xs text-adaptive-muted">
                                    {getTextByMode({
                                        niños: 'Tu lugar favorito para comprar 🌟',
                                        jóvenes: 'Encuentra lo que buscas',
                                        adultos: 'Plataforma de comercio electrónico'
                                    })}
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Título y descripción de la página */}
                    <div className="px-8 pb-6 text-center space-y-2">
                        <h1 className="text-2xl font-bold text-adaptive">
                            {title}
                        </h1>
                        <p className="text-adaptive-secondary text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="px-8 pb-8">
                        {children}
                    </div>

                    {/* Footer con información adicional */}
                    <div className="bg-adaptive-tertiary px-8 py-4 border-t border-adaptive">
                        <div className="flex items-center justify-center space-x-4 text-xs text-adaptive-muted">
                            <span>
                                {getTextByMode({
                                    niños: '🔒 Súper seguro',
                                    jóvenes: '🛡️ Seguro y confiable',
                                    adultos: 'Seguro y confiable'
                                })}
                            </span>
                            <span>•</span>
                            <span>
                                {getTextByMode({
                                    niños: '⚡ Súper rápido',
                                    jóvenes: '⚡ Acceso rápido',
                                    adultos: '⚡ Acceso rápido'
                                })}
                            </span>
                            <span>•</span>
                            <span>
                                {getTextByMode({
                                    niños: '🌟 Genial',
                                    jóvenes: '✨ Fácil de usar',
                                    adultos: '✨ Fácil de usar'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Enlaces adicionales fuera del contenedor principal */}
                <div className="mt-6 text-center">
                    <Link 
                        href={route('home')} 
                        className="text-sm link-adaptive transition-colors duration-200"
                    >
                        {getTextByMode({
                            niños: '← Volver a la tienda',
                            jóvenes: '← Volver al inicio',
                            adultos: '← Volver al inicio'
                        })}
                    </Link>
                </div>
            </div>

            {/* Estilos para animaciones */}
            <style>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
