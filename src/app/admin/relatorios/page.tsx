'use client';

import { motion } from 'framer-motion';
import { Download, Calendar, TrendingUp, Users, FileText, MapPin } from 'lucide-react';

export default function RelatoriosPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
                    <p className="text-gray-600 mt-1">Análises e métricas do mandato</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none">
                        <option>Último mês</option>
                        <option>Últimos 3 meses</option>
                        <option>Último ano</option>
                        <option>Todo período</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors">
                        <Download className="w-5 h-5" />
                        Exportar
                    </button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4"
            >
                {[
                    { icon: FileText, label: 'Total Demandas', value: '156', change: '+12%' },
                    { icon: Users, label: 'Cidadãos Atendidos', value: '423', change: '+8%' },
                    { icon: TrendingUp, label: 'Taxa de Resolução', value: '78%', change: '+5%' },
                    { icon: Calendar, label: 'Tempo Médio', value: '4 dias', change: '-15%' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#E30613]/10 rounded-xl flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-[#E30613]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                        <p className="text-xs text-green-600 mt-2">{stat.change} vs. mês anterior</p>
                    </div>
                ))}
            </motion.div>

            {/* Reports Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Demandas por Tipo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Demandas por Tipo</h3>
                    <div className="space-y-4">
                        {[
                            { type: 'Iluminação', count: 45, color: '#E30613' },
                            { type: 'Assistência Social', count: 38, color: '#8b5cf6' },
                            { type: 'Moradia', count: 32, color: '#14b8a6' },
                            { type: 'Transporte', count: 24, color: '#f59e0b' },
                            { type: 'Saúde', count: 17, color: '#22c55e' },
                        ].map((item) => (
                            <div key={item.type}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">{item.type}</span>
                                    <span className="font-medium text-gray-900">{item.count}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${(item.count / 45) * 100}%`, background: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Demandas por Bairro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Bairros</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Indaiá', count: 32, zone: 'Litoral Sul' },
                            { name: 'Centro', count: 28, zone: 'Centro' },
                            { name: 'Martim de Sá', count: 24, zone: 'Litoral Sul' },
                            { name: 'Massaguaçu', count: 18, zone: 'Litoral Norte' },
                            { name: 'Tabatinga', count: 15, zone: 'Litoral Norte' },
                        ].map((bairro, index) => (
                            <div key={bairro.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <span className="w-6 h-6 bg-[#E30613] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{bairro.name}</p>
                                    <p className="text-xs text-gray-500">{bairro.zone}</p>
                                </div>
                                <span className="font-bold text-gray-900">{bairro.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
