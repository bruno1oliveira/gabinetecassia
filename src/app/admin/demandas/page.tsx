'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Clock, User, Phone, Mail, Edit, Trash2, ChevronRight, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { DemandStatus, DemandType } from '@/types/database';

interface Demand {
    id: string;
    citizen_name: string;
    citizen_phone: string;
    citizen_email: string | null;
    neighborhood_id: number | null;
    address: string | null;
    type: DemandType;
    title: string | null;
    description: string;
    photo_url: string | null;
    status: DemandStatus;
    priority: number;
    assigned_to: string | null;
    mayor_protocol: string | null;
    resolution_notes: string | null;
    created_at: string;
    neighborhood?: { name: string };
    assigned_profile?: { full_name: string };
}

interface Neighborhood {
    id: number;
    name: string;
}

interface Profile {
    id: string;
    full_name: string;
}

const statusConfig: Record<DemandStatus, { label: string; color: string; bg: string }> = {
    nova: { label: 'Nova', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    em_analise: { label: 'Em Análise', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    encaminhada_prefeitura: { label: 'Encaminhada', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    resolvida: { label: 'Resolvida', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    arquivada: { label: 'Arquivada', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

const typeConfig: Record<DemandType, { label: string; emoji: string }> = {
    iluminacao: { label: 'Iluminação', emoji: '💡' },
    buraco: { label: 'Buraco', emoji: '🕳️' },
    assistencia: { label: 'Assistência Social', emoji: '🤝' },
    saude: { label: 'Saúde', emoji: '🏥' },
    educacao: { label: 'Educação', emoji: '📚' },
    transporte: { label: 'Transporte', emoji: '🚌' },
    moradia: { label: 'Moradia', emoji: '🏠' },
    outros: { label: 'Outros', emoji: '📋' },
};

const emptyDemand = {
    citizen_name: '',
    citizen_phone: '',
    citizen_email: '',
    neighborhood_id: null as number | null,
    address: '',
    type: 'outros' as DemandType,
    title: '',
    description: '',
    status: 'nova' as DemandStatus,
    priority: 3,
    assigned_to: null as string | null,
    mayor_protocol: '',
    resolution_notes: '',
};

export default function DemandasPage() {
    const [demands, setDemands] = useState<Demand[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<DemandStatus | 'todas'>('todas');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
    const [viewingDemand, setViewingDemand] = useState<Demand | null>(null);
    const [deletingDemand, setDeletingDemand] = useState<Demand | null>(null);
    const [formData, setFormData] = useState(emptyDemand);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [demandsRes, neighborhoodsRes, profilesRes] = await Promise.all([
                supabase.from('demands').select('*, neighborhood:neighborhoods(name), assigned_profile:profiles(full_name)').order('created_at', { ascending: false }),
                supabase.from('neighborhoods').select('id, name').order('name'),
                supabase.from('profiles').select('id, full_name').eq('is_active', true).order('full_name'),
            ]);

            if (demandsRes.data) setDemands(demandsRes.data);
            if (neighborhoodsRes.data) setNeighborhoods(neighborhoodsRes.data);
            if (profilesRes.data) setProfiles(profilesRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
        setLoading(false);
    };

    const handleNew = () => {
        setEditingDemand(null);
        setFormData(emptyDemand);
        setIsModalOpen(true);
    };

    const handleEdit = (demand: Demand) => {
        setEditingDemand(demand);
        setFormData({
            citizen_name: demand.citizen_name,
            citizen_phone: demand.citizen_phone,
            citizen_email: demand.citizen_email || '',
            neighborhood_id: demand.neighborhood_id,
            address: demand.address || '',
            type: demand.type,
            title: demand.title || '',
            description: demand.description,
            status: demand.status,
            priority: demand.priority,
            assigned_to: demand.assigned_to,
            mayor_protocol: demand.mayor_protocol || '',
            resolution_notes: demand.resolution_notes || '',
        });
        setIsModalOpen(true);
    };

    const handleView = (demand: Demand) => {
        setViewingDemand(demand);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = (demand: Demand) => {
        setDeletingDemand(demand);
        setIsDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.citizen_name.trim() || !formData.description.trim()) return;

        setSaving(true);
        try {
            const payload = {
                citizen_name: formData.citizen_name,
                citizen_phone: formData.citizen_phone || null,
                citizen_email: formData.citizen_email || null,
                neighborhood_id: formData.neighborhood_id,
                address: formData.address || null,
                type: formData.type,
                title: formData.title || null,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                assigned_to: formData.assigned_to,
                mayor_protocol: formData.mayor_protocol || null,
                resolution_notes: formData.resolution_notes || null,
                resolved_at: formData.status === 'resolvida' ? new Date().toISOString() : null,
            };

            if (editingDemand) {
                await supabase.from('demands').update(payload).eq('id', editingDemand.id);
            } else {
                await supabase.from('demands').insert(payload);
            }

            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deletingDemand) return;

        setSaving(true);
        try {
            await supabase.from('demands').delete().eq('id', deletingDemand.id);
            setIsDeleteDialogOpen(false);
            setDeletingDemand(null);
            loadData();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
        setSaving(false);
    };

    const handleStatusChange = async (demand: Demand, newStatus: DemandStatus) => {
        try {
            const payload: any = { status: newStatus };
            if (newStatus === 'resolvida') {
                payload.resolved_at = new Date().toISOString();
            }
            await supabase.from('demands').update(payload).eq('id', demand.id);
            loadData();
        } catch (error) {
            console.error('Erro ao mudar status:', error);
        }
    };

    const timeSince = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        return `${diffDays} dias`;
    };

    // Filtrar demandas
    const filteredDemands = demands.filter((d) => {
        const matchesSearch = d.citizen_name.toLowerCase().includes(search.toLowerCase()) ||
            d.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'todas' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Agrupar por status para Kanban
    const groupedDemands = Object.keys(statusConfig).reduce((acc, status) => {
        acc[status as DemandStatus] = filteredDemands.filter(d => d.status === status);
        return acc;
    }, {} as Record<DemandStatus, Demand[]>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Demandas</h1>
                    <p className="text-gray-600 mt-1">{demands.length} solicitações registradas</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nova Demanda
                </button>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-4"
            >
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou descrição..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setStatusFilter('todas')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'todas' ? 'bg-[#E30613] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Todas
                    </button>
                    {(['nova', 'em_analise', 'encaminhada_prefeitura', 'resolvida'] as DemandStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status ? 'bg-[#E30613] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {statusConfig[status].label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Kanban Board */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Carregando demandas...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {(['nova', 'em_analise', 'encaminhada_prefeitura', 'resolvida'] as DemandStatus[]).map((status) => {
                        const config = statusConfig[status];
                        const columnDemands = groupedDemands[status] || [];

                        return (
                            <div key={status} className={`rounded-xl border-2 ${config.bg} p-4 min-h-[400px]`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                        {columnDemands.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {columnDemands.map((demand) => (
                                            <motion.div
                                                key={demand.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                                                onClick={() => handleView(demand)}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{typeConfig[demand.type]?.emoji || '📋'}</span>
                                                        <span className="font-medium text-gray-900 text-sm">{demand.citizen_name}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(demand); }}
                                                            className="p-1 text-gray-400 hover:text-amber-600"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{demand.description}</p>
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {demand.neighborhood?.name && (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                            <MapPin className="w-3 h-3" />
                                                            {demand.neighborhood.name}
                                                        </span>
                                                    )}
                                                    {demand.priority <= 2 && (
                                                        <span className={`text-xs px-2 py-0.5 rounded ${demand.priority === 1 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {demand.priority === 1 ? '🔴 Crítico' : '🟡 Urgente'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {timeSince(demand.created_at)}
                                                    </span>
                                                    {demand.assigned_profile && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {demand.assigned_profile.full_name.split(' ')[0]}
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {columnDemands.length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            Nenhuma demanda
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modal Criar/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDemand ? 'Editar Demanda' : 'Nova Demanda'}
                size="xl"
            >
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cidadão *</label>
                            <input
                                type="text"
                                value={formData.citizen_name}
                                onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <input
                                type="text"
                                value={formData.citizen_phone}
                                onChange={(e) => setFormData({ ...formData, citizen_phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                value={formData.citizen_email}
                                onChange={(e) => setFormData({ ...formData, citizen_email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                            <select
                                value={formData.neighborhood_id || ''}
                                onChange={(e) => setFormData({ ...formData, neighborhood_id: e.target.value ? Number(e.target.value) : null })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                <option value="">Selecione...</option>
                                {neighborhoods.map((n) => (
                                    <option key={n.id} value={n.id}>{n.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            placeholder="Rua, número, complemento..."
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as DemandType })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                {Object.entries(typeConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.emoji} {config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as DemandStatus })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                {Object.entries(statusConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                <option value={1}>🔴 Crítico</option>
                                <option value={2}>🟡 Urgente</option>
                                <option value={3}>🟢 Normal</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Atribuir a</label>
                            <select
                                value={formData.assigned_to || ''}
                                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value || null })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                <option value="">Nenhum</option>
                                {profiles.map((p) => (
                                    <option key={p.id} value={p.id}>{p.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo Prefeitura</label>
                            <input
                                type="text"
                                value={formData.mayor_protocol}
                                onChange={(e) => setFormData({ ...formData, mayor_protocol: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="Número do protocolo"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas de Resolução</label>
                        <textarea
                            value={formData.resolution_notes}
                            onChange={(e) => setFormData({ ...formData, resolution_notes: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                            placeholder="Descreva como a demanda foi resolvida..."
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData.citizen_name.trim() || !formData.description.trim()}
                        className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </Modal>

            {/* Modal Visualizar */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalhes da Demanda"
                size="lg"
            >
                {viewingDemand && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{typeConfig[viewingDemand.type]?.emoji || '📋'}</span>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{viewingDemand.citizen_name}</h3>
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusConfig[viewingDemand.status]?.bg} ${statusConfig[viewingDemand.status]?.color}`}>
                                    {statusConfig[viewingDemand.status]?.label}
                                </span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {viewingDemand.citizen_phone || 'Não informado'}
                            </div>
                            {viewingDemand.citizen_email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {viewingDemand.citizen_email}
                                </div>
                            )}
                            {viewingDemand.neighborhood?.name && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {viewingDemand.neighborhood.name}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {new Date(viewingDemand.created_at).toLocaleString('pt-BR')}
                            </div>
                        </div>

                        {viewingDemand.address && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-1">Endereço</p>
                                <p className="font-medium">{viewingDemand.address}</p>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-1">Descrição</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{viewingDemand.description}</p>
                        </div>

                        {viewingDemand.resolution_notes && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-1">Notas de Resolução</p>
                                <p className="text-gray-700">{viewingDemand.resolution_notes}</p>
                            </div>
                        )}

                        {/* Ações rápidas de status */}
                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">Alterar Status</p>
                            <div className="flex flex-wrap gap-2">
                                {(['nova', 'em_analise', 'encaminhada_prefeitura', 'resolvida'] as DemandStatus[]).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            handleStatusChange(viewingDemand, status);
                                            setIsViewModalOpen(false);
                                        }}
                                        disabled={viewingDemand.status === status}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${viewingDemand.status === status
                                                ? `${statusConfig[status].bg} ${statusConfig[status].color}`
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {statusConfig[status].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={() => handleDeleteClick(viewingDemand)}
                                className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Excluir
                            </button>
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    handleEdit(viewingDemand);
                                }}
                                className="px-4 py-2 text-[#E30613] bg-[#E30613]/10 rounded-lg hover:bg-[#E30613]/20 transition-colors"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Dialog Confirmar Exclusão */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Demanda"
                message={`Tem certeza que deseja excluir a demanda de "${deletingDemand?.citizen_name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={saving}
            />
        </div>
    );
}
