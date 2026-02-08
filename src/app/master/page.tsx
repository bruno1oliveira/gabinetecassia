'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    ClipboardList,
    TrendingUp,
    Plus,
    ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Tenant } from '@/types/database';

interface DashboardStats {
    totalTenants: number;
    activeTenants: number;
    totalUsers: number;
    totalDemands: number;
}

export default function MasterDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalTenants: 0,
        activeTenants: 0,
        totalUsers: 0,
        totalDemands: 0,
    });
    const [recentTenants, setRecentTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            // Buscar estatísticas
            const [tenantsRes, usersRes, demandsRes] = await Promise.all([
                supabase.from('tenants').select('id, is_active', { count: 'exact' }),
                supabase.from('profiles').select('id', { count: 'exact' }),
                supabase.from('demands').select('id', { count: 'exact' }),
            ]);

            const tenants = tenantsRes.data || [];
            const activeTenants = tenants.filter(t => t.is_active).length;

            setStats({
                totalTenants: tenantsRes.count || 0,
                activeTenants,
                totalUsers: usersRes.count || 0,
                totalDemands: demandsRes.count || 0,
            });

            // Buscar tenants recentes
            const { data: recent } = await supabase
                .from('tenants')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentTenants((recent as Tenant[]) || []);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Gabinetes',
            value: stats.totalTenants,
            subtitle: `${stats.activeTenants} ativos`,
            icon: Building2,
            color: 'from-indigo-500 to-purple-600',
            href: '/master/tenants',
        },
        {
            title: 'Usuários',
            value: stats.totalUsers,
            subtitle: 'Total cadastrados',
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            href: '/master/users',
        },
        {
            title: 'Demandas',
            value: stats.totalDemands,
            subtitle: 'Todas as plataformas',
            icon: ClipboardList,
            color: 'from-amber-500 to-orange-600',
            href: '/master/reports',
        },
        {
            title: 'Crescimento',
            value: '+12%',
            subtitle: 'Últimos 30 dias',
            icon: TrendingUp,
            color: 'from-rose-500 to-pink-600',
            href: '/master/reports',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard Master</h1>
                    <p className="text-slate-400 mt-1">Visão geral da plataforma Gabinete Digital</p>
                </div>
                <Link
                    href="/master/tenants/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Novo Gabinete
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={card.href}>
                            <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/50 transition-colors group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                                        <card.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                                <p className="text-sm text-slate-400 mt-1">{card.title}</p>
                                <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Tenants */}
            <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Gabinetes Recentes</h2>
                    <Link
                        href="/master/tenants"
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Ver todos →
                    </Link>
                </div>

                {recentTenants.length === 0 ? (
                    <div className="text-center py-8">
                        <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Nenhum gabinete cadastrado</p>
                        <Link
                            href="/master/tenants/new"
                            className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300"
                        >
                            <Plus className="w-4 h-4" />
                            Criar primeiro gabinete
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTenants.map((tenant) => (
                            <Link
                                key={tenant.id}
                                href={`/master/tenants/${tenant.id}`}
                                className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: tenant.primary_color }}
                                    >
                                        {tenant.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{tenant.name}</p>
                                        <p className="text-sm text-slate-400">{tenant.city} - {tenant.state}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${tenant.is_active
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {tenant.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {tenant.plan}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
