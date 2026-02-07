import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Quick Links Section */}
        <section className="py-20 bg-white">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Quem Sou */}
              <a
                href="/quem-sou"
                className="group block bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <span className="text-5xl mb-4 block">👩‍💼</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#E30613] transition-colors">
                  Quem é Cássia
                </h3>
                <p className="text-gray-600">
                  Conheça a trajetória de luta e dedicação da nossa vereadora.
                </p>
              </a>

              {/* Atuação */}
              <a
                href="/atuacao"
                className="group block bg-gradient-to-br from-[#E30613]/5 to-[#E30613]/10 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <span className="text-5xl mb-4 block">⚡</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#E30613] transition-colors">
                  Pilares do Mandato
                </h3>
                <p className="text-gray-600">
                  Mulheres, Cultura, Moradia e Transporte - nossas bandeiras.
                </p>
              </a>

              {/* Fale Conosco */}
              <a
                href="/fale-conosco"
                className="group block bg-gradient-to-br from-[#FBBF24]/10 to-[#FBBF24]/20 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <span className="text-5xl mb-4 block">💬</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#E30613] transition-colors">
                  Envie sua Demanda
                </h3>
                <p className="text-gray-600">
                  Faça sua solicitação diretamente ao gabinete da vereadora.
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-[#E30613] via-[#FF4757] to-[#E30613]">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[
                { value: '+500', label: 'Famílias Atendidas' },
                { value: '47', label: 'Projetos de Lei' },
                { value: '12', label: 'Bairros Visitados' },
                { value: '100%', label: 'Compromisso' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                  <div className="text-white/80 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-main text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Precisa de ajuda? <span className="gradient-text">Fale conosco!</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Nossa equipe está pronta para ouvir suas demandas e trabalhar por você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/fale-conosco"
                className="btn-pt px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2"
              >
                💬 Enviar Demanda
              </a>
              <a
                href="https://wa.me/5512999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-8 py-4 rounded-2xl text-lg inline-flex items-center justify-center gap-2"
              >
                📱 WhatsApp Direto
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
