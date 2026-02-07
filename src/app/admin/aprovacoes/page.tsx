'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, FileText, Newspaper, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';

interface PendingItem {
    id: string;
    type: 'news' | 'demand';
    title: string;
    content?: string;
    description?: string;
    author?: string;
    created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    news: { icon: Newspaper, label: 'Notícia', color: 'text-blue-600 bg-blue-100' },
    demand: { icon: FileText, label: 'Demanda', color: 'text-purple-600 bg-purple-100' },
};

export default function AprovacoesPage() {
    const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
    const [viewingItem, setViewingItem] = useState<PendingItem | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Buscar notícias pendentes
            const { data: newsData } = await supabase
                .from('news')
                .select('id, title, content, created_at, author:profiles(full_name)')
                .eq('status', 'pendente_aprovacao')
                .order('created_at', { ascending: false });

            // Buscar demandas novas (que precisam ser analisadas)
            const { data: demandsData } = await supabase
                .from('demands')
                .select('id, description, citizen_name, created_at')
                .eq('status', 'nova')
                .order('created_at', { ascending: false });

            const items: PendingItem[] = [];

            if (newsData) {
                newsData.forEach((news: any) => {
                    items.push({
                        id: news.id,
                        type: 'news',
                        title: news.title,
                        content: news.content,
                        author: news.author?.full_name || 'Desconhecido',
                        created_at: news.created_at,
                    });
                });
            }

            if (demandsData) {
                demandsData.forEach((demand: any) => {
                    items.push({
                        id: demand.id,
                        type: 'demand',
                        title: `Demanda de ${demand.citizen_name}`,
                        description: demand.description,
                        author: 'Sistema',
                        created_at: demand.created_at,
                    });
                });
            }

            // Ordenar por data
            items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setPendingItems(items);
            setStats({
                pending: items.length,
                approved: 24, // TODO: Calcular do banco
                rejected: 3,
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
        setLoading(false);
    };

    const handleApprove = async (item: PendingItem) => {
        try {
            if (item.type === 'news') {
                await supabase
                    .from('news')
                    .update({ status: 'publicada', published_at: new Date().toISOString() })
                    .eq('id', item.id);
            } else {
                await supabase
                    .from('demands')
                    .update({ status: 'em_analise' })
                    .eq('id', item.id);
            }
            loadData();
        } catch (error) {
            console.error('Erro ao aprovar:', error);
        }
    };

    const handleReject = async (item: PendingItem) => {
        try {
            if (item.type === 'news') {
                await supabase
                    .from('news')
                    .update({ status: 'rascunho' })
                    .eq('id', item.id);
            } else {
                await supabase
                    .from('demands')
                    .update({ status: 'arquivada' })
                    .eq('id', item.id);
            }
            loadData();
        } catch (error) {
            console.error('Erro ao rejeitar:', error);
        }
    };

    const handleView = (item: PendingItem) => {
        setViewingItem(item);
        setIsViewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900">Aprovações</h1>
                <p className="text-gray-600 mt-1">Itens aguardando sua aprovação</p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
            >
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            <p className="text-sm text-gray-500">Pendentes</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                            <p className="text-sm text-gray-500">Aprovadas (mês)</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                            <p className="text-sm text-gray-500">Rejeitadas (mês)</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Pending Items */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-gray-900">Itens Pendentes</h2>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-500 mt-4">Carregando...</p>
                    </div>
                ) : pendingItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                        <p>Nenhum item pendente de aprovação!</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {pendingItems.map((item) => {
                            const config = typeConfig[item.type];
                            const Icon = config.icon;

                            return (
                                <div key={`${item.type}-${item.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mb-1 ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Por {item.author} • {new Date(item.created_at).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => handleApprove(item)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Aprovar
                                            </button>
                                            <button
                                                onClick={() => handleReject(item)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Rejeitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Modal Visualizar */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={viewingItem?.title || 'Detalhes'}
                size="lg"
            >
                {viewingItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${typeConfig[viewingItem.type].color}`}>
                                {typeConfig[viewingItem.type].label}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(viewingItem.created_at).toLocaleString('pt-BR')}
                            </span>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500 mb-2">Conteúdo</p>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {viewingItem.content || viewingItem.description}
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={() => {
                                    handleReject(viewingItem);
                                    setIsViewModalOpen(false);
                                }}
                                className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Rejeitar
                            </button>
                            <button
                                onClick={() => {
                                    handleApprove(viewingItem);
                                    setIsViewModalOpen(false);
                                }}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Aprovar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
