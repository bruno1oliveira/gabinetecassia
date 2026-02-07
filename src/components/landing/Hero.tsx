'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-warm-gradient">
      {/* Background Elements */}
      <div className="absolute inset-0 pattern-dots" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E30613]/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#FBBF24]/10 rounded-full blur-3xl" />

      <div className="container-main relative z-10 py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="badge-pt mb-6"
            >
              <Heart className="w-4 h-4" />
              Vereadora pelo PT • 2025-2028
            </motion.div>

            <h1 className="section-title leading-tight mb-6">
              Sua voz na{' '}
              <span className="gradient-text">Câmara Municipal</span>{' '}
              de Caraguatatuba
            </h1>

            <p className="section-subtitle text-left lg:text-left mb-8">
              Trabalhando todos os dias pela nossa cidade. Defendo <strong className="text-[#E30613]">mulheres</strong>,
              <strong className="text-[#E30613]"> cultura caiçara</strong> e
              <strong className="text-[#E30613]"> moradia digna</strong> para quem mais precisa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/fale-conosco"
                  className="btn-pt flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg"
                >
                  💬 Fale com o Gabinete
                </Link>
              </motion.div>

              <motion.a
                href="https://wa.me/5512999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Direto
              </motion.a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Respondemos em até 24h
              </div>
              <div className="hidden sm:block">•</div>
              <div className="hidden sm:block">+500 famílias atendidas</div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 -m-4 border-2 border-dashed border-[#E30613]/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-0 -m-8 border-2 border-dashed border-[#FBBF24]/20 rounded-full animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />

              {/* Main Image Container */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E30613] to-[#B91C1C] rounded-full glow-red" />

                {/* 📸 FOTO HERO */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-[#E30613] to-[#FF4757]">
                  <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-8">
                    <span className="text-6xl mb-4">📸</span>
                    <p className="font-medium opacity-90">Foto da Vereadora</p>
                    <p className="text-xs opacity-60 mt-2">public/images/cassia-hero.jpg</p>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -right-4 top-8 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <span className="text-2xl">💪</span>
                  <span className="text-sm font-semibold text-gray-800">Luta Popular</span>
                </motion.div>

                <motion.div
                  className="absolute -left-4 bottom-16 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                >
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm font-semibold text-gray-800">PT Caraguá</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-400"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-sm">Role para conhecer</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  );
}
