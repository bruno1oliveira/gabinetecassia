'use client';

import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Heart, Users, Star, Quote } from 'lucide-react';

const timeline = [
    { year: '1980', title: 'Origem', description: 'Nascida em Montes Claros, MG', icon: MapPin },
    { year: '1998', title: 'Novo Lar', description: 'Migrou para Caraguatatuba', icon: Heart },
    { year: '2010', title: 'Formação', description: 'Formou-se em Serviço Social', icon: GraduationCap },
    { year: '2024', title: 'Eleita', description: 'Vereadora pelo PT', icon: Users },
];

export default function Bio() {
    return (
        <section id="quem-sou" className="py-20 bg-gradient-to-b from-[#FEF7F7] to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#FBBF24]/10 rounded-full blur-3xl" />

            <div className="container-main relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="badge-pt mb-4 mx-auto">
                        <Star className="w-4 h-4" />
                        Conheça a Vereadora
                    </div>
                    <h2 className="section-title mb-4">
                        Quem é <span className="gradient-text">Cássia?</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative max-w-md mx-auto"
                    >
                        {/* Main Image */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#E30613]/20 to-[#FBBF24]/20 rounded-3xl blur-xl" />

                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#E30613] to-[#B91C1C]">
                                {/* 📸 FOTO BIO */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                                    <span className="text-6xl mb-4">📸</span>
                                    <p className="font-medium opacity-90">Foto Biografia</p>
                                    <p className="text-xs opacity-60 mt-2">public/images/cassia-bio.jpg</p>
                                </div>
                            </div>

                            {/* Quote card */}
                            <motion.div
                                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 max-w-[260px] border-l-4 border-[#E30613]"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <Quote className="w-6 h-6 text-[#E30613] mb-2" />
                                <p className="text-gray-700 italic text-sm leading-relaxed">
                                    &ldquo;Com luta e persistência, transformamos a realidade do nosso povo.&rdquo;
                                </p>
                                <p className="text-[#E30613] font-bold text-sm mt-3">— Cássia</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <p className="text-lg text-gray-600 leading-relaxed">
                                <strong className="text-gray-900">Cássia</strong> é uma mulher guerreira que conhece
                                de perto as dificuldades do povo. Nascida em Montes Claros, trabalhou desde criança
                                nas lavouras de algodão, desenvolvendo a <strong className="text-[#E30613]">força e
                                    resiliência</strong> que a tornaram referência na luta popular.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Formada em <strong className="text-gray-900">Serviço Social</strong>, dedicou sua vida
                                ao atendimento de famílias em situação de vulnerabilidade. Hoje, como vereadora,
                                leva a voz do povo para a Câmara Municipal.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="grid grid-cols-2 gap-4">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#E30613]/10 to-[#E30613]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-[#E30613]" />
                                    </div>
                                    <div>
                                        <span className="text-[#E30613] font-bold text-sm">{item.year}</span>
                                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
