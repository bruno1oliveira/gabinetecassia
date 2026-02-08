'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Palette,
    Globe,
    Phone,
    Save,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NewTenantPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const supabase = createClient();

            const { error } = await supabase.from('tenants').insert({
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
            });

            if (error) throw error;

            router.push('/master/tenants');
        } catch (error) {
            console.error('Error creating tenant:', error);
            alert('Erro ao criar gabinete. Verifique se o slug já não está em uso.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const brazilianStates = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
        'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
        'SP', 'SE', 'TO'
    ];

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/master/tenants"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Novo Gabinete</h1>
                    <p className="text-slate-400 mt-1">Cadastre um novo gabinete na plataforma</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                                placeholder="Ex: Vereador João Silva"
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                                placeholder="vereador-joao"
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                URL: {formData.slug || 'slug'}.gabinete.digital
                            </p>
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
                                placeholder="Caraguatatuba"
                                required
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                    transition={{ delay: 0.1 }}
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

                    {/* Preview */}
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: formData.primary_color + '20' }}>
                        <p className="text-sm text-slate-300 mb-2">Prévia:</p>
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: formData.primary_color }}
                        >
                            Botão Exemplo
                        </button>
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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
                                placeholder="5512999999999"
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                                placeholder="contato@gabinete.com.br"
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                                placeholder="@vereadorjoao"
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
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
                                placeholder="vereadorjoao"
                                className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Domain */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                        <p className="text-xs text-slate-500 mt-1">
                            O cliente precisará configurar o DNS para apontar para nossos servidores
                        </p>
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
                        {isSubmitting ? 'Criando...' : 'Criar Gabinete'}
                    </button>
                </div>
            </form>
        </div>
    );
}
