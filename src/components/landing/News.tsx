'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';

const news = [
    {
        id: 1,
        category: 'Mandato',
        title: 'Cássia visita bairro Indaiá e ouve demandas da população',
        excerpt: 'Vereadora esteve presente para ouvir moradores sobre problemas de infraestrutura.',
        date: '5 Fev 2025',
        image: null,
    },
    {
        id: 2,
        category: 'Cultura',
        title: 'Projeto de lei apoia artistas locais de Caraguatatuba',
        excerpt: 'Iniciativa visa criar incentivos para a produção cultural na cidade.',
        date: '2 Fev 2025',
        image: null,
    },
    {
        id: 3,
        category: 'Mulheres',
        title: 'Campanha de combate à violência doméstica é lançada',
        excerpt: 'Ações de conscientização serão realizadas em diversos bairros.',
        date: '30 Jan 2025',
        image: null,
    },
];

const categoryColors: Record<string, string> = {
    Mandato: '#E30613',
    Cultura: '#8b5cf6',
    Mulheres: '#ec4899',
};

export default function News() {
    return (
        <section id="noticias" className="py-20 bg-white">
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="badge-pt mb-4">
                            <Newspaper className="w-4 h-4" />
                            Acompanhe
                        </div>
                        <h2 className="section-title">
                            Últimas <span className="gradient-text">Notícias</span>
                        </h2>
                    </div>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-[#E30613] font-semibold hover:gap-3 transition-all"
                    >
                        Ver todas as notícias <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.a
                            key={item.id}
                            href="#"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group block bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                        >
                            {/* Image */}
                            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">
                                    📸
                                </div>
                                <div
                                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                                    style={{ backgroundColor: categoryColors[item.category] || '#E30613' }}
                                >
                                    {item.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                    <Calendar className="w-4 h-4" />
                                    {item.date}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#E30613] transition-colors leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {item.excerpt}
                                </p>
                                <div className="mt-4 flex items-center gap-1 text-[#E30613] font-medium text-sm group-hover:gap-2 transition-all">
                                    Ler mais <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
