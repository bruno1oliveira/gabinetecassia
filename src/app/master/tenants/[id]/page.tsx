'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Palette,
    Globe,
    Phone,
    Save,
    Users,
    BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Tenant } from '@/types/database';

export default function EditTenantPage() {
    const router = useRouter();
    const params = useParams();
    const tenantId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stats, setStats] = useState({ users: 0, demands: 0, contacts: 0 });
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        city: '',
        state: 'SP',
        primary_color: '#E30613',
        secondary_color: '#FBBF24',
        whatsapp: '',
        email: '',
        instagram: '',
        facebook: '',
        custom_domain: '',
        plan: 'basic',
        is_active: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();

            // Fetch tenant
            const { data: tenant } = await supabase
                .from('tenants')
                .select('*')
                .eq('id', tenantId)
                .single();

            if (!tenant) {
                router.push('/master/tenants');
                return;
            }

            setFormData({
                name: tenant.name,
                slug: tenant.slug,
                city: tenant.city,
                state: tenant.state,
                primary_color: tenant.primary_color || '#E30613',
                secondary_color: tenant.secondary_color || '#FBBF24',
                whatsapp: tenant.whatsapp || '',
                email: tenant.email || '',
                instagram: tenant.instagram || '',
                facebook: tenant.facebook || '',
                custom_domain: tenant.custom_domain || '',
                plan: tenant.plan || 'basic',
                is_active: tenant.is_active,
            });

            // Fetch stats
            const [usersRes, demandsRes, contactsRes] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
                supabase.from('demands').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
                supabase.from('contacts').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
            ]);

            setStats({
                users: usersRes.count || 0,
                demands: demandsRes.count || 0,
                contacts: contactsRes.count || 0,
            });

            setIsLoading(false);
        };

        fetchData();
    }, [tenantId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('tenants')
                .update({
                    name: formData.name,
                    slug: formData.slug,
                    city: formData.city,
                    state: formData.state,
                    primary_color: formData.primary_color,
                    secondary_color: formData.secondary_color,
                    whatsapp: formData.whatsapp || null,
                    email: formData.email || null,
                    instagram: formData.instagram || null,
                    facebook: formData.facebook || null,
                    custom_domain: formData.custom_domain || null,
                    plan: formData.plan,
                    is_active: formData.is_active,
                })
                .eq('id', tenantId);

            if (error) throw error;

            router.push('/master/tenants');
        } catch (error) {
            console.error('Error updating tenant:', error);
            alert('Erro ao atualizar gabinete.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const brazilianStates = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
        'SP', 'SE', 'TO'
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/master/tenants"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">{formData.name}</h1>
                    <p className="text-slate-400 mt-1">{formData.slug}.gabinete.digital</p>
                </div>
                <Link
                    href={`/master/tenants/${tenantId}/users`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                    <Users className="w-5 h-5" />
                    Usuários
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.users}</p>
                    <p className="text-sm text-slate-400">Usuários</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <BarChart3 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.demands}</p>
                    <p className="text-sm text-slate-400">Demandas</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stats.contacts}</p>
                    <p className="text-sm text-slate-400">Contatos</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Status do Gabinete</h2>
                            <p className="text-sm text-slate-400">Ative ou desative o acesso do gabinete à plataforma</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-3 text-sm font-medium text-slate-300">
                                {formData.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                        </label>
                    </div>
                </motion.div>

                {/* Basic Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-800 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Informações Básicas</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Nome do Gabinete *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Plano
                            </label>
                            <select
                                name="plan"
                                value={formData.plan}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="basic">Básico</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Cidade *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Estado *
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                                {brazilianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Branding */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Identidade Visual</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Cor Principal
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="primary_color"
                                    value={formData.primary_color}
                                    onChange={handleChange}
                                    className="w-12 h-10 rounded cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={formData.primary_color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Cor Secundária
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="secondary_color"
                                    value={formData.secondary_color}
                                    onChange={handleChange}
                                    className="w-12 h-10 rounded cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={formData.secondary_color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Contato</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                WhatsApp
                            </label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Facebook
                            </label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Domain */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-amber-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Domínio Personalizado</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Domínio Próprio (opcional)
                        </label>
                        <input
                            type="text"
                            name="custom_domain"
                            value={formData.custom_domain}
                            onChange={handleChange}
                            placeholder="vereadorjoao.com.br"
                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </motion.div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/master/tenants"
                        className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
