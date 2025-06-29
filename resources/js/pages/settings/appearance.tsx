import { Head } from '@inertiajs/react';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingsLayout from '@/layouts/settings/layout';
import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';

export default function Appearance() {
    const { getTextByMode } = useAppModeText();

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🎨 Configuración de Apariencia',
                jóvenes: '🎨 Appearance Settings',
                adultos: 'Configuración de Apariencia'
            })} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title={getTextByMode({
                            niños: '🎨 ¡Personaliza tu App!',
                            jóvenes: '🎨 Personalización',
                            adultos: 'Configuración de Apariencia'
                        })} 
                        description={getTextByMode({
                            niños: '¡Cambia los colores y fuentes para que la app se vea súper genial!',
                            jóvenes: 'Personaliza la apariencia de tu interfaz',
                            adultos: 'Configura la apariencia y el tema de la aplicación'
                        })} 
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
