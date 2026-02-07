import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import GabineteDigital from '@/components/landing/GabineteDigital';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fale Conosco | Vereadora Cássia - PT Caraguatatuba',
    description: 'Envie sua demanda diretamente ao gabinete da Vereadora Cássia.',
};

export default function FaleConoscoPage() {
    return (
        <>
            <Header />
            <main>
                <GabineteDigital />
            </main>
            <Footer />
        </>
    );
}
