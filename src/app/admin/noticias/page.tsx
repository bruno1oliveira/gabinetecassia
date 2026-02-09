'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Eye, Trash2, Calendar, Send, Archive, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUploader from '@/components/ui/ImageUploader';

type NewsStatus = 'rascunho' | 'pendente_aprovacao' | 'publicada' | 'arquivada';

interface News {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    category: string | null;
    status: NewsStatus;
    published_at: string | null;
    created_at: string;
}

const statusColors: Record<NewsStatus, { bg: string; text: string; label: string }> = {
    publicada: { bg: 'bg-green-100', text: 'text-green-700', label: 'Publicada' },
    pendente_aprovacao: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pendente' },
    rascunho: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Rascunho' },
    arquivada: { bg: 'bg-red-100', text: 'text-red-700', label: 'Arquivada' },
};

const categories = ['Mandato', 'Mulheres', 'Cultura', 'Transporte', 'Saúde', 'Educação', 'Moradia', 'Eventos'];

const emptyNews = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: '',
    status: 'rascunho' as NewsStatus,
};

export default function NoticiasPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('todas');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [viewingNews, setViewingNews] = useState<News | null>(null);
    const [deletingNews, setDeletingNews] = useState<News | null>(null);
    const [formData, setFormData] = useState(emptyNews);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setNews(data);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
        }
        setLoading(false);
    };

    // Gerar slug a partir do título
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNew = () => {
        setEditingNews(null);
        setFormData(emptyNews);
        setIsModalOpen(true);
    };

    const handleEdit = (item: News) => {
        setEditingNews(item);
        setFormData({
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt || '',
            content: item.content,
            cover_image_url: item.cover_image_url || '',
            category: item.category || '',
            status: item.status,
        });
        setIsModalOpen(true);
    };

    const handleView = (item: News) => {
        setViewingNews(item);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = (item: News) => {
        setDeletingNews(item);
        setIsDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.content.trim()) return;

        setSaving(true);
        try {
            const slug = formData.slug || generateSlug(formData.title);
            const payload = {
                title: formData.title,
                slug,
                excerpt: formData.excerpt || null,
                content: formData.content,
                cover_image_url: formData.cover_image_url || null,
                category: formData.category || null,
                status: formData.status,
                published_at: formData.status === 'publicada' ? new Date().toISOString() : null,
            };

            if (editingNews) {
                await supabase.from('news').update(payload).eq('id', editingNews.id);
            } else {
                await supabase.from('news').insert(payload);
            }

            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deletingNews) return;

        setSaving(true);
        try {
            await supabase.from('news').delete().eq('id', deletingNews.id);
            setIsDeleteDialogOpen(false);
            setDeletingNews(null);
            loadData();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
        setSaving(false);
    };

    const handleStatusChange = async (item: News, newStatus: NewsStatus) => {
        try {
            const payload: any = { status: newStatus };
            if (newStatus === 'publicada') {
                payload.published_at = new Date().toISOString();
            }

            await supabase.from('news').update(payload).eq('id', item.id);
            loadData();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    // Filtrar notícias
    const filteredNews = news.filter((n) => {
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'todas' || n.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
                    <p className="text-gray-600 mt-1">{news.length} publicações</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nova Notícia
                </button>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4 flex gap-4 flex-wrap"
            >
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar notícias..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    {['todas', 'rascunho', 'pendente_aprovacao', 'publicada'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                ? 'bg-[#E30613] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'todas' ? 'Todas' : statusColors[status as NewsStatus]?.label || status}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* News Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Carregando notícias...</p>
                </div>
            ) : filteredNews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {search || filter !== 'todas' ? 'Nenhuma notícia encontrada.' : 'Nenhuma notícia cadastrada ainda.'}
                    </p>
                    {!search && filter === 'todas' && (
                        <button onClick={handleNew} className="mt-4 text-[#E30613] hover:underline">
                            Criar primeira notícia
                        </button>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Título</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Categoria</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredNews.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                        {item.excerpt && (
                                            <p className="text-sm text-gray-500 line-clamp-1">{item.excerpt}</p>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-600">{item.category || '-'}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]?.bg} ${statusColors[item.status]?.text}`}>
                                            {statusColors[item.status]?.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {item.status === 'rascunho' && (
                                                <button
                                                    onClick={() => handleStatusChange(item, 'pendente_aprovacao')}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Enviar para aprovação"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
                                            {item.status === 'publicada' && (
                                                <button
                                                    onClick={() => handleStatusChange(item, 'arquivada')}
                                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Arquivar"
                                                >
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Modal Criar/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingNews ? 'Editar Notícia' : 'Nova Notícia'}
                size="xl"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                    slug: generateSlug(e.target.value),
                                });
                            }}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            placeholder="Título da notícia"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="titulo-da-noticia"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                            >
                                <option value="">Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                            placeholder="Breve resumo para exibição em listagens..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                            placeholder="Conteúdo completo da notícia..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de Capa</label>
                        <ImageUploader
                            value={formData.cover_image_url}
                            onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                            folder="news"
                            aspectRatio="video"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsStatus })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                        >
                            <option value="rascunho">Rascunho</option>
                            <option value="pendente_aprovacao">Enviar para Aprovação</option>
                            <option value="publicada">Publicar Agora</option>
                        </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !formData.title.trim() || !formData.content.trim()}
                            className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Visualizar */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={viewingNews?.title || 'Notícia'}
                size="xl"
            >
                {viewingNews && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[viewingNews.status]?.bg} ${statusColors[viewingNews.status]?.text}`}>
                                {statusColors[viewingNews.status]?.label}
                            </span>
                            {viewingNews.category && (
                                <span className="text-sm text-gray-500">{viewingNews.category}</span>
                            )}
                            <span className="text-sm text-gray-500">
                                {new Date(viewingNews.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        {viewingNews.cover_image_url && (
                            <img
                                src={viewingNews.cover_image_url}
                                alt={viewingNews.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        )}

                        {viewingNews.excerpt && (
                            <p className="text-gray-600 italic border-l-4 border-[#E30613] pl-4">
                                {viewingNews.excerpt}
                            </p>
                        )}

                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap text-gray-700">{viewingNews.content}</p>
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    handleEdit(viewingNews);
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
                title="Excluir Notícia"
                message={`Tem certeza que deseja excluir "${deletingNews?.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={saving}
            />
        </div>
    );
}
