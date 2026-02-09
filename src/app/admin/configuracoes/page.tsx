'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Bell,
    Lock,
    Globe,
    Mail,
    Image as ImageIcon,
    MessageSquare,
    Share2,
    Loader2,
    Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/ui/ImageUploader';
import { getSiteSettings, updateSettings, SiteSettings } from '@/lib/settings';

export default function ConfiguracoesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Site settings
    const [settings, setSettings] = useState<SiteSettings>({
        hero_image_url: '',
        bio_image_url: '',
        bio_quote: '',
        hero_subtitle: '',
        whatsapp_number: '',
        instagram_url: '',
        facebook_url: '',
    });

    // General settings (local)
    const [generalSettings, setGeneralSettings] = useState({
        gabineteName: 'Gabinete Vereadora Cássia',
        phone: '(12) 3888-8888',
        email: 'cassia@camara.leg.br',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const siteSettings = await getSiteSettings();
            setSettings(siteSettings);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    const updateSetting = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-[#E30613] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                    <p className="text-gray-600 mt-1">Gerencie as configurações do site e painel</p>
                </div>
                <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-[#E30613] text-white hover:bg-[#B91C1C]'
                        } disabled:opacity-50`}
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Tudo'}
                </motion.button>
            </motion.div>

            {/* Settings Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Aparência do Site */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Aparência do Site</h3>
                            <p className="text-sm text-gray-500">Fotos exibidas na página inicial</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto do Hero (Banner Principal)
                            </label>
                            <ImageUploader
                                value={settings.hero_image_url}
                                onChange={(url) => updateSetting('hero_image_url', url)}
                                folder="hero"
                                aspectRatio="square"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Recomendado: 800x800px, formato quadrado
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto da Biografia
                            </label>
                            <ImageUploader
                                value={settings.bio_image_url}
                                onChange={(url) => updateSetting('bio_image_url', url)}
                                folder="bio"
                                aspectRatio="auto"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Recomendado: 600x750px, formato retrato
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Textos do Site */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Textos do Site</h3>
                            <p className="text-sm text-gray-500">Citações e descrições</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtítulo do Hero
                            </label>
                            <textarea
                                value={settings.hero_subtitle}
                                onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                                placeholder="Trabalhando todos os dias pela nossa cidade..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Citação da Biografia
                            </label>
                            <textarea
                                value={settings.bio_quote}
                                onChange={(e) => updateSetting('bio_quote', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                                placeholder="Com luta e persistência..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Redes Sociais */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Share2 className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Redes Sociais</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp (apenas números)
                            </label>
                            <input
                                type="text"
                                value={settings.whatsapp_number}
                                onChange={(e) => updateSetting('whatsapp_number', e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="5512999999999"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instagram (URL completa)
                            </label>
                            <input
                                type="url"
                                value={settings.instagram_url}
                                onChange={(e) => updateSetting('instagram_url', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="https://instagram.com/cassia"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Facebook (URL completa)
                            </label>
                            <input
                                type="url"
                                value={settings.facebook_url}
                                onChange={(e) => updateSetting('facebook_url', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="https://facebook.com/cassia"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Geral */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Geral</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Gabinete</label>
                            <input
                                type="text"
                                value={generalSettings.gabineteName}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, gabineteName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
                            <input
                                type="text"
                                value={generalSettings.phone}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail do Gabinete</label>
                            <input
                                type="email"
                                value={generalSettings.email}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notificações */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Notificações</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'E-mail para novas demandas', enabled: true },
                            { label: 'Notificação push', enabled: false },
                            { label: 'Resumo diário', enabled: true },
                            { label: 'Alertas de urgência', enabled: true },
                        ].map((item) => (
                            <label key={item.label} className="flex items-center justify-between cursor-pointer">
                                <span className="text-gray-700">{item.label}</span>
                                <div className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#E30613]' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </motion.div>

                {/* Segurança */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Segurança</h3>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <p className="font-medium text-gray-900">Alterar senha</p>
                            <p className="text-sm text-gray-500">Atualize sua senha de acesso</p>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <p className="font-medium text-gray-900">Sessões ativas</p>
                            <p className="text-sm text-gray-500">Gerencie suas sessões de login</p>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
