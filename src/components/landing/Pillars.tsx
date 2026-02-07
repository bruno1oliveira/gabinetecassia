'use client';

import { motion, type Variants } from 'framer-motion';
import { Users, Palette, Home, Bus, TrendingUp } from 'lucide-react';

const pillars = [
    {
        icon: Users,
        title: 'Direitos das Mulheres',
        description: 'Combate à violência doméstica, empoderamento feminino e políticas públicas de proteção.',
        color: '#ec4899',
        stats: '+120 mulheres atendidas',
    },
    {
        icon: Palette,
        title: 'Cultura Caiçara',
        description: 'Valorização dos artistas locais, eventos culturais e preservação da identidade caiçara.',
        color: '#8b5cf6',
        stats: '15 projetos culturais',
    },
    {
        icon: Home,
        title: 'Moradia Digna',
        description: 'Defesa do Minha Casa Minha Vida e regularização fundiária para famílias carentes.',
        color: '#f59e0b',
        stats: '+200 famílias apoiadas',
    },
    {
        icon: Bus,
        title: 'Transporte Público',
        description: 'Melhoria das linhas de ônibus, acessibilidade e mobilidade urbana para todos.',
        color: '#14b8a6',
        stats: '8 bairros beneficiados',
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Pillars() {
    return (
        <section id="atuacao" className="py-20 bg-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pattern-dots opacity-50" />

            <div className="container-main relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="badge-pt mb-4 mx-auto">
                        <TrendingUp className="w-4 h-4" />
                        Bandeiras de Luta
                    </div>
                    <h2 className="section-title mb-4">
                        Pilares do <span className="gradient-text">Mandato</span>
                    </h2>
                    <p className="section-subtitle">
                        Conheça as principais frentes de atuação da Vereadora Cássia
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {pillars.map((pillar) => (
                        <motion.div
                            key={pillar.title}
                            variants={cardVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            {/* Top gradient bar */}
                            <div
                                className="h-2"
                                style={{ background: `linear-gradient(to right, ${pillar.color}, ${pillar.color}88)` }}
                            />

                            <div className="p-6">
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: `${pillar.color}15` }}
                                >
                                    <pillar.icon className="w-7 h-7" style={{ color: pillar.color }} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {pillar.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {pillar.description}
                                </p>

                                {/* Stats */}
                                <div
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{ backgroundColor: `${pillar.color}10`, color: pillar.color }}
                                >
                                    ✨ {pillar.stats}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 bg-gradient-to-r from-[#E30613] via-[#FF4757] to-[#E30613] rounded-3xl p-8 md:p-12 glow-red"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { value: '+500', label: 'Famílias Atendidas' },
                            { value: '47', label: 'Projetos de Lei' },
                            { value: '12', label: 'Bairros Visitados' },
                            { value: '100%', label: 'Compromisso' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                                <div className="text-white/80 text-sm mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
