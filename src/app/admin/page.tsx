'use client';

import { motion } from 'framer-motion';
import StatsCards from '@/components/admin/StatsCards';
import Thermometer from '@/components/admin/Thermometer';
import DemandKanban from '@/components/admin/DemandKanban';
import type { DemandStatsByNeighborhood } from '@/types/database';

// Sample data for demonstration
const sampleStats = {
    totalDemands: 156,
    resolvedDemands: 89,
    pendingDemands: 67,
    totalContacts: 423,
};

const sampleNeighborhoodStats: DemandStatsByNeighborhood[] = [
    { neighborhood_id: 1, neighborhood_name: 'Indaiá', zone: 'Litoral Sul', total_demands: 32, new_demands: 8, in_analysis: 12, sent_to_mayor: 7, resolved: 5 },
    { neighborhood_id: 2, neighborhood_name: 'Centro', zone: 'Centro', total_demands: 28, new_demands: 5, in_analysis: 10, sent_to_mayor: 8, resolved: 5 },
    { neighborhood_id: 3, neighborhood_name: 'Martim de Sá', zone: 'Litoral Sul', total_demands: 24, new_demands: 6, in_analysis: 8, sent_to_mayor: 5, resolved: 5 },
    { neighborhood_id: 4, neighborhood_name: 'Massaguaçu', zone: 'Litoral Norte', total_demands: 18, new_demands: 4, in_analysis: 6, sent_to_mayor: 4, resolved: 4 },
    { neighborhood_id: 5, neighborhood_name: 'Tabatinga', zone: 'Litoral Norte', total_demands: 15, new_demands: 3, in_analysis: 5, sent_to_mayor: 4, resolved: 3 },
    { neighborhood_id: 6, neighborhood_name: 'Sumaré', zone: 'Centro', total_demands: 12, new_demands: 2, in_analysis: 4, sent_to_mayor: 3, resolved: 3 },
    { neighborhood_id: 7, neighborhood_name: 'Porto Novo', zone: 'Litoral Sul', total_demands: 10, new_demands: 2, in_analysis: 3, sent_to_mayor: 3, resolved: 2 },
    { neighborhood_id: 8, neighborhood_name: 'Jardim Primavera', zone: 'Centro', total_demands: 8, new_demands: 1, in_analysis: 3, sent_to_mayor: 2, resolved: 2 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Bem-vindo(a) ao painel do Gabinete da Vereadora Cássia
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </div>
            </motion.div>

            {/* Stats Cards */}
            <StatsCards stats={sampleStats} />

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Thermometer - Takes 1 column */}
                <div className="lg:col-span-1">
                    <Thermometer data={sampleNeighborhoodStats} />
                </div>

                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            📊 Atividades Recentes
                        </h3>
                        <div className="space-y-4">
                            {[
                                { action: 'Nova demanda recebida', user: 'Maria Silva', time: '5 min atrás', type: 'demanda' },
                                { action: 'Demanda encaminhada à prefeitura', user: 'Assessor João', time: '15 min atrás', type: 'update' },
                                { action: 'Notícia publicada', user: 'Assessor Ana', time: '1 hora atrás', type: 'news' },
                                { action: 'Demanda resolvida', user: 'Sistema', time: '2 horas atrás', type: 'resolved' },
                                { action: 'Novo contato cadastrado', user: 'Assessor João', time: '3 horas atrás', type: 'contact' },
                            ].map((activity, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'demanda' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'update' ? 'bg-purple-100 text-purple-600' :
                                                activity.type === 'news' ? 'bg-amber-100 text-amber-600' :
                                                    activity.type === 'resolved' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                        }`}>
                                        {activity.type === 'demanda' ? '📨' :
                                            activity.type === 'update' ? '📤' :
                                                activity.type === 'news' ? '📰' :
                                                    activity.type === 'resolved' ? '✅' : '👤'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-sm text-gray-500">{activity.user}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Kanban Board */}
            <DemandKanban />
        </div>
    );
}
