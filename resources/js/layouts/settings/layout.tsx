import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { getTextByMode } = useAppModeText();

    const sidebarNavItems: NavItem[] = [
        {
            title: getTextByMode({
                niños: '👤 Mi Perfil',
                jóvenes: '👤 Perfil',
                adultos: 'Perfil'
            }),
            href: '/settings/profile',
            icon: null,
        },
        {
            title: getTextByMode({
                niños: '🔐 Contraseña',
                jóvenes: '🔐 Contraseña',
                adultos: 'Contraseña'
            }),
            href: '/settings/password',
            icon: null,
        },
        {
            title: getTextByMode({
                niños: '🎨 Apariencia',
                jóvenes: '🎨 Apariencia',
                adultos: 'Apariencia'
            }),
            href: '/settings/appearance',
            icon: null,
        },
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading 
                title={getTextByMode({
                    niños: '⚙️ Configuración',
                    jóvenes: '⚙️ Configuración',
                    adultos: 'Configuración'
                })} 
                description={getTextByMode({
                    niños: 'Cambia tu perfil y configuración de la cuenta',
                    jóvenes: 'Administra tu perfil y configuración de cuenta',
                    adultos: 'Administre su perfil y configuración de cuenta'
                })} 
            />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'w-full justify-start transition-colors duration-200',
                                    {
                                        'bg-primary/10 text-primary font-medium': currentPath === item.href,
                                        'hover:bg-muted/60': currentPath !== item.href,
                                    }
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
