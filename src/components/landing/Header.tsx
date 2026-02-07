'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Phone } from 'lucide-react';

const navItems = [
    { id: 'inicio', label: 'Início', href: '/' },
    { id: 'quem-sou', label: 'Quem Sou', href: '/quem-sou' },
    { id: 'atuacao', label: 'Atuação', href: '/atuacao' },
    { id: 'gabinete', label: 'Fale Conosco', href: '/fale-conosco' },
    { id: 'noticias', label: 'Notícias', href: '/noticias' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'
                }`}>
                {/* Top Red Bar */}
                <div className="h-1 bg-gradient-to-r from-[#E30613] via-[#FF4757] to-[#E30613]" />

                <div className="container-main">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#E30613] to-[#B91C1C] rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-shadow">
                                    <span className="text-white text-xl font-bold">C</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FBBF24] rounded-full flex items-center justify-center text-[8px] font-bold text-gray-900 border-2 border-white">
                                    PT
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <p className="font-bold text-gray-900 text-lg leading-tight">Vereadora Cássia</p>
                                <p className="text-xs text-[#E30613] font-medium">Caraguatatuba • PT</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive(item.href)
                                            ? 'text-[#E30613] bg-[#E30613]/10'
                                            : 'text-gray-700 hover:text-[#E30613] hover:bg-[#E30613]/5'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/5512999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex btn-whatsapp items-center gap-2 px-5 py-2.5 rounded-full text-sm"
                            >
                                <MessageCircle className="w-4 h-4" />
                                WhatsApp
                            </a>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-t shadow-xl"
                        >
                            <nav className="container-main py-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${isActive(item.href)
                                                ? 'bg-[#E30613]/10 text-[#E30613]'
                                                : 'text-gray-700 hover:bg-[#E30613]/5 hover:text-[#E30613]'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="pt-4 flex gap-3">
                                    <a
                                        href="https://wa.me/5512999999999"
                                        className="flex-1 btn-whatsapp flex items-center justify-center gap-2 py-3 rounded-xl"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </a>
                                    <a
                                        href="tel:+551238888888"
                                        className="flex-1 btn-pt-outline flex items-center justify-center gap-2 py-3 rounded-xl"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Ligar
                                    </a>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="h-[68px] lg:h-[84px]" />
        </>
    );
}
