'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Tenant } from '@/types/database';

interface TenantContextType {
    tenant: Tenant | null;
    isPlatformAdmin: boolean;
}

const TenantContext = createContext<TenantContextType>({
    tenant: null,
    isPlatformAdmin: false,
});

interface TenantProviderProps {
    children: ReactNode;
    tenant: Tenant | null;
    isPlatformAdmin?: boolean;
}

export function TenantProvider({
    children,
    tenant,
    isPlatformAdmin = false
}: TenantProviderProps) {
    return (
        <TenantContext.Provider value={{ tenant, isPlatformAdmin }}>
            {children}
        </TenantContext.Provider>
    );
}

export function useTenant() {
    const context = useContext(TenantContext);

    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }

    return context;
}

// Hook para pegar cores do tenant com fallback
export function useTenantColors() {
    const { tenant } = useTenant();

    return {
        primary: tenant?.primary_color || '#E30613',
        secondary: tenant?.secondary_color || '#FBBF24',
        primaryDark: tenant?.primary_color
            ? darkenColor(tenant.primary_color, 20)
            : '#B91C1C',
    };
}

// Função helper para escurecer cor
function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}
