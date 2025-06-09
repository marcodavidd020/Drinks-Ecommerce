import { useAppMode } from '@/contexts/AppModeContext';
import AppLayout from '@/layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { BarChart, Camera, Heart, Palette, Settings, Smile, Star, Users, Zap } from 'lucide-react';
import React from 'react';

const ModesDemo: React.FC = () => {
    const { settings } = useAppMode();

    const getAgeSpecificContent = () => {
        switch (settings.ageMode) {
            case 'niños':
                return {
                    title: '¡Bienvenidos pequeños exploradores! 🌟',
                    subtitle: 'Descubre un mundo lleno de diversión y aprendizaje',
                    cards: [
                        {
                            title: 'Juegos Divertidos',
                            description: '¡Juega y aprende con actividades súper chéveres!',
                            icon: <Heart className="h-8 w-8" />,
                            color: 'kids-primary',
                        },
                        {
                            title: 'Aventuras Mágicas',
                            description: 'Explora mundos fantásticos llenos de sorpresas',
                            icon: <Star className="h-8 w-8" />,
                            color: 'kids-secondary',
                        },
                        {
                            title: 'Amigos Felices',
                            description: 'Conoce nuevos amigos y diviértete juntos',
                            icon: <Smile className="h-8 w-8" />,
                            color: 'kids-accent',
                        },
                    ],
                };

            case 'jóvenes':
                return {
                    title: 'Tu espacio digital 🚀',
                    subtitle: 'Conecta, crea y comparte con estilo',
                    cards: [
                        {
                            title: 'Crear Contenido',
                            description: 'Expresa tu creatividad con herramientas modernas',
                            icon: <Palette className="h-8 w-8" />,
                            color: 'teen-primary',
                        },
                        {
                            title: 'Conectar',
                            description: 'Mantente conectado con tu comunidad',
                            icon: <Zap className="h-8 w-8" />,
                            color: 'teen-secondary',
                        },
                        {
                            title: 'Explorar',
                            description: 'Descubre nuevas tendencias y experiencias',
                            icon: <Camera className="h-8 w-8" />,
                            color: 'teen-accent',
                        },
                    ],
                };

            case 'adultos':
                return {
                    title: 'Panel de Control Profesional',
                    subtitle: 'Gestiona tu trabajo con eficiencia y precisión',
                    cards: [
                        {
                            title: 'Análisis de Datos',
                            description: 'Visualiza métricas y tendencias importantes',
                            icon: <BarChart className="h-8 w-8" />,
                            color: 'adult-primary',
                        },
                        {
                            title: 'Gestión de Equipos',
                            description: 'Coordina proyectos y colabora eficientemente',
                            icon: <Users className="h-8 w-8" />,
                            color: 'adult-secondary',
                        },
                        {
                            title: 'Configuración',
                            description: 'Personaliza tu espacio de trabajo',
                            icon: <Settings className="h-8 w-8" />,
                            color: 'adult-accent',
                        },
                    ],
                };

            default:
                return {
                    title: 'Bienvenido',
                    subtitle: 'Selecciona tu modo preferido',
                    cards: [],
                };
        }
    };

    const content = getAgeSpecificContent();

    return (
        <>
            <Head title="Demostración de Modos" />

            <AppLayout title="Demostración de Modos">
                <div className="space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-4 text-center">
                        <h1 className="text-adaptive special-effect text-4xl font-bold text-gray-900 dark:text-gray-100">{content.title}</h1>
                        <p className="text-adaptive text-lg text-gray-600 dark:text-gray-300">{content.subtitle}</p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {content.cards.map((card, index) => (
                            <div key={index} className="card card-adaptive interactive p-6 transition-transform duration-300 hover:scale-105">
                                <div className="mb-4 flex items-center space-x-4">
                                    <div className="text-blue-600 dark:text-blue-400">{card.icon}</div>
                                    <h3 className="text-adaptive text-xl font-semibold text-gray-800 dark:text-gray-200">{card.title}</h3>
                                </div>
                                <p className="text-adaptive text-gray-600 dark:text-gray-400">{card.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Demo Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="btn-adaptive btn-primary rounded-lg px-6 py-3 text-white">Botón Primario</button>
                        <button className="btn-adaptive btn-secondary rounded-lg border border-gray-300 px-6 py-3 text-gray-700">
                            Botón Secundario
                        </button>
                    </div>

                    {/* Features Demo */}
                    <div className="space-y-6">
                        <h2 className="text-adaptive text-center text-2xl font-bold text-gray-800 dark:text-gray-200">Características Adaptativas</h2>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Typography Demo */}
                            <div className="card card-adaptive p-6">
                                <h3 className="text-adaptive mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Tipografía Adaptativa</h3>
                                <div className="space-y-3">
                                    <h1 className="text-adaptive">Título Principal (H1)</h1>
                                    <h2 className="text-adaptive">Subtítulo (H2)</h2>
                                    <h3 className="text-adaptive">Encabezado (H3)</h3>
                                    <p className="text-adaptive">
                                        Este es un párrafo de ejemplo que demuestra cómo el texto se adapta según el modo seleccionado, cambiando
                                        fuente, tamaño y espaciado.
                                    </p>
                                </div>
                            </div>

                            {/* Theme Demo */}
                            <div className="card card-adaptive p-6">
                                <h3 className="text-adaptive mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Sistema de Temas</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-4 rounded bg-blue-500"></div>
                                        <span className="text-adaptive text-sm">Color Primario</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-4 rounded bg-gray-500"></div>
                                        <span className="text-adaptive text-sm">Color Secundario</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-4 w-4 rounded bg-yellow-500"></div>
                                        <span className="text-adaptive text-sm">Color de Acento</span>
                                    </div>
                                    <p className="text-adaptive text-sm text-gray-600 dark:text-gray-400">
                                        Los temas cambian automáticamente según la hora del día cuando está activado el modo automático.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Settings Display */}
                    <div className="card card-adaptive bg-blue-50 p-6 dark:bg-blue-900/20">
                        <h3 className="text-adaptive mb-4 text-lg font-semibold text-blue-800 dark:text-blue-200">Configuración Actual</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                            <div>
                                <span className="font-medium text-blue-700 dark:text-blue-300">Grupo de Edad:</span>
                                <p className="text-adaptive text-blue-600 capitalize dark:text-blue-400">{settings.ageMode}</p>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700 dark:text-blue-300">Tema:</span>
                                <p className="text-adaptive text-blue-600 capitalize dark:text-blue-400">{settings.currentTheme}</p>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700 dark:text-blue-300">Tamaño de Fuente:</span>
                                <p className="text-adaptive text-blue-600 capitalize dark:text-blue-400">{settings.fontSize}</p>
                            </div>
                            <div>
                                <span className="font-medium text-blue-700 dark:text-blue-300">Contraste:</span>
                                <p className="text-adaptive text-blue-600 capitalize dark:text-blue-400">{settings.contrast}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default ModesDemo;
