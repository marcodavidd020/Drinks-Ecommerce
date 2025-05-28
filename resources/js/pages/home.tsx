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
            <Head title="Inicio - Nuestra Tienda" />
            
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
                    <div className="py-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
                        <PromotionsBanner promociones={promociones} />
                    </div>
                )}

                {/* Separador visual con animación */}
                <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animated-gradient"></div>

                {/* Categorías */}
                <section className="py-16 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎈 ¡Explora Nuestras Categorías Divertidas! 🎈',
                                    jóvenes: '🔥 Categorías Trending',
                                    adultos: 'Nuestras Categorías'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Encuentra exactamente lo que necesitas en nuestras súper categorías organizadas!',
                                    jóvenes: 'Encuentra lo último y más cool organizado por categorías',
                                    adultos: 'Explore nuestra amplia gama de productos organizados por categorías'
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
                                    niños: '⭐ ¡Productos Súper Geniales! ⭐',
                                    jóvenes: '💎 Lo Más Destacado',
                                    adultos: 'Productos Destacados'
                                })}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                        </div>
                        <ProductsFeatured 
                            productos={productosDestacados}
                            title="Productos Destacados"
                        />
                    </div>
                </section>

                {/* Productos Más Vendidos */}
                {masVendidos.length > 0 && (
                    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className={`text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🏆 ¡Los Favoritos de Todos! 🏆',
                                        jóvenes: '🚀 Best Sellers',
                                        adultos: 'Más Vendidos'
                                    })}
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
                            </div>
                            <ProductsFeatured 
                                productos={masVendidos}
                                title="Más Vendidos"
                            />
                        </div>
                    </section>
                )}

                {/* Beneficios de la Tienda */}
                <StoreBenefits />

                {/* Newsletter Section con mejor diseño */}
                <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                    {/* Elementos decorativos */}
                    <div className="absolute inset-0">
                        {settings.ageMode === 'niños' && (
                            <>
                                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce"></div>
                                <div className="absolute bottom-10 right-10 w-16 h-16 bg-pink-300/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                            </>
                        )}
                        {settings.ageMode === 'jóvenes' && (
                            <>
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-yellow-500/20 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-xl"></div>
                            </>
                        )}
                    </div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <h2 className={`text-3xl md:text-5xl font-bold text-white mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📧 ¡Únete a Nuestro Club Súper Genial! 🎉',
                                    jóvenes: '🔔 Stay Connected & Get Exclusive Deals',
                                    adultos: 'Manténgase Informado con Nuestro Newsletter'
                                })}
                            </h2>
                            <p className={`text-white/90 mb-10 text-lg md:text-xl ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Recibe ofertas súper especiales, noticias divertidas y sorpresas increíbles directamente en tu email!',
                                    jóvenes: 'Sé el primero en conocer las últimas tendencias, ofertas exclusivas y lanzamientos antes que nadie',
                                    adultos: 'Reciba información exclusiva sobre ofertas especiales, nuevos productos y noticias importantes de nuestra empresa'
                                })}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
                                <input 
                                    type="email" 
                                    placeholder={getTextByMode({
                                        niños: '¡Tu email aquí! 📧',
                                        jóvenes: 'your.email@example.com',
                                        adultos: 'Su dirección de correo electrónico'
                                    })}
                                    className={`flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg ${getModeClasses()}`}
                                />
                                <button className={`bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '¡Apúntame Ya! 🚀',
                                        jóvenes: 'Subscribe Now',
                                        adultos: 'Suscribirse'
                                    })}
                                </button>
                            </div>

                            <p className={`text-white/70 text-sm ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Prometemos no enviar spam! Solo cosas súper geniales y divertidas 😊✨',
                                    jóvenes: 'No spam, just value. Unsubscribe anytime. 🔒',
                                    adultos: 'Respetamos su privacidad. Sin spam garantizado. Puede cancelar en cualquier momento.'
                                })}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Estadísticas de la Empresa con mejor diseño */}
                <section className="py-20 bg-white dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎊 ¡Somos Increíbles en Números! 📊',
                                    jóvenes: '🚀 Our Awesome Stats',
                                    adultos: 'Nuestra Empresa en Cifras'
                                })}
                            </h2>
                            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: stats.totalProductos, label: getTextByMode({niños: 'Productos Geniales', jóvenes: 'Products', adultos: 'Productos'}), color: 'text-blue-600', icon: '📦' },
                                { value: `${stats.totalClientes}+`, label: getTextByMode({niños: 'Amigos Felices', jóvenes: 'Happy Customers', adultos: 'Clientes Satisfechos'}), color: 'text-green-600', icon: '😊' },
                                { value: stats.totalCategorias, label: getTextByMode({niños: 'Tipos de Cosas', jóvenes: 'Categories', adultos: 'Categorías'}), color: 'text-purple-600', icon: '📂' },
                                { value: stats.totalVentas, label: getTextByMode({niños: 'Ventas Súper', jóvenes: 'Sales Made', adultos: 'Ventas Realizadas'}), color: 'text-orange-600', icon: '💰' }
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

                {/* Call to Action Final con diseño mejorado */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🛍️ ¡Comienza Tu Aventura de Compras Mágica! ✨',
                                    jóvenes: '🔥 Ready to Explore Amazing Products?',
                                    adultos: 'Comience su Experiencia de Compra Premium'
                                })}
                            </h2>
                            
                            <p className={`text-gray-600 dark:text-gray-400 mb-12 text-lg md:text-xl max-w-3xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Tenemos absolutamente todo lo que necesitas y mucho más! Descubre productos increíbles que te van a encantar y sorprender.',
                                    jóvenes: 'Discover our unique collection of trending products that perfectly match your style and personality.',
                                    adultos: 'Descubra nuestra amplia selección de productos de calidad premium, cuidadosamente seleccionados para satisfacer sus necesidades.'
                                })}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link 
                                    href="/productos"
                                    className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🚀 ¡Explorar Ahora Mismo!',
                                        jóvenes: '🛍️ Shop Now',
                                        adultos: 'Explorar Catálogo'
                                    })}
                                </Link>
                                
                                <Link 
                                    href="/contacto"
                                    className={`border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${getModeClasses()}`}
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

            {/* Agregar estilos CSS para animaciones */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .animated-gradient {
                    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
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