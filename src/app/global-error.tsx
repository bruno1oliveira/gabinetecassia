'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
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
                        padding: '2rem',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                            Algo deu errado!
                        </h2>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Ocorreu um erro inesperado. Por favor, tente novamente.
                        </p>
                        <button
                            onClick={() => reset()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#E30613',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: '500'
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
