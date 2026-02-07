import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Bio from '@/components/landing/Bio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Quem é Cássia | Vereadora Cássia - PT Caraguatatuba',
    description: 'Conheça a trajetória de luta e dedicação da Vereadora Cássia, do PT de Caraguatatuba.',
};

export default function QuemSouPage() {
    return (
        <>
            <Header />
            <main>
                <Bio />
            </main>
            <Footer />
        </>
    );
}
