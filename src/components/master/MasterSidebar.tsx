'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Building2,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    BarChart3,
    Globe,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    {
        name: 'Dashboard',
        href: '/master',
        icon: LayoutDashboard,
    },
    {
        name: 'Gabinetes',
        href: '/master/tenants',
        icon: Building2,
    },
    {
        name: 'Usuários',
        href: '/master/users',
        icon: Users,
    },
    {
        name: 'Domínios',
        href: '/master/domains',
        icon: Globe,
    },
    {
        name: 'Relatórios',
        href: '/master/reports',
        icon: BarChart3,
    },
    {
        name: 'Assinaturas',
        href: '/master/billing',
        icon: CreditCard,
    },
    {
        name: 'Configurações',
        href: '/master/settings',
        icon: Settings,
    },
];

interface MasterSidebarProps {
    userName: string;
    userAvatar?: string;
}

export default function MasterSidebar({ userName, userAvatar }: MasterSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-slate-950 text-white flex flex-col fixed left-0 top-0 z-50"
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">GD</span>
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h1 className="font-bold text-lg">Gabinete Digital</h1>
                        <p className="text-xs text-slate-400">Painel Master</p>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/master' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
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
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                                <p className="text-xs text-slate-400">Platform Admin</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-all
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
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
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
