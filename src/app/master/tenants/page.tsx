'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    Power,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Tenant } from '@/types/database';

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        const supabase = createClient();
        const { data } = await supabase
            .from('tenants')
            .select('*')
            .order('name');

        setTenants((data as Tenant[]) || []);
        setIsLoading(false);
    };

    const toggleTenantStatus = async (tenant: Tenant) => {
        const supabase = createClient();
        await supabase
            .from('tenants')
            .update({ is_active: !tenant.is_active })
            .eq('id', tenant.id);

        fetchTenants();
        setActiveMenu(null);
    };

    const deleteTenant = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este gabinete? Esta ação não pode ser desfeita.')) {
            return;
        }

        const supabase = createClient();
        await supabase.from('tenants').delete().eq('id', id);
        fetchTenants();
        setActiveMenu(null);
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gabinetes</h1>
                    <p className="text-slate-400 mt-1">Gerencie todos os gabinetes da plataforma</p>
                </div>
                <Link
                    href="/master/tenants/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Novo Gabinete
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Tenants Grid */}
            {filteredTenants.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl">
                    <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                        {searchQuery ? 'Nenhum gabinete encontrado' : 'Nenhum gabinete cadastrado'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenants.map((tenant, index) => (
                        <motion.div
                            key={tenant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-800 rounded-xl overflow-hidden"
                        >
                            {/* Color Bar */}
                            <div
                                className="h-2"
                                style={{ backgroundColor: tenant.primary_color }}
                            />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                            style={{ backgroundColor: tenant.primary_color }}
                                        >
                                            {tenant.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{tenant.name}</h3>
                                            <p className="text-sm text-slate-400">{tenant.city} - {tenant.state}</p>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === tenant.id ? null : tenant.id)}
                                            className="p-1 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeMenu === tenant.id && (
                                            <div className="absolute right-0 top-8 w-48 bg-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                                                <Link
                                                    href={`/master/tenants/${tenant.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editar
                                                </Link>
                                                <a
                                                    href={tenant.custom_domain ? `https://${tenant.custom_domain}` : `https://${tenant.slug}.gabinete.digital`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Acessar site
                                                </a>
                                                <button
                                                    onClick={() => toggleTenantStatus(tenant)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 w-full text-left"
                                                >
                                                    <Power className="w-4 h-4" />
                                                    {tenant.is_active ? 'Desativar' : 'Ativar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteTenant(tenant.id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 w-full text-left"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Excluir
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Slug</span>
                                        <span className="text-slate-200 font-mono">{tenant.slug}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Plano</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${tenant.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-400' :
                                                tenant.plan === 'premium' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-slate-600/50 text-slate-300'
                                            }`}>
                                            {tenant.plan}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Status</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${tenant.is_active
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {tenant.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                                    <Link
                                        href={`/master/tenants/${tenant.id}`}
                                        className="flex-1 py-2 text-center text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                                    >
                                        Gerenciar
                                    </Link>
                                    <Link
                                        href={`/master/tenants/${tenant.id}/users`}
                                        className="flex-1 py-2 text-center text-sm bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                                    >
                                        Usuários
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
