-- =============================================
-- GABINETE DIGITAL - MIGRATION MULTI-TENANT
-- Execute no SQL Editor do Supabase APÓS a 001
-- =============================================

-- =============================================
-- 1. ADICIONAR ROLE PLATFORM_ADMIN
-- =============================================
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'platform_admin';

-- =============================================
-- 2. TABELA DE TENANTS (GABINETES)
-- =============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificação
    name TEXT NOT NULL,                      -- "Vereadora Cássia"
    slug TEXT UNIQUE NOT NULL,               -- "cassia" (usado em URLs)
    
    -- Localização
    city TEXT NOT NULL,                      -- "Caraguatatuba"
    state TEXT NOT NULL DEFAULT 'SP',        -- "SP"
    
    -- Visual/Branding
    primary_color TEXT DEFAULT '#E30613',    -- Cor principal do partido
    secondary_color TEXT DEFAULT '#FBBF24',  -- Cor secundária
    logo_url TEXT,                           -- URL do logo
    photo_url TEXT,                          -- Foto do vereador(a)
    favicon_url TEXT,                        -- Favicon personalizado
    
    -- Contato
    whatsapp TEXT,
    email TEXT,
    phone TEXT,
    instagram TEXT,
    facebook TEXT,
    youtube TEXT,
    website TEXT,
    
    -- Endereço do Gabinete
    address TEXT,
    address_complement TEXT,
    
    -- Domínios
    custom_domain TEXT UNIQUE,               -- "cassia.com.br" (opcional)
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    plan TEXT DEFAULT 'basic',               -- 'basic', 'premium', 'enterprise'
    max_users INTEGER DEFAULT 5,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_custom_domain ON tenants(custom_domain);
CREATE INDEX idx_tenants_is_active ON tenants(is_active);

-- Trigger para updated_at
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 3. ADICIONAR TENANT_ID EM TODAS AS TABELAS
-- =============================================

-- Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON profiles(tenant_id);

-- Neighborhoods (bairros são por cidade/tenant)
ALTER TABLE neighborhoods ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_tenant ON neighborhoods(tenant_id);

-- Demands
ALTER TABLE demands ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_demands_tenant ON demands(tenant_id);

-- Contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON contacts(tenant_id);

-- News
ALTER TABLE news ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_news_tenant ON news(tenant_id);

-- Activity Log
ALTER TABLE activity_log ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
CREATE INDEX IF NOT EXISTS idx_activity_log_tenant ON activity_log(tenant_id);

-- =============================================
-- 4. ATUALIZAR RLS POLICIES
-- =============================================

-- Função helper para verificar se é platform_admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'platform_admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função helper para pegar tenant_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
    SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- =============================================
-- TENANTS POLICIES
-- =============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Platform admin pode ver e editar todos os tenants
CREATE POLICY "tenants_platform_admin" ON tenants
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários podem ver seu próprio tenant
CREATE POLICY "tenants_own_select" ON tenants
    FOR SELECT TO authenticated
    USING (id = public.get_user_tenant_id());

-- =============================================
-- PROFILES POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;

-- Platform admin pode ver todos
CREATE POLICY "profiles_platform_admin" ON profiles
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários do mesmo tenant podem se ver
CREATE POLICY "profiles_tenant_select" ON profiles
    FOR SELECT TO authenticated
    USING (tenant_id = public.get_user_tenant_id());

-- Usuário pode editar próprio perfil
CREATE POLICY "profiles_own_update" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

-- =============================================
-- NEIGHBORHOODS POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "neighborhoods_select" ON neighborhoods;

-- Platform admin pode tudo
CREATE POLICY "neighborhoods_platform_admin" ON neighborhoods
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários veem bairros do seu tenant
CREATE POLICY "neighborhoods_tenant_select" ON neighborhoods
    FOR SELECT TO authenticated
    USING (tenant_id = public.get_user_tenant_id());

-- Anônimo pode ver bairros (para formulário público)
CREATE POLICY "neighborhoods_anon_select" ON neighborhoods
    FOR SELECT TO anon
    USING (true);

-- =============================================
-- DEMANDS POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "demands_select" ON demands;
DROP POLICY IF EXISTS "demands_insert_auth" ON demands;
DROP POLICY IF EXISTS "demands_insert_anon" ON demands;
DROP POLICY IF EXISTS "demands_update" ON demands;

-- Platform admin pode tudo
CREATE POLICY "demands_platform_admin" ON demands
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários do tenant podem ver e editar demandas do tenant
CREATE POLICY "demands_tenant_all" ON demands
    FOR ALL TO authenticated
    USING (tenant_id = public.get_user_tenant_id())
    WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Anônimo pode inserir demandas (formulário público)
-- tenant_id será definido pela aplicação baseado no domínio
CREATE POLICY "demands_anon_insert" ON demands
    FOR INSERT TO anon
    WITH CHECK (true);

-- =============================================
-- CONTACTS POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "contacts_select" ON contacts;
DROP POLICY IF EXISTS "contacts_all" ON contacts;

-- Platform admin pode tudo
CREATE POLICY "contacts_platform_admin" ON contacts
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários do tenant podem gerenciar contatos do tenant
CREATE POLICY "contacts_tenant_all" ON contacts
    FOR ALL TO authenticated
    USING (tenant_id = public.get_user_tenant_id())
    WITH CHECK (tenant_id = public.get_user_tenant_id());

-- =============================================
-- NEWS POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "news_select_public" ON news;
DROP POLICY IF EXISTS "news_select_auth" ON news;
DROP POLICY IF EXISTS "news_all" ON news;

-- Platform admin pode tudo
CREATE POLICY "news_platform_admin" ON news
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários do tenant podem gerenciar notícias do tenant
CREATE POLICY "news_tenant_all" ON news
    FOR ALL TO authenticated
    USING (tenant_id = public.get_user_tenant_id())
    WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Anônimo pode ver notícias publicadas
CREATE POLICY "news_anon_select" ON news
    FOR SELECT TO anon
    USING (status = 'publicada');

-- =============================================
-- ACTIVITY_LOG POLICIES (Atualizar)
-- =============================================
DROP POLICY IF EXISTS "activity_log_select" ON activity_log;
DROP POLICY IF EXISTS "activity_log_insert" ON activity_log;

-- Platform admin pode ver todos os logs
CREATE POLICY "activity_log_platform_admin" ON activity_log
    FOR ALL TO authenticated
    USING (public.is_platform_admin())
    WITH CHECK (public.is_platform_admin());

-- Usuários do tenant podem ver logs do tenant
CREATE POLICY "activity_log_tenant_select" ON activity_log
    FOR SELECT TO authenticated
    USING (tenant_id = public.get_user_tenant_id());

-- Usuários autenticados podem inserir logs
CREATE POLICY "activity_log_insert_auth" ON activity_log
    FOR INSERT TO authenticated
    WITH CHECK (tenant_id = public.get_user_tenant_id());

-- =============================================
-- 5. CRIAR TENANT INICIAL (CÁSSIA)
-- =============================================
INSERT INTO tenants (
    name, 
    slug, 
    city, 
    state, 
    primary_color, 
    secondary_color,
    whatsapp
) VALUES (
    'Vereadora Cássia',
    'cassia',
    'Caraguatatuba',
    'SP',
    '#E30613',
    '#FBBF24',
    '5512999999999'
) ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 6. MIGRAR DADOS EXISTENTES PARA O TENANT CÁSSIA
-- =============================================
DO $$
DECLARE
    cassia_tenant_id UUID;
BEGIN
    -- Pegar o ID do tenant Cássia
    SELECT id INTO cassia_tenant_id FROM tenants WHERE slug = 'cassia';
    
    -- Atualizar profiles sem tenant_id
    UPDATE profiles SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
    
    -- Atualizar neighborhoods sem tenant_id
    UPDATE neighborhoods SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
    
    -- Atualizar demands sem tenant_id
    UPDATE demands SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
    
    -- Atualizar contacts sem tenant_id
    UPDATE contacts SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
    
    -- Atualizar news sem tenant_id
    UPDATE news SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
    
    -- Atualizar activity_log sem tenant_id
    UPDATE activity_log SET tenant_id = cassia_tenant_id WHERE tenant_id IS NULL;
END $$;

-- =============================================
-- PRONTO! Para criar um platform_admin:
-- UPDATE profiles SET role = 'platform_admin' WHERE email = 'seu@email.com';
-- =============================================
