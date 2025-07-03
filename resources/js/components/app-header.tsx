import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [carritoCount, setCarritoCount] = useState(0);
    
    // Verificar si el usuario es cliente (tiene rol cliente y está autenticado)
    const userRoles = (auth.user?.roles as Array<{ name: string }>) || [];
    const isCliente = auth.user && userRoles.some(role => role.name === 'cliente') && 
                     !userRoles.some(role => ['admin', 'empleado', 'organizador', 'vendedor', 'almacenista'].includes(role.name));

    // Función para obtener el conteo del carrito
    const fetchCarritoCount = useCallback(async () => {
        if (!isCliente) return;
        
        try {
            const response = await fetch('/api/carrito/count', {
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

    return (
        <>
            <div className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                                                        {/* Navegación especial para clientes en mobile */}
                            {isCliente && (
                                <>
                                    <Link href="/" className="flex items-center space-x-2 font-medium">
                                        <span className="text-lg">🧃</span>
                                        <span>Explorar Bebidas</span>
                                    </Link>
                                    <Link href="/cliente/dashboard" className="flex items-center space-x-2 font-medium">
                                        <span className="text-lg">🏠</span>
                                        <span>Mi Dashboard</span>
                                    </Link>
                                    <Link href="/carrito" className="flex items-center space-x-2 font-medium">
                                        <div className="relative">
                                            <ShoppingCart className="h-5 w-5" />
                                            {carritoCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] h-[16px] flex items-center justify-center font-medium text-[10px]">
                                                    {carritoCount > 99 ? '99+' : carritoCount}
                                                </span>
                                            )}
                                        </div>
                                        <span>Mi Carrito</span>
                                        {carritoCount > 0 && (
                                            <span className="bg-cyan-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                                                {carritoCount > 99 ? '99+' : carritoCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link href="/cliente/compras" className="flex items-center space-x-2 font-medium">
                                        <span className="text-lg">📦</span>
                                        <span>Mis Compras</span>
                                    </Link>
                                </>
                            )}
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            {rightNavItems.map((item) => (
                                                <a
                                                    key={item.title}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={isCliente ? "/cliente/dashboard" : "/dashboard"} prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {!isCliente && mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                                
                                {/* Navegación especial para clientes */}
                                {isCliente && (
                                    <>
                                        <NavigationMenuItem className="relative flex h-full items-center">
                                            <Link
                                                href="/"
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === '/' && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                <span className="mr-2">🧃</span>
                                                Explorar Bebidas
                                            </Link>
                                            {page.url === '/' && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-cyan-500"></div>
                                            )}
                                        </NavigationMenuItem>
                                        
                                        <NavigationMenuItem className="relative flex h-full items-center">
                                            <Link
                                                href="/cliente/dashboard"
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === '/cliente/dashboard' && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                <span className="mr-2">🏠</span>
                                                Mi Dashboard
                                            </Link>
                                            {page.url === '/cliente/dashboard' && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-cyan-500"></div>
                                            )}
                                        </NavigationMenuItem>
                                        
                                        <NavigationMenuItem className="relative flex h-full items-center">
                                            <Link
                                                href="/cliente/compras"
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url.startsWith('/cliente/compras') && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                <span className="mr-2">📦</span>
                                                Mis Compras
                                            </Link>
                                            {page.url.startsWith('/cliente/compras') && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-cyan-500"></div>
                                            )}
                                        </NavigationMenuItem>
                                    </>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">

                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                            
                            {/* Botón del carrito solo para clientes */}
                            {isCliente && (
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Link
                                                href="/carrito"
                                                className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative"
                                            >
                                                <span className="sr-only">Mi Carrito</span>
                                                <ShoppingCart className="size-5 opacity-80 group-hover:opacity-100 text-cyan-600 dark:text-cyan-400" />
                                                {carritoCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                                                        {carritoCount > 99 ? '99+' : carritoCount}
                                                    </span>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Mi Carrito {carritoCount > 0 && `(${carritoCount})`}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            
                            <div className="hidden lg:flex">
                                {!isCliente && rightNavItems.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    <span className="sr-only">{item.title}</span>
                                                    {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80 group-hover:opacity-100" />}
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.title}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user?.avatar} alt={auth.user?.nombre || 'Usuario'} />
                                        <AvatarFallback className={`rounded-lg text-black dark:text-white ${
                                            isCliente ? 'bg-cyan-200 dark:bg-cyan-700' : 'bg-neutral-200 dark:bg-neutral-700'
                                        }`}>
                                            {getInitials(auth.user?.nombre)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
