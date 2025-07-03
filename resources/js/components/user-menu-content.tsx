import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, LayoutDashboard, ShoppingBag } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    // Verificar si el usuario es cliente
    const userRoles = (user?.roles as Array<{ name: string }>) || [];
    const isCliente = userRoles.some(role => role.name === 'cliente') && 
                     !userRoles.some(role => ['admin', 'empleado', 'organizador', 'vendedor', 'almacenista'].includes(role.name));
    const isAdministrativo = userRoles.some(role => ['admin', 'empleado', 'organizador', 'vendedor', 'almacenista'].includes(role.name));

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {/* Enlaces al Dashboard */}
                {isCliente && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full" href="/cliente/dashboard" as="button" prefetch onClick={cleanup}>
                                <LayoutDashboard className="mr-2" />
                                Mi Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full" href="/carrito" as="button" prefetch onClick={cleanup}>
                                <ShoppingBag className="mr-2" />
                                Mi Carrito
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                {isAdministrativo && (
                    <DropdownMenuItem asChild>
                        <Link className="block w-full" href="/dashboard" as="button" prefetch onClick={cleanup}>
                            <LayoutDashboard className="mr-2" />
                            Dashboard Admin
                        </Link>
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuItem asChild>
                    <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
