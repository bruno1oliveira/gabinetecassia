'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Phone, Mail, MapPin, Tag, Edit, Trash2, Eye, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Contact {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    neighborhood_id: number | null;
    neighborhood?: { name: string };
    is_supporter: boolean;
    tags: string[] | null;
    notes: string | null;
}

interface Neighborhood {
    id: number;
    name: string;
    zone: string;
}

const emptyContact = {
    name: '',
    phone: '',
    email: '',
    neighborhood_id: null as number | null,
    is_supporter: false,
    tags: [] as string[],
    notes: '',
};

export default function ContatosPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [viewingContact, setViewingContact] = useState<Contact | null>(null);
    const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState(emptyContact);
    const [saving, setSaving] = useState(false);
    const [newTag, setNewTag] = useState('');

    const supabase = createClient();

    // Carregar dados
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [contactsRes, neighborhoodsRes] = await Promise.all([
                supabase.from('contacts').select('*, neighborhood:neighborhoods(name)').order('name'),
                supabase.from('neighborhoods').select('*').order('name'),
            ]);

            if (contactsRes.data) setContacts(contactsRes.data);
            if (neighborhoodsRes.data) setNeighborhoods(neighborhoodsRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
        setLoading(false);
    };

    // Abrir modal para novo contato
    const handleNew = () => {
        setEditingContact(null);
        setFormData(emptyContact);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            phone: contact.phone || '',
            email: contact.email || '',
            neighborhood_id: contact.neighborhood_id,
            is_supporter: contact.is_supporter,
            tags: contact.tags || [],
            notes: contact.notes || '',
        });
        setIsModalOpen(true);
    };

    // Visualizar contato
    const handleView = (contact: Contact) => {
        setViewingContact(contact);
        setIsViewModalOpen(true);
    };

    // Abrir confirmação de exclusão
    const handleDeleteClick = (contact: Contact) => {
        setDeletingContact(contact);
        setIsDeleteDialogOpen(true);
    };

    // Salvar contato (criar ou editar)
    const handleSave = async () => {
        if (!formData.name.trim()) return;

        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone || null,
                email: formData.email || null,
                neighborhood_id: formData.neighborhood_id,
                is_supporter: formData.is_supporter,
                tags: formData.tags.length > 0 ? formData.tags : null,
                notes: formData.notes || null,
            };

            if (editingContact) {
                await supabase.from('contacts').update(payload).eq('id', editingContact.id);
            } else {
                await supabase.from('contacts').insert(payload);
            }

            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    // Excluir contato
    const handleDelete = async () => {
        if (!deletingContact) return;

        setSaving(true);
        try {
            await supabase.from('contacts').delete().eq('id', deletingContact.id);
            setIsDeleteDialogOpen(false);
            setDeletingContact(null);
            loadData();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
        setSaving(false);
    };

    // Adicionar tag
    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
            setNewTag('');
        }
    };

    // Remover tag
    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    // Filtrar contatos
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
                    <p className="text-gray-600 mt-1">
                        {contacts.length} contatos cadastrados
                    </p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Contato
                </button>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-4"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome, email ou telefone..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                    />
                </div>
            </motion.div>

            {/* Contacts Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Carregando contatos...</p>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <p className="text-gray-500">
                        {search ? 'Nenhum contato encontrado.' : 'Nenhum contato cadastrado ainda.'}
                    </p>
                    {!search && (
                        <button
                            onClick={handleNew}
                            className="mt-4 text-[#E30613] hover:underline"
                        >
                            Adicionar primeiro contato
                        </button>
                    )}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredContacts.map((contact, index) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                        {contact.is_supporter && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Apoiador
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleView(contact)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(contact)}
                                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(contact)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                {contact.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {contact.phone}
                                    </div>
                                )}
                                {contact.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {contact.email}
                                    </div>
                                )}
                                {contact.neighborhood?.name && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {contact.neighborhood.name}
                                    </div>
                                )}
                            </div>

                            {contact.tags && contact.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {contact.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Modal Criar/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingContact ? 'Editar Contato' : 'Novo Contato'}
                size="lg"
            >
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="Nome completo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="(12) 99999-9999"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="email@exemplo.com"
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
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_supporter}
                                onChange={(e) => setFormData({ ...formData, is_supporter: e.target.checked })}
                                className="w-4 h-4 text-[#E30613] rounded focus:ring-[#E30613]"
                            />
                            <span className="text-sm font-medium text-gray-700">Apoiador(a)</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                                placeholder="Digite e pressione Enter"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Adicionar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 text-sm bg-[#E30613]/10 text-[#E30613] px-3 py-1 rounded-full"
                                >
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-800">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none resize-none"
                            placeholder="Anotações sobre o contato..."
                        />
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
                            disabled={saving || !formData.name.trim()}
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
                title="Detalhes do Contato"
            >
                {viewingContact && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-2xl">
                                {viewingContact.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{viewingContact.name}</h3>
                                {viewingContact.is_supporter && (
                                    <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        Apoiador
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                            {viewingContact.phone && (
                                <div>
                                    <p className="text-sm text-gray-500">Telefone</p>
                                    <p className="font-medium">{viewingContact.phone}</p>
                                </div>
                            )}
                            {viewingContact.email && (
                                <div>
                                    <p className="text-sm text-gray-500">E-mail</p>
                                    <p className="font-medium">{viewingContact.email}</p>
                                </div>
                            )}
                            {viewingContact.neighborhood?.name && (
                                <div>
                                    <p className="text-sm text-gray-500">Bairro</p>
                                    <p className="font-medium">{viewingContact.neighborhood.name}</p>
                                </div>
                            )}
                        </div>

                        {viewingContact.tags && viewingContact.tags.length > 0 && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-2">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {viewingContact.tags.map((tag) => (
                                        <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewingContact.notes && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500 mb-2">Observações</p>
                                <p className="text-gray-700">{viewingContact.notes}</p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    handleEdit(viewingContact);
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
                title="Excluir Contato"
                message={`Tem certeza que deseja excluir "${deletingContact?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={saving}
            />
        </div>
    );
}
