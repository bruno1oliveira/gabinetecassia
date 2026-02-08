'use client';

// Global error boundary - must be minimal for Next.js App Router
export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="pt-BR">
            <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6'
                }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ margin: '0 0 1rem', color: '#1f2937' }}>Algo deu errado!</h2>
                        <button
                            onClick={() => reset()}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#E30613',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
