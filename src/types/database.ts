// ================================================
// TIPOS DO BANCO DE DADOS - GABINETE DIGITAL
// ================================================

export type UserRole = 'platform_admin' | 'master_admin' | 'vereadora' | 'assessor';

export type DemandStatus = 'nova' | 'em_analise' | 'encaminhada_prefeitura' | 'resolvida' | 'arquivada';

export type DemandType =
    | 'iluminacao'
    | 'buraco'
    | 'assistencia'
    | 'saude'
    | 'educacao'
    | 'transporte'
    | 'moradia'
    | 'outros';

export type TenantPlan = 'basic' | 'premium' | 'enterprise';

// ================================================
// TENANT (GABINETE)
// ================================================

export interface Tenant {
    id: string;
    name: string;
    slug: string;

    // Localização
    city: string;
    state: string;

    // Visual/Branding
    primary_color: string;
    secondary_color: string;
    logo_url: string | null;
    photo_url: string | null;
    favicon_url: string | null;

    // Contato
    whatsapp: string | null;
    email: string | null;
    phone: string | null;
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    website: string | null;

    // Endereço
    address: string | null;
    address_complement: string | null;

    // Domínios
    custom_domain: string | null;

    // Configurações
    is_active: boolean;
    plan: TenantPlan;
    max_users: number;

    // Metadados
    created_at: string;
    updated_at: string;
}

// ================================================
// TABELAS

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    tenant_id: string | null;
    avatar_url: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Joined data
    tenant?: Tenant;
}

export interface Neighborhood {
    id: number;
    name: string;
    zone: string | null;
    population_estimate: number | null;
    tenant_id: string | null;
    created_at: string;
}

export interface Demand {
    id: string;
    citizen_name: string;
    citizen_phone: string | null;
    citizen_email: string | null;
    neighborhood_id: number | null;
    address_detail: string | null;
    demand_type: DemandType;
    description: string;
    photo_url: string | null;
    status: DemandStatus;
    assigned_to: string | null;
    priority: number;
    resolution_notes: string | null;
    resolved_at: string | null;
    tenant_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined data
    neighborhood?: Neighborhood;
    assigned_profile?: Profile;
}

export interface News {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string;
    cover_image_url: string | null;
    category: string | null;
    published: boolean;
    featured: boolean;
    author_id: string | null;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    tenant_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined data
    author?: Profile;
}

export interface Contact {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    neighborhood_id: number | null;
    interests: string[];
    tags: string[];
    source: string | null;
    notes: string | null;
    tenant_id: string | null;
    created_at: string;
    updated_at: string;
    // Joined data
    neighborhood?: Neighborhood;
}

export interface SystemLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    details: Record<string, unknown> | null;
    ip_address: string | null;
    tenant_id: string | null;
    created_at: string;
    // Joined data
    user?: Profile;
}

// ================================================
// VIEWS
// ================================================

export interface DemandStatsByNeighborhood {
    neighborhood_id: number;
    neighborhood_name: string;
    zone: string | null;
    total_demands: number;
    new_demands: number;
    in_analysis: number;
    sent_to_mayor: number;
    resolved: number;
}

export interface DashboardStats {
    total_demands: number;
    resolved_demands: number;
    total_contacts: number;
    published_news: number;
    demands_last_30_days: number;
}

// ================================================
// FORM TYPES
// ================================================

export interface CreateDemandInput {
    citizen_name: string;
    citizen_phone?: string;
    citizen_email?: string;
    neighborhood_id?: number;
    address_detail?: string;
    demand_type: DemandType;
    description: string;
    photo_url?: string;
}

export interface UpdateDemandInput {
    status?: DemandStatus;
    assigned_to?: string;
    priority?: number;
    resolution_notes?: string;
    resolved_at?: string;
}

export interface CreateNewsInput {
    title: string;
    slug: string;
    summary?: string;
    content: string;
    cover_image_url?: string;
    category?: string;
    published?: boolean;
    featured?: boolean;
    meta_title?: string;
    meta_description?: string;
}

export interface CreateContactInput {
    name: string;
    email?: string;
    phone?: string;
    neighborhood_id?: number;
    interests?: string[];
    tags?: string[];
    source?: string;
    notes?: string;
}
