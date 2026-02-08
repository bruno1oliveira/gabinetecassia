'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MasterSidebar from '@/components/master/MasterSidebar';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

export default function MasterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();

            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/login');
                return;
            }

            // Buscar perfil
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError || !profileData) {
                router.push('/login');
                return;
            }

            // Verificar se é platform_admin
            if (profileData.role !== 'platform_admin') {
                router.push('/admin');
                return;
            }

            setProfile(profileData as Profile);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Carregando painel master...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <MasterSidebar
                userName={profile?.full_name || 'Admin'}
                userAvatar={profile?.avatar_url || undefined}
            />

            <main className="transition-all duration-300 ml-[280px]">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
