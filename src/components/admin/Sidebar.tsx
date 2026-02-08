'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Newspaper,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Shield,
    FileBarChart,
    UserCog,
    ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { UserRole, Tenant } from '@/types/database';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        roles: ['master_admin', 'vereadora', 'assessor'],
    },
    {
        name: 'Demandas',
        href: '/admin/demandas',
        icon: ClipboardList,
        roles: ['master_admin', 'vereadora', 'assessor'],
    },
    {
        name: 'Contatos',
        href: '/admin/contatos',
        icon: Users,
        roles: ['master_admin', 'vereadora', 'assessor'],
    },
    {
        name: 'Notícias',
        href: '/admin/noticias',
        icon: Newspaper,
        roles: ['master_admin', 'vereadora', 'assessor'],
    },
    {
        name: 'Aprovações',
        href: '/admin/aprovacoes',
        icon: Shield,
        roles: ['master_admin', 'vereadora'],
    },
    {
        name: 'Relatórios',
        href: '/admin/relatorios',
        icon: FileBarChart,
        roles: ['master_admin', 'vereadora'],
    },
    {
        name: 'Usuários',
        href: '/admin/usuarios',
        icon: UserCog,
        roles: ['master_admin'],
    },
    {
        name: 'Configurações',
        href: '/admin/configuracoes',
        icon: Settings,
        roles: ['master_admin'],
    },
];

interface SidebarProps {
    userRole: UserRole;
    userName: string;
    userAvatar?: string;
    tenant?: Tenant | null;
}

export default function Sidebar({ userRole, userName, userAvatar, tenant }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const filteredNavItems = navItems.filter((item) =>
        item.roles.includes(userRole)
    );

    const getRoleLabel = (role: UserRole) => {
        switch (role) {
            case 'master_admin':
                return 'Administrador';
            case 'vereadora':
                return 'Vereadora';
            case 'assessor':
                return 'Assessor(a)';
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'platform_admin':
                return 'bg-purple-500';
            case 'master_admin':
                return 'bg-red-500';
            case 'vereadora':
                return 'bg-purple-500';
            case 'assessor':
                return 'bg-teal-500';
        }
    };

    // Cores do tenant ou padrão
    const primaryColor = tenant?.primary_color || '#E30613';
    const tenantName = tenant?.name || 'Gabinete Digital';
    const tenantInitial = tenantName.charAt(0).toUpperCase();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-50"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                {tenant?.logo_url ? (
                    <img
                        src={tenant.logo_url}
                        alt={tenantName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                    >
                        <span className="text-white font-bold">{tenantInitial}</span>
                    </div>
                )}
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <h1 className="font-bold text-lg truncate">{tenantName}</h1>
                        <p className="text-xs text-gray-400">Painel Administrativo</p>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-[#E30613] text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-white font-medium">
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="font-medium text-sm truncate">{userName}</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${getRoleColor(userRole)}`} />
                                <p className="text-xs text-gray-400">{getRoleLabel(userRole)}</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        text-gray-400 hover:bg-red-900 hover:text-white transition-all
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Sair</span>}
                </button>
            </div>

            {/* Collapse Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </motion.aside>
    );
}
