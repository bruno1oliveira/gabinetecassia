'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { TenantProvider } from '@/contexts/TenantContext';
import { createClient } from '@/lib/supabase/client';
import type { UserRole, Tenant } from '@/types/database';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [userRole, setUserRole] = useState<UserRole>('assessor');
    const [userName, setUserName] = useState('Carregando...');
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            // Verificar se usuário está autenticado
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/login');
                return;
            }

            // Buscar perfil do usuário (sem tenant_id - schema simples)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, role, is_active')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('Erro ao buscar perfil:', profileError);
                // Fallback: usar dados do auth
                setUserName(user.email || 'Usuário');
                setUserRole('assessor');
                setIsLoading(false);
                return;
            }

            // Verificar se usuário está ativo
            if (!profile.is_active) {
                await supabase.auth.signOut();
                router.push('/login?error=inactive');
                return;
            }

            setUserName(profile.full_name);
            setUserRole(profile.role as UserRole);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    // Gerar CSS variables do tenant (usando cores padrão)
    const tenantStyles = `
        :root {
            --primary-color: ${tenant?.primary_color || '#E30613'};
            --secondary-color: ${tenant?.secondary_color || '#FBBF24'};
        }
    `;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div
                        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: '#E30613', borderTopColor: 'transparent' }}
                    />
                    <p className="text-gray-600">Carregando painel...</p>
                </div>
            </div>
        );
    }

    return (
        <TenantProvider tenant={tenant}>
            {/* Inject tenant CSS variables */}
            <style dangerouslySetInnerHTML={{ __html: tenantStyles }} />

            <div className="min-h-screen bg-gray-100">
                <Sidebar
                    userRole={userRole}
                    userName={userName}
                    tenant={tenant}
                />

                <main className="transition-all duration-300 ml-[280px]">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </TenantProvider>
    );
}
