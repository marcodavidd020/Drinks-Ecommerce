import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { 
  Heart, 
  Star, 
  Smile, 
  Zap, 
  Music, 
  Palette, 
  Camera, 
  Coffee,
  Briefcase,
  BarChart,
  Users,
  Settings
} from 'lucide-react';

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
              icon: <Heart className="w-8 h-8" />,
              color: 'kids-primary'
            },
            {
              title: 'Aventuras Mágicas',
              description: 'Explora mundos fantásticos llenos de sorpresas',
              icon: <Star className="w-8 h-8" />,
              color: 'kids-secondary'
            },
            {
              title: 'Amigos Felices',
              description: 'Conoce nuevos amigos y diviértete juntos',
              icon: <Smile className="w-8 h-8" />,
              color: 'kids-accent'
            }
          ]
        };
      
      case 'jóvenes':
        return {
          title: 'Tu espacio digital 🚀',
          subtitle: 'Conecta, crea y comparte con estilo',
          cards: [
            {
              title: 'Crear Contenido',
              description: 'Expresa tu creatividad con herramientas modernas',
              icon: <Palette className="w-8 h-8" />,
              color: 'teen-primary'
            },
            {
              title: 'Conectar',
              description: 'Mantente conectado con tu comunidad',
              icon: <Zap className="w-8 h-8" />,
              color: 'teen-secondary'
            },
            {
              title: 'Explorar',
              description: 'Descubre nuevas tendencias y experiencias',
              icon: <Camera className="w-8 h-8" />,
              color: 'teen-accent'
            }
          ]
        };
      
      case 'adultos':
        return {
          title: 'Panel de Control Profesional',
          subtitle: 'Gestiona tu trabajo con eficiencia y precisión',
          cards: [
            {
              title: 'Análisis de Datos',
              description: 'Visualiza métricas y tendencias importantes',
              icon: <BarChart className="w-8 h-8" />,
              color: 'adult-primary'
            },
            {
              title: 'Gestión de Equipos',
              description: 'Coordina proyectos y colabora eficientemente',
              icon: <Users className="w-8 h-8" />,
              color: 'adult-secondary'
            },
            {
              title: 'Configuración',
              description: 'Personaliza tu espacio de trabajo',
              icon: <Settings className="w-8 h-8" />,
              color: 'adult-accent'
            }
          ]
        };
      
      default:
        return {
          title: 'Bienvenido',
          subtitle: 'Selecciona tu modo preferido',
          cards: []
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
          <div className="text-center space-y-4">
            <h1 className="text-adaptive text-4xl font-bold text-gray-900 dark:text-gray-100 special-effect">
              {content.title}
            </h1>
            <p className="text-adaptive text-lg text-gray-600 dark:text-gray-300">
              {content.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.cards.map((card, index) => (
              <div
                key={index}
                className="card card-adaptive p-6 hover:scale-105 transition-transform duration-300 interactive"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-blue-600 dark:text-blue-400">
                    {card.icon}
                  </div>
                  <h3 className="text-adaptive text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {card.title}
                  </h3>
                </div>
                <p className="text-adaptive text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Demo Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-adaptive btn-primary px-6 py-3 text-white rounded-lg">
              Botón Primario
            </button>
            <button className="btn-adaptive btn-secondary px-6 py-3 text-gray-700 border border-gray-300 rounded-lg">
              Botón Secundario
            </button>
          </div>

          {/* Features Demo */}
          <div className="space-y-6">
            <h2 className="text-adaptive text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Características Adaptativas
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Typography Demo */}
              <div className="card card-adaptive p-6">
                <h3 className="text-adaptive text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Tipografía Adaptativa
                </h3>
                <div className="space-y-3">
                  <h1 className="text-adaptive">Título Principal (H1)</h1>
                  <h2 className="text-adaptive">Subtítulo (H2)</h2>
                  <h3 className="text-adaptive">Encabezado (H3)</h3>
                  <p className="text-adaptive">
                    Este es un párrafo de ejemplo que demuestra cómo el texto se adapta 
                    según el modo seleccionado, cambiando fuente, tamaño y espaciado.
                  </p>
                </div>
              </div>

              {/* Theme Demo */}
              <div className="card card-adaptive p-6">
                <h3 className="text-adaptive text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Sistema de Temas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-adaptive text-sm">Color Primario</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <span className="text-adaptive text-sm">Color Secundario</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
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
          <div className="card card-adaptive p-6 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-adaptive text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
              Configuración Actual
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Grupo de Edad:</span>
                <p className="text-adaptive text-blue-600 dark:text-blue-400 capitalize">{settings.ageMode}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Tema:</span>
                <p className="text-adaptive text-blue-600 dark:text-blue-400 capitalize">{settings.currentTheme}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Tamaño de Fuente:</span>
                <p className="text-adaptive text-blue-600 dark:text-blue-400 capitalize">{settings.fontSize}</p>
              </div>
              <div>
                <span className="font-medium text-blue-700 dark:text-blue-300">Contraste:</span>
                <p className="text-adaptive text-blue-600 dark:text-blue-400 capitalize">{settings.contrast}</p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default ModesDemo; 