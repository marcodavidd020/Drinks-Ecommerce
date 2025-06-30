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
            <Head title="BebiFresh - Tu Tienda de Bebidas Favorita" />

            {/* Aplicar clases específicas del modo a todo el contenido */}
            <div className={`min-h-screen -mx-4 sm:-mx-6 lg:-mx-8 -my-6 ${getModeClasses()}`}>
                {/* Hero Section */}
                <HeroSection
                    totalProductos={stats.totalProductos}
                    totalCategorias={stats.totalCategorias}
                    totalPromociones={stats.totalPromociones}
                />

                {/* Promociones Banner - Más prominente */}
                {promociones.length > 0 && (
                    <div className="py-8 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500">
                        <PromotionsBanner promociones={promociones} />
                    </div>
                )}

                {/* Separador visual con animación - colores de bebidas */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-emerald-500 animated-gradient"></div>

                {/* Categorías */}
                <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧃 ¡Tipos de Bebidas Súper Refrescantes! 🥤',
                                    jóvenes: '🥤 Categorías de Bebidas Trending',
                                    adultos: 'Nuestras Categorías de Bebidas'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto ${getModeClasses()}`}>
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

                {/* Productos Destacados con mejor diseño */}
                <section className="py-16 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⭐ ¡Bebidas Súper Deliciosas! 🌟',
                                    jóvenes: '💎 Bebidas Destacadas',
                                    adultos: 'Bebidas Destacadas'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Las bebidas más ricas y refrescantes que tenemos para ti',
                                    jóvenes: 'Las bebidas más cool y refrescantes del momento',
                                    adultos: 'Selección premium de nuestras mejores bebidas'
                                })}
                            </p>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
                        </div>
                        <ProductsFeatured
                            productos={productosDestacados}
                            title="Bebidas Destacadas"
                        />
                    </div>
                </section>

                {/* Productos Más Vendidos */}
                {masVendidos.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🏆 ¡Las Bebidas Favoritas de Todos! 🥇',
                                        jóvenes: '🚀 Best Sellers',
                                        adultos: 'Bebidas Más Vendidas'
                                    })}
                                </h2>
                                <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: 'Estas son las bebidas que más les gustan a nuestros clientes',
                                        jóvenes: 'Las bebidas que están arrasando en ventas',
                                        adultos: 'Las bebidas preferidas por nuestros clientes'
                                    })}
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
                            </div>
                            <ProductsFeatured
                                productos={masVendidos}
                                title="Bebidas Más Vendidas"
                            />
                        </div>
                    </section>
                )}

                {/* Beneficios de la Tienda de Bebidas */}
                <StoreBenefits />

                {/* Newsletter Section con temática de bebidas */}
                <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute inset-0">
                        {settings.ageMode === 'niños' && (
                            <>
                                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce"></div>
                                <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute top-1/2 left-1/4 text-6xl animate-pulse opacity-20">🧃</div>
                                <div className="absolute top-1/3 right-1/4 text-6xl animate-pulse opacity-20" style={{ animationDelay: '2s' }}>🥤</div>
                            </>
                        )}
                        {settings.ageMode === 'jóvenes' && (
                            <>
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-xl"></div>
                            </>
                        )}
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧃 ¡Únete al Club de Bebidas Deliciosas! 🎉',
                                    jóvenes: '🔔 Stay Hydrated & Get Exclusive Deals',
                                    adultos: 'Suscríbase a Nuestro Newsletter de Bebidas'
                                })}
                            </h2>
                            <p className={`text-white/90 mb-10 text-lg md:text-xl ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Recibe ofertas súper especiales en tus bebidas favoritas y conoce las nuevas bebidas que llegan!',
                                    jóvenes: 'Sé el primero en conocer los nuevos sabores, ofertas exclusivas y lanzamientos de bebidas antes que nadie',
                                    adultos: 'Reciba información exclusiva sobre nuevas bebidas, ofertas especiales y promociones de temporada'
                                })}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                                <input
                                    type="email"
                                    placeholder={getTextByMode({
                                        niños: '¡Tu email para bebidas! 📧',
                                        jóvenes: 'tu.email@ejemplo.com',
                                        adultos: 'Su dirección de correo electrónico'
                                    })}
                                    className={`flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg ${getModeClasses()}`}
                                />
                                <button className={`bg-white text-cyan-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '¡Quiero Ofertas de Bebidas! 🚀',
                                        jóvenes: 'Subscribe Now',
                                        adultos: 'Suscribirse'
                                    })}
                                </button>
                            </div>

                            <p className={`text-white/70 text-sm ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Solo te enviaremos cosas súper geniales sobre bebidas! 😊✨',
                                    jóvenes: 'Solo ofertas refrescantes, no spam. Cancela cuando quieras. 🔒',
                                    adultos: 'Respetamos su privacidad. Solo contenido relevante sobre bebidas. Cancele en cualquier momento.'
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Estadísticas de la Tienda de Bebidas */}
                <section className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎊 ¡BebiFresh en Números Increíbles! 📊',
                                    jóvenes: '🚀 Our Beverage Stats',
                                    adultos: 'BebiFresh en Cifras'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Mira qué tan genial es nuestra tienda de bebidas',
                                    jóvenes: 'Los números que demuestran por qué somos la mejor opción en bebidas',
                                    adultos: 'Conoce el alcance y la calidad de nuestro servicio en bebidas'
                                })}
                            </p>
                            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: stats.totalProductos, label: getTextByMode({ niños: 'Bebidas Deliciosas', jóvenes: 'Bebidas Disponibles', adultos: 'Tipos de Bebidas' }), color: 'text-cyan-600', icon: '🧃' },
                                { value: `${stats.totalClientes}+`, label: getTextByMode({ niños: 'Amigos Sedientos', jóvenes: 'Clientes Satisfechos', adultos: 'Clientes Satisfechos' }), color: 'text-blue-600', icon: '😋' },
                                { value: stats.totalCategorias, label: getTextByMode({ niños: 'Tipos de Bebidas', jóvenes: 'Categorías', adultos: 'Categorías de Bebidas' }), color: 'text-emerald-600', icon: '🥤' },
                                { value: stats.totalVentas, label: getTextByMode({ niños: 'Bebidas Vendidas', jóvenes: 'Ventas Realizadas', adultos: 'Ventas de Bebidas' }), color: 'text-teal-600', icon: '💧' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className={`text-4xl md:text-6xl font-bold ${stat.color} mb-3 transition-transform duration-300 group-hover:scale-110`}>
                                        {settings.ageMode === 'niños' && <span className="mr-2">{stat.icon}</span>}
                                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                    </div>
                                    <div className={`text-gray-600 dark:text-gray-400 font-medium ${getModeClasses()}`}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call to Action Final con temática de bebidas */}
                <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧃 ¡Comienza Tu Aventura de Bebidas Refrescantes! ✨',
                                    jóvenes: '🔥 Ready to Discover Amazing Beverages?',
                                    adultos: 'Comience su Experiencia Refrescante'
                                })}
                            </h2>

                            <p className={`text-gray-600 dark:text-gray-400 mb-12 text-lg md:text-xl max-w-3xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Tenemos las bebidas más ricas y refrescantes! Jugos naturales, sodas burbujeantes, aguas saborizadas y mucho más.',
                                    jóvenes: 'Descubre nuestra increíble colección de bebidas refrescantes que perfectly match tu estilo de vida activo.',
                                    adultos: 'Descubra nuestra amplia selección de bebidas premium: desde jugos naturales hasta infusiones especiales, cuidadosamente seleccionadas para refrescar su día.'
                                })}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link
                                    href="/productos"
                                    className={`bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🧃 ¡Ver Todas las Bebidas!',
                                        jóvenes: '🥤 Shop Beverages',
                                        adultos: 'Explorar Bebidas'
                                    })}
                                </Link>

                                <Link
                                    href="/contacto"
                                    className={`border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📞 ¡Hablar con Nosotros!',
                                        jóvenes: '💬 Get in Touch',
                                        adultos: 'Contactar Ahora'
                                    })}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Agregar estilos CSS para animaciones con temática de bebidas */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .animated-gradient {
                    background: linear-gradient(-45deg, #0891b2, #0d9488, #06b6d4, #10b981);
                    background-size: 400% 400%;
                    animation: gradient 3s ease infinite;
                }

                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                `
            }} />
        </AppLayout>
    );
}