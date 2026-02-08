'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Users,
    Plus,
    MoreVertical,
    Trash2,
    Shield,
    Mail,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Profile, Tenant, UserRole } from '@/types/database';
import Modal from '@/components/ui/Modal';

export default function TenantUsersPage() {
    const params = useParams();
    const tenantId = params.id as string;

    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [users, setUsers] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole>('assessor');

    useEffect(() => {
        fetchData();
    }, [tenantId]);

    const fetchData = async () => {
        const supabase = createClient();

        const [tenantRes, usersRes] = await Promise.all([
            supabase.from('tenants').select('*').eq('id', tenantId).single(),
            supabase.from('profiles').select('*').eq('tenant_id', tenantId).order('full_name'),
        ]);

        setTenant(tenantRes.data as Tenant);
        setUsers((usersRes.data as Profile[]) || []);
        setIsLoading(false);
    };

    const updateUserRole = async (userId: string, role: UserRole) => {
        const supabase = createClient();
        await supabase.from('profiles').update({ role }).eq('id', userId);
        fetchData();
        setActiveMenu(null);
    };

    const removeUser = async (userId: string) => {
        if (!confirm('Tem certeza que deseja remover este usuário do gabinete?')) return;

        const supabase = createClient();
        await supabase.from('profiles').update({ tenant_id: null }).eq('id', userId);
        fetchData();
        setActiveMenu(null);
    };

    const inviteUser = async () => {
        // Note: In production, this would send an invitation email
        // For now, we just show a message about how to add users
        alert(`Para adicionar o usuário ${newUserEmail}:\n\n1. O usuário precisa se cadastrar na plataforma\n2. Após o cadastro, atualize o tenant_id dele no banco de dados\n\nEm produção, isso seria feito automaticamente via convite por email.`);
        setIsModalOpen(false);
        setNewUserEmail('');
        setNewUserName('');
    };

    const getRoleLabel = (role: UserRole) => {
        switch (role) {
            case 'platform_admin': return 'Platform Admin';
            case 'master_admin': return 'Administrador';
            case 'vereadora': return 'Vereador(a)';
            case 'assessor': return 'Assessor(a)';
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'platform_admin': return 'bg-purple-500/20 text-purple-400';
            case 'master_admin': return 'bg-red-500/20 text-red-400';
            case 'vereadora': return 'bg-indigo-500/20 text-indigo-400';
            case 'assessor': return 'bg-slate-500/20 text-slate-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/master/tenants/${tenantId}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white">Usuários</h1>
                    <p className="text-slate-400 mt-1">{tenant?.name}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    Convidar Usuário
                </button>
            </div>

            {/* Users List */}
            {users.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-xl">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhum usuário cadastrado</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-slate-700 text-sm font-medium text-slate-400">
                        <span>Usuário</span>
                        <span>Email</span>
                        <span>Função</span>
                        <span></span>
                    </div>

                    {users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="grid grid-cols-[1fr,auto,auto,auto] gap-4 p-4 border-b border-slate-700/50 items-center hover:bg-slate-700/30"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                                    {user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{user.full_name}</p>
                                    <p className="text-sm text-slate-400">
                                        {user.is_active ? 'Ativo' : 'Inativo'}
                                    </p>
                                </div>
                            </div>

                            <span className="text-sm text-slate-300">{user.email}</span>

                            <span className={`px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                                {getRoleLabel(user.role)}
                            </span>

                            <div className="relative">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {activeMenu === user.id && (
                                    <div className="absolute right-0 top-8 w-48 bg-slate-700 rounded-lg shadow-xl z-10 overflow-hidden">
                                        <div className="p-2 border-b border-slate-600">
                                            <p className="text-xs text-slate-400 mb-2">Alterar função:</p>
                                            {(['master_admin', 'vereadora', 'assessor'] as UserRole[]).map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => updateUserRole(user.id, role)}
                                                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded ${user.role === role
                                                            ? 'bg-indigo-500/20 text-indigo-300'
                                                            : 'text-slate-200 hover:bg-slate-600'
                                                        }`}
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    {getRoleLabel(role)}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => removeUser(user.id)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 w-full text-left"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remover do gabinete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Convidar Usuário"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            placeholder="Nome completo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Função
                        </label>
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="assessor">Assessor(a)</option>
                            <option value="vereadora">Vereador(a)</option>
                            <option value="master_admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={inviteUser}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Mail className="w-4 h-4" />
                            Enviar Convite
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
