'use client';

import { motion } from 'framer-motion';
import type { DemandStatsByNeighborhood } from '@/types/database';

interface ThermometerProps {
    data: DemandStatsByNeighborhood[];
    maxDemands?: number;
}

export default function Thermometer({ data, maxDemands }: ThermometerProps) {
    const max = maxDemands || Math.max(...data.map((d) => d.total_demands), 1);

    const getHeatColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-red-500';
        if (percentage >= 60) return 'bg-orange-500';
        if (percentage >= 40) return 'bg-amber-500';
        if (percentage >= 20) return 'bg-yellow-400';
        return 'bg-green-400';
    };

    const sortedData = [...data].sort((a, b) => b.total_demands - a.total_demands);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    🌡️ Termômetro de Demandas por Bairro
                </h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-500">Crítico</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="text-gray-500">Baixo</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {sortedData.slice(0, 10).map((neighborhood, index) => {
                    const percentage = (neighborhood.total_demands / max) * 100;
                    const heatColor = getHeatColor(percentage);

                    return (
                        <motion.div
                            key={neighborhood.neighborhood_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                        {neighborhood.neighborhood_name}
                                    </span>
                                    {neighborhood.zone && (
                                        <span className="text-xs text-gray-400">
                                            ({neighborhood.zone})
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-500">
                                        <span className="font-medium text-gray-900">{neighborhood.new_demands}</span> novas
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {neighborhood.total_demands}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.05 }}
                                    className={`h-full ${heatColor} rounded-full relative`}
                                >
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity bg-white/30" />
                                </motion.div>
                            </div>

                            {/* Status breakdown on hover */}
                            <div className="flex gap-4 mt-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>🔵 Análise: {neighborhood.in_analysis}</span>
                                <span>📤 Prefeitura: {neighborhood.sent_to_mayor}</span>
                                <span>✅ Resolvidas: {neighborhood.resolved}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {data.length > 10 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button className="text-pt-red font-medium text-sm hover:underline">
                        Ver todos os {data.length} bairros →
                    </button>
                </div>
            )}
        </div>
    );
}
