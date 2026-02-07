'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, Shield, User, Users, Mail, Phone, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { UserRole } from '@/types/database';

interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    phone: string | null;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
}

const roleConfig: Record<UserRole, { icon: React.ElementType; label: string; color: string }> = {
    master_admin: { icon: Shield, label: 'Administrador', color: 'text-red-600 bg-red-100' },
    vereadora: { icon: User, label: 'Vereadora', color: 'text-purple-600 bg-purple-100' },
    assessor: { icon: Users, label: 'Assessor', color: 'text-teal-600 bg-teal-100' },
};

const emptyUser = {
    full_name: '',
    email: '',
    phone: '',
    role: 'assessor' as UserRole,
    is_active: true,
};

export default function UsuariosPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Profile | null>(null);
    const [deletingUser, setDeletingUser] = useState<Profile | null>(null);
    const [formData, setFormData] = useState(emptyUser);
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name');

            if (data) setUsers(data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
        setLoading(false);
    };

    const handleNew = () => {
        setEditingUser(null);
        setFormData(emptyUser);
        setIsModalOpen(true);
    };

    const handleEdit = (user: Profile) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            is_active: user.is_active,
        });
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: Profile) => {
        setDeletingUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.full_name.trim() || !formData.email.trim()) return;

        setSaving(true);
        try {
            if (editingUser) {
                // Atualizar perfil existente
                const payload = {
                    full_name: formData.full_name,
                    phone: formData.phone || null,
                    role: formData.role,
                    is_active: formData.is_active,
                };

                await supabase.from('profiles').update(payload).eq('id', editingUser.id);
            } else {
                // Para criar novo usuário, precisaria usar o Admin SDK do Supabase
                // Por enquanto, mostramos uma mensagem
                alert('Para criar novos usuários, utilize o painel do Supabase (Authentication > Users) e o perfil será criado automaticamente.');
                setIsModalOpen(false);
                setSaving(false);
                return;
            }

            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Erro ao salvar:', error);
        }
        setSaving(false);
    };

    const handleToggleActive = async (user: Profile) => {
        try {
            await supabase.from('profiles').update({ is_active: !user.is_active }).eq('id', user.id);
            loadData();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    const handleDelete = async () => {
        if (!deletingUser) return;

        // Nota: Excluir o perfil não exclui o usuário do Auth
        // Idealmente isso deveria desativar o usuário
        setSaving(true);
        try {
            await supabase.from('profiles').update({ is_active: false }).eq('id', deletingUser.id);
            setIsDeleteDialogOpen(false);
            setDeletingUser(null);
            loadData();
        } catch (error) {
            console.error('Erro ao desativar:', error);
        }
        setSaving(false);
    };

    // Filtrar usuários
    const filteredUsers = users.filter((u) =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                    <p className="text-gray-600 mt-1">{users.length} usuários cadastrados</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Usuário
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
                        placeholder="Buscar por nome ou e-mail..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                    />
                </div>
            </motion.div>

            {/* Users Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-500 mt-4">Carregando usuários...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum usuário encontrado.</p>
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Usuário</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Contato</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Função</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredUsers.map((user) => {
                                const config = roleConfig[user.role];
                                const Icon = config.icon;

                                return (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.full_name.charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.full_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                                                <Icon className="w-3 h-3" />
                                                {config.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleToggleActive(user)}
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${user.is_active
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                {user.is_active ? (
                                                    <>
                                                        <ToggleRight className="w-4 h-4" />
                                                        Ativo
                                                    </>
                                                ) : (
                                                    <>
                                                        <ToggleLeft className="w-4 h-4" />
                                                        Inativo
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Desativar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </motion.div>
            )}

            {/* Modal Criar/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                size="md"
            >
                <div className="space-y-4">
                    {!editingUser && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                            <p className="font-medium mb-1">⚠️ Atenção</p>
                            <p>Para criar novos usuários, utilize o painel do Supabase:</p>
                            <ol className="list-decimal ml-4 mt-2 space-y-1">
                                <li>Acesse o Supabase Dashboard</li>
                                <li>Vá em Authentication → Users</li>
                                <li>Clique em "Add User"</li>
                                <li>O perfil será criado automaticamente</li>
                            </ol>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            disabled={!editingUser}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none disabled:bg-gray-100"
                            placeholder="Nome completo"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!!editingUser}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none disabled:bg-gray-100"
                            placeholder="email@exemplo.com"
                        />
                        {editingUser && (
                            <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editingUser}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none disabled:bg-gray-100"
                            placeholder="(12) 99999-9999"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            disabled={!editingUser}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none disabled:bg-gray-100"
                        >
                            <option value="assessor">Assessor</option>
                            <option value="vereadora">Vereadora</option>
                            <option value="master_admin">Administrador</option>
                        </select>
                    </div>

                    {editingUser && (
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-[#E30613] rounded focus:ring-[#E30613]"
                                />
                                <span className="text-sm font-medium text-gray-700">Usuário ativo</span>
                            </label>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        {editingUser && (
                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.full_name.trim()}
                                className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#B91C1C] transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : 'Salvar'}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Dialog Confirmar Desativação */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Desativar Usuário"
                message={`Tem certeza que deseja desativar "${deletingUser?.full_name}"? O usuário não poderá mais acessar o sistema.`}
                confirmText="Desativar"
                variant="warning"
                isLoading={saving}
            />
        </div>
    );
}
