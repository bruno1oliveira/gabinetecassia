// Force dynamic rendering - avoid SSG issues
export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 style={{ fontSize: '6rem', margin: 0, color: '#E30613' }}>404</h1>
                <h2 style={{ margin: '1rem 0', color: '#1f2937' }}>Página não encontrada</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    A página que você está procurando não existe.
                </p>
                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#E30613',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px'
                    }}
                >
                    Voltar ao início
                </a>
            </div>
        </div>
    );
}
