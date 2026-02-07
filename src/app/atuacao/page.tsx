import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Pillars from '@/components/landing/Pillars';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Atuação | Vereadora Cássia - PT Caraguatatuba',
    description: 'Conheça os pilares do mandato da Vereadora Cássia: Mulheres, Cultura, Moradia e Transporte.',
};

export default function AtuacaoPage() {
    return (
        <>
            <Header />
            <main>
                <Pillars />
            </main>
            <Footer />
        </>
    );
}
