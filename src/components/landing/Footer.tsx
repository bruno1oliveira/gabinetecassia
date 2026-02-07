'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Heart, ArrowUp } from 'lucide-react';

const links = [
    { label: 'Início', href: '/' },
    { label: 'Quem Sou', href: '/quem-sou' },
    { label: 'Atuação', href: '/atuacao' },
    { label: 'Fale Conosco', href: '/fale-conosco' },
    { label: 'Notícias', href: '/noticias' },
];

const socials = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#E30613]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-3xl" />

            <div className="container-main relative z-10">
                {/* Main Footer */}
                <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#E30613] to-[#B91C1C] rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-xl font-bold">C</span>
                            </div>
                            <div>
                                <p className="font-bold text-lg">Vereadora Cássia</p>
                                <p className="text-xs text-gray-400">PT • Caraguatatuba</p>
                            </div>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Trabalhando por uma Caraguatatuba mais humana, justa e inclusiva para todos.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Navegação</h4>
                        <ul className="space-y-3">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:pl-2 transition-all inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contato</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5 mt-0.5 text-[#E30613]" />
                                    <span>Câmara Municipal de Caraguatatuba<br />Av. São Paulo, 123</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+551238888888" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                                    <Phone className="w-5 h-5 text-[#E30613]" />
                                    <span>(12) 3888-8888</span>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:cassia@caraguatatuba.sp.leg.br" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                                    <Mail className="w-5 h-5 text-[#E30613]" />
                                    <span>cassia@camara.leg.br</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Redes Sociais</h4>
                        <div className="flex gap-3">
                            {socials.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#E30613] transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-6">
                            Siga para acompanhar nosso mandato!
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        © 2025 Gabinete Vereadora Cássia. Feito com{' '}
                        <Heart className="w-4 h-4 text-[#E30613] fill-[#E30613]" /> para Caraguatatuba.
                    </p>

                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Voltar ao topo <ArrowUp className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>
        </footer>
    );
}
