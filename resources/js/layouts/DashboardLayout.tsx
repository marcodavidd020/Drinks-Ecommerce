import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';
import ModeSelector from '@/components/ModeSelector';
import DashboardSidebar from '@/components/dashboard-sidebar';

interface User {
  id: number;
  nombre: string;
  email: string;
  role?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  header?: ReactNode;
  showModeSelector?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  header, 
  showModeSelector = true 
}) => {
  const { settings } = useAppMode();
  const { props } = usePage();
  
  // Obtener el usuario de las props de Inertia
  const user = (props.auth as any)?.user as User | undefined;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header del Dashboard */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-6 py-4">
            {/* Título */}
            <div className="flex items-center">
              {title && (
                <h1 className="text-adaptive text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
              )}
              {header}
            </div>
            
            {/* Usuario y selector de modos */}
            <div className="flex items-center space-x-4">
              {/* Selector de Modos */}
              {showModeSelector && <ModeSelector />}
              
              {/* Info del usuario */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role || 'Usuario'}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                    {user.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Indicador de modo actual (solo en desarrollo) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg z-50">
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