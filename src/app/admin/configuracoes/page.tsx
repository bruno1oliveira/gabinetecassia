'use client';

import { motion } from 'framer-motion';
import { Save, Bell, Lock, Palette, Globe, Database, Mail } from 'lucide-react';

export default function ConfiguracoesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
            </motion.div>

            {/* Settings Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Geral */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
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
                                defaultValue="Gabinete Vereadora Cássia"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Principal</label>
                            <input
                                type="text"
                                defaultValue="(12) 3888-8888"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                            <input
                                type="text"
                                defaultValue="(12) 99999-9999"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Notificações */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
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

                {/* E-mail */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">E-mail</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail do Gabinete</label>
                            <input
                                type="email"
                                defaultValue="cassia@camara.leg.br"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail para Cópia (CC)</label>
                            <input
                                type="email"
                                defaultValue=""
                                placeholder="email@exemplo.com"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Segurança */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end"
            >
                <button className="flex items-center gap-2 px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors">
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                </button>
            </motion.div>
        </div>
    );
}
