import { ReactNode } from 'react';
import { useAppMode } from '@/contexts/AppModeContext';
import ModeSelector from '@/components/ModeSelector';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  header?: ReactNode;
  showModeSelector?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title, 
  header, 
  showModeSelector = true 
}) => {
  const { settings } = useAppMode();

  return (
    <div className="min-h-screen">
      {/* Header */}
      {(header || showModeSelector) && (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Título o Header personalizado */}
              <div className="flex items-center">
                {title && (
                  <h1 className="text-adaptive text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h1>
                )}
                {header}
              </div>

              {/* Selector de Modos */}
              {showModeSelector && (
                <div className="flex items-center space-x-4">
                  <ModeSelector />
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Contenido Principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Indicador de modo actual (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg z-50">
          <div>Modo: {settings.ageMode}</div>
          <div>Tema: {settings.currentTheme}</div>
          <div>Fuente: {settings.fontSize}</div>
          <div>Contraste: {settings.contrast}</div>
        </div>
      )}
    </div>
  );
};

export default AppLayout; 