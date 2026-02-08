import { createClient } from '@/lib/supabase/server';
import type { Tenant } from '@/types/database';

/**
 * Busca o tenant baseado no host (domínio ou subdomínio)
 */
export async function getTenantFromHost(host: string): Promise<Tenant | null> {
    const supabase = await createClient();

    // Remove porta se existir (para desenvolvimento local)
    const cleanHost = host.split(':')[0];

    // Verifica se é um domínio customizado primeiro
    const { data: tenantByDomain } = await supabase
        .from('tenants')
        .select('*')
        .eq('custom_domain', cleanHost)
        .eq('is_active', true)
        .single();

    if (tenantByDomain) {
        return tenantByDomain as Tenant;
    }

    // Se não encontrou, tenta buscar pelo subdomínio
    // Ex: cassia.gabinete.digital -> slug = "cassia"
    const subdomain = cleanHost.split('.')[0];

    // Ignora subdomínios comuns
    if (['www', 'app', 'admin', 'api', 'localhost'].includes(subdomain)) {
        return null;
    }

    const { data: tenantBySlug } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', subdomain)
        .eq('is_active', true)
        .single();

    return tenantBySlug as Tenant | null;
}

/**
 * Busca tenant por slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    return data as Tenant | null;
}

/**
 * Busca tenant por ID
 */
export async function getTenantById(id: string): Promise<Tenant | null> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

    return data as Tenant | null;
}

/**
 * Busca todos os tenants (apenas para platform_admin)
 */
export async function getAllTenants(): Promise<Tenant[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('tenants')
        .select('*')
        .order('name');

    return (data as Tenant[]) || [];
}

/**
 * Gera as CSS variables baseadas nas cores do tenant
 */
export function getTenantCSSVariables(tenant: Tenant): string {
    const primaryColor = tenant.primary_color || '#E30613';
    const secondaryColor = tenant.secondary_color || '#FBBF24';

    // Função para escurecer cor
    const darken = (hex: string, percent: number): string => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    };

    // Função para clarear cor
    const lighten = (hex: string, percent: number): string => {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    };

    // Converte hex para RGB
    const hexToRgb = (hex: string): string => {
        const num = parseInt(hex.replace('#', ''), 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    return `
        :root {
            --primary-color: ${primaryColor};
            --primary-color-dark: ${darken(primaryColor, 20)};
            --primary-color-light: ${lighten(primaryColor, 20)};
            --primary-color-rgb: ${hexToRgb(primaryColor)};
            
            --secondary-color: ${secondaryColor};
            --secondary-color-dark: ${darken(secondaryColor, 20)};
            --secondary-color-light: ${lighten(secondaryColor, 20)};
            --secondary-color-rgb: ${hexToRgb(secondaryColor)};
        }
    `;
}

/**
 * Retorna o tenant padrão para desenvolvimento
 */
export function getDefaultTenantSlug(): string {
    return process.env.DEFAULT_TENANT_SLUG || 'cassia';
}
