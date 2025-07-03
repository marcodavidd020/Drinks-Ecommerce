import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { Calendar, Clock, Gift, ShoppingCart, Tag } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    precio_venta: number;
    imagen?: string;
    categoria: {
        id: number;
        nombre: string;
    };
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    descuento?: string;
    producto?: Producto | null;
    estado: 'activa' | 'proximamente' | 'expirada';
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    next_page_url?: string;
    prev_page_url?: string;
}

interface PromocionesProps {
    promociones: PaginatedData<Promocion>;
    filtro_estado: string;
    stats: {
        activas: number;
        proximamente: number;
        expiradas: number;
        total: number;
    };
}

export default function CatalogoPromociones({
    promociones,
    filtro_estado,
    stats
}: PromocionesProps) {
    const { getTextByMode } = useAppModeText();

    const getModeClasses = () => {
        // Obtener el modo desde localStorage o contexto
        const savedMode = localStorage.getItem('appMode');
        const mode = savedMode ? JSON.parse(savedMode).ageMode : 'adultos';
        
        switch (mode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const cambiarFiltro = (nuevoEstado: string) => {
        router.get(route('catalogo.promociones'), { estado: nuevoEstado }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'activa':
                return (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTextByMode({
                            niños: 'Activa',
                            jóvenes: 'Live',
                            adultos: 'Activa'
                        })}
                    </Badge>
                );
            case 'proximamente':
                return (
                    <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getTextByMode({
                            niños: 'Pronto',
                            jóvenes: 'Coming Soon',
                            adultos: 'Próximamente'
                        })}
                    </Badge>
                );
            case 'expirada':
                return (
                    <Badge variant="secondary" className="opacity-50">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTextByMode({
                            niños: 'Terminó',
                            jóvenes: 'Expired',
                            adultos: 'Expirada'
                        })}
                    </Badge>
                );
            default:
                return null;
        }
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const calcularDescuento = (promocion: Promocion) => {
        if (!promocion.producto || !promocion.descuento) return null;
        
        const descuentoPorcentaje = parseInt(promocion.descuento);
        const precioOriginal = promocion.producto.precio_venta;
        const precioConDescuento = precioOriginal * (1 - descuentoPorcentaje / 100);
        
        return {
            porcentaje: descuentoPorcentaje,
            precio_original: precioOriginal,
            precio_descuento: precioConDescuento,
            ahorro: precioOriginal - precioConDescuento
        };
    };

    const getDiasRestantes = (fechaFin: string) => {
        const hoy = new Date();
        const fin = new Date(fechaFin);
        const diferencia = fin.getTime() - hoy.getTime();
        const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
        return dias;
    };

    return (
        <AppLayout showNavbar={true} showModeSelector={true}>
            <Head title={getTextByMode({
                niños: '🎁 Ofertas Súper Geniales - Arturo',
                jóvenes: '🔥 Hot Deals - Arturo',
                adultos: 'Promociones - Arturo'
            })} />

            <div className={`min-h-screen py-8 ${getModeClasses()}`}>
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-center mb-6">
                            <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎁 ¡Ofertas Súper Increíbles! 🌟',
                                    jóvenes: '🔥 Hot Deals & Promociones',
                                    adultos: 'Promociones y Ofertas Especiales'
                                })}
                            </h1>
                            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Descubre las mejores ofertas en tus bebidas favoritas! Ahorra un montón con nuestras promociones especiales.',
                                    jóvenes: 'Descubre ofertas increíbles y ahorra en las bebidas más cool del momento.',
                                    adultos: 'Aproveche nuestras promociones especiales y descuentos exclusivos en bebidas seleccionadas.'
                                })}
                            </p>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-4xl mx-auto">
                            <div className="text-center bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.activas}
                                </div>
                                <div className="text-sm text-green-800 dark:text-green-200">
                                    {getTextByMode({
                                        niños: 'Activas',
                                        jóvenes: 'Live',
                                        adultos: 'Activas'
                                    })}
                                </div>
                            </div>
                            <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {stats.proximamente}
                                </div>
                                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                    {getTextByMode({
                                        niños: 'Pronto',
                                        jóvenes: 'Coming',
                                        adultos: 'Próximamente'
                                    })}
                                </div>
                            </div>
                            <div className="text-center bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                    {stats.expiradas}
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">
                                    {getTextByMode({
                                        niños: 'Terminadas',
                                        jóvenes: 'Expired',
                                        adultos: 'Expiradas'
                                    })}
                                </div>
                            </div>
                            <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {stats.total}
                                </div>
                                <div className="text-sm text-purple-800 dark:text-purple-200">
                                    {getTextByMode({
                                        niños: 'En Total',
                                        jóvenes: 'Total',
                                        adultos: 'Total'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button
                                variant={filtro_estado === 'activas' ? 'default' : 'outline'}
                                onClick={() => cambiarFiltro('activas')}
                                className="flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4" />
                                {getTextByMode({
                                    niños: '🔥 Activas',
                                    jóvenes: 'Live Deals',
                                    adultos: 'Promociones Activas'
                                })} ({stats.activas})
                            </Button>
                            
                            <Button
                                variant={filtro_estado === 'proximamente' ? 'default' : 'outline'}
                                onClick={() => cambiarFiltro('proximamente')}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="h-4 w-4" />
                                {getTextByMode({
                                    niños: '⏳ Próximamente',
                                    jóvenes: 'Coming Soon',
                                    adultos: 'Próximamente'
                                })} ({stats.proximamente})
                            </Button>
                            
                            <Button
                                variant={filtro_estado === 'expiradas' ? 'default' : 'outline'}
                                onClick={() => cambiarFiltro('expiradas')}
                                className="flex items-center gap-2"
                            >
                                <Tag className="h-4 w-4" />
                                {getTextByMode({
                                    niños: '📝 Pasadas',
                                    jóvenes: 'Expired',
                                    adultos: 'Expiradas'
                                })} ({stats.expiradas})
                            </Button>
                            
                            <Button
                                variant={filtro_estado === 'todas' ? 'default' : 'outline'}
                                onClick={() => cambiarFiltro('todas')}
                                className="flex items-center gap-2"
                            >
                                <Gift className="h-4 w-4" />
                                {getTextByMode({
                                    niños: '🎁 Todas',
                                    jóvenes: 'All Deals',
                                    adultos: 'Todas'
                                })} ({stats.total})
                            </Button>
                        </div>
                    </div>

                    {/* Grid de promociones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {promociones.data.map((promocion) => {
                            const descuento = calcularDescuento(promocion);
                            const diasRestantes = getDiasRestantes(promocion.fecha_fin);
                            
                            return (
                                <Card key={promocion.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-300">
                                    <div className="relative">
                                        {/* Header de la promoción */}
                                        <div className={`${promocion.estado === 'activa' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                                                        promocion.estado === 'proximamente' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                                                        'bg-gradient-to-r from-gray-400 to-gray-500'} p-4 text-white`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Gift className="h-5 w-5" />
                                                    <span className="font-semibold">
                                                        {getTextByMode({
                                                            niños: 'Oferta Especial',
                                                            jóvenes: 'Special Deal',
                                                            adultos: 'Promoción Especial'
                                                        })}
                                                    </span>
                                                </div>
                                                {getEstadoBadge(promocion.estado)}
                                            </div>
                                            
                                            {/* Descuento destacado */}
                                            {promocion.descuento && (
                                                <div className="mt-2">
                                                    <div className="text-3xl font-bold">
                                                        {promocion.descuento}% OFF
                                                    </div>
                                                    <div className="text-sm opacity-90">
                                                        {getTextByMode({
                                                            niños: '¡Súper descuento!',
                                                            jóvenes: 'Epic discount!',
                                                            adultos: 'Descuento especial'
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Badge de urgencia */}
                                        {promocion.estado === 'activa' && diasRestantes <= 3 && diasRestantes > 0 && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="destructive" className="animate-pulse">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {getTextByMode({
                                                        niños: `¡${diasRestantes} días!`,
                                                        jóvenes: `${diasRestantes} days left!`,
                                                        adultos: `${diasRestantes} días restantes`
                                                    })}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-6">
                                        {/* Nombre de la promoción */}
                                        <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 ${getModeClasses()}`}>
                                            {promocion.nombre}
                                        </h3>

                                        {/* Fechas */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {getTextByMode({
                                                        niños: 'Desde:',
                                                        jóvenes: 'From:',
                                                        adultos: 'Inicio:'
                                                    })} {formatearFecha(promocion.fecha_inicio)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {getTextByMode({
                                                        niños: 'Hasta:',
                                                        jóvenes: 'Until:',
                                                        adultos: 'Fin:'
                                                    })} {formatearFecha(promocion.fecha_fin)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Producto incluido */}
                                        {promocion.producto && (
                                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                                                <div className="flex items-center gap-4">
                                                    {/* Imagen del producto */}
                                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        {promocion.producto.imagen ? (
                                                            <img
                                                                src={`/images/productos/${promocion.producto.imagen}`}
                                                                alt={promocion.producto.nombre}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-2xl opacity-50">🥤</div>
                                                        )}
                                                    </div>

                                                    {/* Información del producto */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                            {promocion.producto.nombre}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {promocion.producto.categoria.nombre}
                                                        </p>
                                                        
                                                        {/* Precios */}
                                                        {descuento && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                    {formatCurrency(descuento.precio_descuento)}
                                                                </span>
                                                                <span className="text-sm text-gray-500 line-through">
                                                                    {formatCurrency(descuento.precio_original)}
                                                                </span>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {getTextByMode({
                                                                        niños: `Ahorras ${formatCurrency(descuento.ahorro)}`,
                                                                        jóvenes: `Save ${formatCurrency(descuento.ahorro)}`,
                                                                        adultos: `Ahorra ${formatCurrency(descuento.ahorro)}`
                                                                    })}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0">
                                        <div className="flex gap-2 w-full">
                                            {promocion.producto && (
                                                <Link
                                                    href={route('catalogo.productos', { busqueda: promocion.producto.nombre })}
                                                    className="flex-1"
                                                >
                                                    <Button variant="outline" className="w-full">
                                                        {getTextByMode({
                                                            niños: '👀 Ver producto',
                                                            jóvenes: 'View Product',
                                                            adultos: 'Ver Producto'
                                                        })}
                                                    </Button>
                                                </Link>
                                            )}
                                            
                                            {promocion.estado === 'activa' && promocion.producto && (
                                                <Link
                                                    href={route('catalogo.productos', { busqueda: promocion.producto.nombre })}
                                                    className="flex-1"
                                                >
                                                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                                        {getTextByMode({
                                                            niños: '🛒 ¡Quiero!',
                                                            jóvenes: 'Get Deal',
                                                            adultos: 'Aprovechar'
                                                        })}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Paginación */}
                    {promociones.last_page > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            {promociones.prev_page_url && (
                                <Link
                                    href={promociones.prev_page_url}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {getTextByMode({
                                        niños: '← Anterior',
                                        jóvenes: '← Previous',
                                        adultos: 'Anterior'
                                    })}
                                </Link>
                            )}

                            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                {getTextByMode({
                                    niños: `Página ${promociones.current_page} de ${promociones.last_page}`,
                                    jóvenes: `${promociones.current_page} / ${promociones.last_page}`,
                                    adultos: `Página ${promociones.current_page} de ${promociones.last_page}`
                                })}
                            </span>

                            {promociones.next_page_url && (
                                <Link
                                    href={promociones.next_page_url}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {getTextByMode({
                                        niños: 'Siguiente →',
                                        jóvenes: 'Next →',
                                        adultos: 'Siguiente'
                                    })}
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mensaje si no hay promociones */}
                    {promociones.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-8xl mb-4 opacity-50">🎁</div>
                            <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'No hay ofertas por aquí 😢',
                                    jóvenes: 'No deals found',
                                    adultos: 'No se encontraron promociones'
                                })}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {getTextByMode({
                                    niños: 'Pero no te preocupes, pronto habrá más ofertas súper geniales',
                                    jóvenes: 'Check back soon for awesome new deals',
                                    adultos: 'Consulte pronto para nuevas ofertas y promociones'
                                })}
                            </p>
                            <Link href={route('catalogo.productos')}>
                                <Button>
                                    {getTextByMode({
                                        niños: '🧃 Ver todas las bebidas',
                                        jóvenes: 'Explore Products',
                                        adultos: 'Ver Catálogo de Productos'
                                    })}
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 rounded-xl p-8 text-center text-white">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🎉 ¡No te pierdas nuestras ofertas!',
                                jóvenes: '🔥 Don\'t Miss Out on These Deals!',
                                adultos: '¡No se Pierda Nuestras Ofertas!'
                            })}
                        </h2>
                        <p className="text-blue-100 dark:text-blue-200 mb-6 max-w-2xl mx-auto">
                            {getTextByMode({
                                niños: 'Mantente atento a nuestras promociones especiales y ahorra en tus bebidas favoritas',
                                jóvenes: 'Stay tuned for special promotions and save big on your favorite drinks',
                                adultos: 'Manténgase al día con nuestras promociones especiales y ahorre en sus bebidas favoritas'
                            })}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('catalogo.productos')}>
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800">
                                    {getTextByMode({
                                        niños: '🧃 Ver Catálogo',
                                        jóvenes: 'Shop Now',
                                        adultos: 'Explorar Catálogo'
                                    })}
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800 dark:hover:bg-gray-800 dark:hover:text-white">
                                    {getTextByMode({
                                        niños: '🏠 Volver al inicio',
                                        jóvenes: 'Back to Home',
                                        adultos: 'Volver al Inicio'
                                    })}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
