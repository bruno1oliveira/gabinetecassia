'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/types/database';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [userRole, setUserRole] = useState<UserRole>('assessor');
    const [userName, setUserName] = useState('Carregando...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            // Verificar se usuário está autenticado
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                // Não autenticado, redirecionar para login
                router.push('/login');
                return;
            }

            // Buscar perfil do usuário (inclui role)
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, role, is_active')
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('Erro ao buscar perfil:', profileError);
                // Perfil não encontrado, pode ser que as tabelas não foram criadas
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Carregando painel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar
                userRole={userRole}
                userName={userName}
            />

            <main
                className="transition-all duration-300 ml-[280px]"
            >
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
