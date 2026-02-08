'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    MoreHorizontal,
    MapPin,
    Clock,
    User,
    MessageSquare,
    Image as ImageIcon,
    ChevronDown,
} from 'lucide-react';
import type { Demand, DemandStatus } from '@/types/database';

interface KanbanColumn {
    id: DemandStatus;
    title: string;
    color: string;
    bgColor: string;
}

const columns: KanbanColumn[] = [
    { id: 'nova', title: 'Nova Demanda', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
    { id: 'em_analise', title: 'Em Análise', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200' },
    { id: 'encaminhada_prefeitura', title: 'Encaminhada à Prefeitura', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200' },
    { id: 'resolvida', title: 'Resolvida', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
];

// Sample data for demonstration
const sampleDemands: Demand[] = [
    {
        id: '1',
        citizen_name: 'Maria Silva',
        citizen_phone: '(12) 99999-1234',
        citizen_email: 'maria@email.com',
        neighborhood_id: 1,
        address_detail: 'Rua das Flores, 123',
        demand_type: 'iluminacao',
        description: 'Poste de luz queimado na esquina da Rua das Flores com Av. Principal',
        photo_url: null,
        status: 'nova',
        assigned_to: null,
        priority: 0,
        resolution_notes: null,
        resolved_at: null,
        tenant_id: null,
        created_at: '2025-02-05T10:00:00Z',
        updated_at: '2025-02-05T10:00:00Z',
        neighborhood: { id: 1, name: 'Indaiá', zone: 'Litoral Sul', population_estimate: null, tenant_id: null, created_at: '' },
    },
    {
        id: '2',
        citizen_name: 'João Santos',
        citizen_phone: '(12) 99999-5678',
        citizen_email: null,
        neighborhood_id: 2,
        address_detail: null,
        demand_type: 'buraco',
        description: 'Buraco grande na via principal que está causando acidentes',
        photo_url: '/images/buraco.jpg',
        status: 'em_analise',
        assigned_to: null,
        priority: 2,
        resolution_notes: null,
        resolved_at: null,
        tenant_id: null,
        created_at: '2025-02-04T14:30:00Z',
        updated_at: '2025-02-05T08:00:00Z',
        neighborhood: { id: 2, name: 'Centro', zone: 'Centro', population_estimate: null, tenant_id: null, created_at: '' },
    },
    {
        id: '3',
        citizen_name: 'Ana Costa',
        citizen_phone: '(12) 99999-9999',
        citizen_email: 'ana@email.com',
        neighborhood_id: 3,
        address_detail: 'Próximo à escola municipal',
        demand_type: 'assistencia',
        description: 'Família precisa de cesta básica e orientação sobre programas sociais',
        photo_url: null,
        status: 'encaminhada_prefeitura',
        assigned_to: null,
        priority: 1,
        resolution_notes: null,
        resolved_at: null,
        tenant_id: null,
        created_at: '2025-02-01T09:00:00Z',
        updated_at: '2025-02-03T16:00:00Z',
        neighborhood: { id: 3, name: 'Martim de Sá', zone: 'Litoral Sul', population_estimate: null, tenant_id: null, created_at: '' },
    },
];

const demandTypeIcons: Record<string, string> = {
    iluminacao: '💡',
    buraco: '🕳️',
    assistencia_social: '🤝',
    saude: '🏥',
    educacao: '📚',
    transporte: '🚌',
    moradia: '🏠',
    outros: '📋',
};

interface DemandCardProps {
    demand: Demand;
    onClick: (demand: Demand) => void;
}

function DemandCard({ demand, onClick }: DemandCardProps) {
    const timeSince = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        return `${diffDays} dias`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ y: -2 }}
            onClick={() => onClick(demand)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{demandTypeIcons[demand.demand_type]}</span>
                    <span className="font-medium text-gray-900 text-sm line-clamp-1">
                        {demand.citizen_name}
                    </span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {demand.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-2 mb-3">
                {demand.neighborhood && (
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        <MapPin className="w-3 h-3" />
                        {demand.neighborhood.name}
                    </span>
                )}
                {demand.photo_url && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        <ImageIcon className="w-3 h-3" />
                        Foto
                    </span>
                )}
                {demand.priority > 0 && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${demand.priority === 2
                        ? 'bg-red-50 text-red-600'
                        : 'bg-amber-50 text-amber-600'
                        }`}>
                        {demand.priority === 2 ? '🔴 Crítico' : '🟡 Urgente'}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeSince(demand.created_at)}
                </div>
                {demand.assigned_to && (
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Atribuído
                    </div>
                )}
            </div>
        </motion.div>
    );
}

interface DemandKanbanProps {
    demands?: Demand[];
    onDemandClick?: (demand: Demand) => void;
    onStatusChange?: (demandId: string, newStatus: DemandStatus) => void;
}

export default function DemandKanban({
    demands = sampleDemands,
    onDemandClick = () => { },
    onStatusChange = () => { },
}: DemandKanbanProps) {
    const [expandedColumn, setExpandedColumn] = useState<DemandStatus | null>(null);

    const getDemandsByStatus = (status: DemandStatus) => {
        return demands.filter((d) => d.status === status);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    📋 Quadro de Demandas
                </h3>
                <div className="text-sm text-gray-500">
                    {demands.length} demandas no total
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => {
                    const columnDemands = getDemandsByStatus(column.id);

                    return (
                        <div
                            key={column.id}
                            className={`rounded-lg border-2 ${column.bgColor} p-4 min-h-[400px]`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-semibold ${column.color}`}>
                                        {column.title}
                                    </h4>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${column.bgColor} ${column.color}`}>
                                        {columnDemands.length}
                                    </span>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {columnDemands.map((demand) => (
                                        <DemandCard
                                            key={demand.id}
                                            demand={demand}
                                            onClick={onDemandClick}
                                        />
                                    ))}
                                </AnimatePresence>

                                {columnDemands.length === 0 && (
                                    <div className="text-center py-8 text-gray-400">
                                        <p className="text-sm">Nenhuma demanda</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
