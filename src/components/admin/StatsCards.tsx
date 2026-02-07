'use client';

import { motion } from 'framer-motion';
import {
    ClipboardList,
    CheckCircle2,
    Clock,
    Send,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'red' | 'green' | 'blue' | 'amber';
}

const colorClasses = {
    red: {
        bg: 'bg-red-50',
        icon: 'bg-red-100 text-pt-red',
        text: 'text-pt-red',
    },
    green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
    },
    blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
    },
    amber: {
        bg: 'bg-amber-50',
        icon: 'bg-amber-100 text-amber-600',
        text: 'text-amber-600',
    },
};

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${colors.bg} rounded-xl p-6`}
        >
            <div className="flex items-start justify-between">
                <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? (
                            <ArrowUpRight className="w-4 h-4" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
            </div>
        </motion.div>
    );
}

interface StatsCardsProps {
    stats: {
        totalDemands: number;
        resolvedDemands: number;
        pendingDemands: number;
        totalContacts: number;
    };
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards: StatCardProps[] = [
        {
            title: 'Total de Demandas',
            value: stats.totalDemands,
            icon: ClipboardList,
            color: 'blue',
            trend: { value: 12, isPositive: true },
        },
        {
            title: 'Demandas Resolvidas',
            value: stats.resolvedDemands,
            icon: CheckCircle2,
            color: 'green',
            trend: { value: 8, isPositive: true },
        },
        {
            title: 'Demandas Pendentes',
            value: stats.pendingDemands,
            icon: Clock,
            color: 'amber',
            trend: { value: 3, isPositive: false },
        },
        {
            title: 'Contatos no CRM',
            value: stats.totalContacts,
            icon: Users,
            color: 'red',
            trend: { value: 15, isPositive: true },
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <StatCard {...card} />
                </motion.div>
            ))}
        </div>
    );
}
