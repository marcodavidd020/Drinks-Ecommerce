import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import HeroSection from '@/components/home/hero-section';
import CategoriesGrid from '@/components/home/categories-grid';
import ProductsFeatured from '@/components/home/products-featured';
import PromotionsBanner from '@/components/home/promotions-banner';
import StoreBenefits from '@/components/home/store-benefits';
import { useAppMode } from '@/contexts/AppModeContext';

interface HomeProps {
    // Datos estadísticos para el hero
    stats: {
        totalProductos: number;
        totalCategorias: number;
        totalPromociones: number;
        totalClientes: number;
        totalVentas: number;
    };

    // Categorías con conteo de productos
    categorias: Array<{
        id: number;
        nombre: string;
        descripcion?: string;
        productos_count: number;
    }>;

    // Productos destacados/populares
    productosDestacados: Array<{
        id: number;
        cod_producto: string;
        nombre: string;
        precio_compra: number;
        precio_venta: number;
        imagen?: string;
        descripcion?: string;
        categoria?: {
            id: number;
            nombre: string;
        };
        stock_total: number;
    }>;

    // Promociones activas
    promociones: Array<{
        id: number;
        nombre: string;
        fecha_inicio: string;
        fecha_fin: string;
        descuento?: string;
        productos?: Array<{
            id: number;
            nombre: string;
            descuento_porcentaje?: number;
            descuento_fijo?: number;
        }>;
    }>;

    // Productos más vendidos
    masVendidos: Array<{
        id: number;
        cod_producto: string;
        nombre: string;
        precio_compra: number;
        precio_venta: number;
        imagen?: string;
        descripcion?: string;
        categoria?: {
            id: number;
            nombre: string;
        };
        stock_total: number;
        total_vendido: number;
    }>;
}

export default function Home({
    stats,
    categorias,
    productosDestacados,
    promociones,
    masVendidos
}: HomeProps) {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    return (
        <AppLayout showNavbar={true} showModeSelector={true}>
            <Head title="Arturo - Tu Tienda de Bebidas Favorita" />

            {/* Aplicar clases específicas del modo a todo el contenido */}
            <div className={`min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -my-6 ${getModeClasses()}`}>
                {/* Hero Section */}
                <HeroSection
                    totalProductos={stats.totalProductos}
                    totalCategorias={stats.totalCategorias}
                    totalPromociones={stats.totalPromociones}
                />

                {/* Promociones Banner - Mejorado para dark/light mode */}
                {promociones.length > 0 && (
                    <div className="py-8 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 dark:from-purple-800 dark:via-pink-800 dark:to-indigo-900">
                        <PromotionsBanner promociones={promociones} />
                    </div>
                )}

                {/* Separador visual con animación - mejorado para dark mode */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-emerald-500 dark:from-blue-600 dark:via-cyan-700 dark:to-emerald-700"></div>

                {/* Categorías - Mejorado para dark/light mode */}
                <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧃 ¡Tipos de Bebidas Súper Refrescantes! 🥤',
                                    jóvenes: '🥤 Categorías de Bebidas Trending',
                                    adultos: 'Nuestras Categorías de Bebidas'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Desde jugos naturales hasta sodas burbujeantes! Encuentra tu bebida favorita aquí.',
                                    jóvenes: 'Desde smoothies frescos hasta energizantes, tenemos la bebida perfecta para cada momento',
                                    adultos: 'Descubre nuestra amplia selección de bebidas refrescantes, desde jugos naturales hasta infusiones especiales'
                                })}
                            </p>
                        </div>
                        <CategoriesGrid categorias={categorias} />
                    </div>
                </section>

                {/* Productos Destacados - Mejorado para dark/light mode */}
                <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⭐ ¡Bebidas Súper Deliciosas! 🌟',
                                    jóvenes: '💎 Bebidas Destacadas',
                                    adultos: 'Bebidas Destacadas'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Las bebidas más ricas y refrescantes que tenemos para ti',
                                    jóvenes: 'Las bebidas más cool y refrescantes del momento',
                                    adultos: 'Selección premium de nuestras mejores bebidas'
                                })}
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 mx-auto rounded-full"></div>
                        </div>
                        <ProductsFeatured
                            productos={productosDestacados}
                            title="Bebidas Destacadas"
                        />
                    </div>
                </section>

                {/* Productos Más Vendidos - Mejorado para dark/light mode */}
                {masVendidos.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🏆 ¡Las Bebidas Favoritas de Todos! 🥇',
                                        jóvenes: '🚀 Best Sellers',
                                        adultos: 'Bebidas Más Vendidas'
                                    })}
                                </h2>
                                <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: 'Estas son las bebidas que más les gustan a nuestros clientes',
                                        jóvenes: 'Las bebidas que están arrasando en ventas',
                                        adultos: 'Las bebidas preferidas por nuestros clientes'
                                    })}
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 mx-auto rounded-full"></div>
                            </div>
                            <ProductsFeatured
                                productos={masVendidos}
                                title="Bebidas Más Vendidas"
                            />
                        </div>
                    </section>
                )}

                {/* Store Benefits - Mejorado para dark/light mode */}
                <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <StoreBenefits />
                </section>

                {/* Call to Action Final - Mejorado para dark/light mode */}
                <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-700 dark:from-blue-800 dark:to-cyan-900 transition-all duration-300">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className={`text-3xl md:text-4xl font-bold text-white mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎉 ¡Empieza a Comprar Bebidas Súper Cool! 🧃',
                                    jóvenes: '🔥 Ready to Get Your Fave Drinks?',
                                    adultos: '¿Listo para Descubrir Nuestras Bebidas?'
                                })}
                            </h2>
                            <p className={`text-white/90 text-lg mb-8 max-w-2xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Únete a miles de niños que ya disfrutan las bebidas más deliciosas y refrescantes',
                                    jóvenes: 'Join thousands who trust us for the freshest, coolest beverages around',
                                    adultos: 'Únase a miles de clientes que confían en nosotros para las mejores bebidas'
                                })}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href="/catalogo/productos"
                                    className={`bg-white text-blue-800 hover:bg-blue-50 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🧃 ¡Explorar Bebidas!',
                                        jóvenes: '🥤 Shop Now',
                                        adultos: 'Explorar Catálogo'
                                    })}
                                </Link>
                                <Link
                                    href="/carrito"
                                    className={`border-2 border-white text-white hover:bg-white hover:text-blue-800 dark:hover:bg-gray-800 dark:hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🛒 ¡Ver Mi Carrito!',
                                        jóvenes: '🛒 My Cart',
                                        adultos: 'Ver Carrito'
                                    })}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}