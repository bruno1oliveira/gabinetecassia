import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import News from '@/components/landing/News';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notícias | Vereadora Cássia - PT Caraguatatuba',
    description: 'Acompanhe as últimas notícias e ações da Vereadora Cássia.',
};

export default function NoticiasPage() {
    return (
        <>
            <Header />
            <main>
                <News />
            </main>
            <Footer />
        </>
    );
}
