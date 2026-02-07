-- =============================================
-- GABINETE VEREADORA CÁSSIA - SCHEMA COMPLETO
-- Execute no SQL Editor do Supabase
-- =============================================

-- LIMPAR OBJETOS EXISTENTES
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS demands CASCADE;
DROP TABLE IF EXISTS neighborhoods CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS news_status CASCADE;
DROP TYPE IF EXISTS demand_type CASCADE;
DROP TYPE IF EXISTS demand_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

-- =============================================
-- CRIAR ESTRUTURA
-- =============================================

-- 1. ENUM DE ROLES
CREATE TYPE user_role AS ENUM ('master_admin', 'vereadora', 'assessor');

-- 2. TABELA DE PERFIS
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'assessor',
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário'),
        'assessor'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. TABELA DE BAIRROS
CREATE TABLE neighborhoods (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    zone TEXT,
    population INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO neighborhoods (name, zone) VALUES
    ('Centro', 'Centro'),
    ('Indaiá', 'Litoral Sul'),
    ('Martim de Sá', 'Litoral Sul'),
    ('Massaguaçu', 'Litoral Norte'),
    ('Tabatinga', 'Litoral Norte'),
    ('Sumaré', 'Centro'),
    ('Porto Novo', 'Litoral Sul'),
    ('Jardim Primavera', 'Centro'),
    ('Tinga', 'Serra'),
    ('Travessão', 'Serra'),
    ('Caputera', 'Serra'),
    ('Casa Branca', 'Litoral Sul'),
    ('Jaraguazinho', 'Centro'),
    ('Morro do Algodão', 'Litoral Norte'),
    ('Pegorelli', 'Centro'),
    ('Perequê-Mirim', 'Litoral Sul'),
    ('Rio do Ouro', 'Serra'),
    ('Poiares', 'Litoral Sul'),
    ('Prainha', 'Centro'),
    ('Pan Brasil', 'Litoral Norte');

-- 4. TABELA DE DEMANDAS
CREATE TYPE demand_status AS ENUM ('nova', 'em_analise', 'encaminhada_prefeitura', 'resolvida', 'arquivada');
CREATE TYPE demand_type AS ENUM ('iluminacao', 'buraco', 'assistencia', 'saude', 'educacao', 'transporte', 'moradia', 'outros');

CREATE TABLE demands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_name TEXT NOT NULL,
    citizen_phone TEXT NOT NULL,
    citizen_email TEXT,
    neighborhood_id INTEGER REFERENCES neighborhoods(id),
    address TEXT,
    type demand_type NOT NULL,
    title TEXT,
    description TEXT NOT NULL,
    photo_url TEXT,
    status demand_status DEFAULT 'nova',
    priority INTEGER DEFAULT 3,
    assigned_to UUID REFERENCES profiles(id),
    sent_to_mayor_at TIMESTAMPTZ,
    mayor_protocol TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE CONTATOS
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    neighborhood_id INTEGER REFERENCES neighborhoods(id),
    is_supporter BOOLEAN DEFAULT false,
    tags TEXT[],
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE NOTÍCIAS
CREATE TYPE news_status AS ENUM ('rascunho', 'pendente_aprovacao', 'publicada', 'arquivada');

CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    category TEXT,
    status news_status DEFAULT 'rascunho',
    author_id UUID REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HISTÓRICO DE ATIVIDADES
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Função helper no schema PUBLIC (não auth)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- PROFILES
CREATE POLICY "profiles_select" ON profiles 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update" ON profiles 
    FOR UPDATE TO authenticated USING (id = auth.uid());

-- DEMANDS
CREATE POLICY "demands_select" ON demands 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "demands_insert_auth" ON demands 
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "demands_update" ON demands 
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "demands_insert_anon" ON demands 
    FOR INSERT TO anon WITH CHECK (true);

-- CONTACTS
CREATE POLICY "contacts_select" ON contacts 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "contacts_all" ON contacts 
    FOR ALL TO authenticated USING (true);

-- NEWS
CREATE POLICY "news_select_public" ON news 
    FOR SELECT TO anon USING (status = 'publicada');

CREATE POLICY "news_select_auth" ON news 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "news_all" ON news 
    FOR ALL TO authenticated USING (true);

-- NEIGHBORHOODS
CREATE POLICY "neighborhoods_select" ON neighborhoods 
    FOR SELECT USING (true);

-- ACTIVITY_LOG
CREATE POLICY "activity_log_select" ON activity_log 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "activity_log_insert" ON activity_log 
    FOR INSERT TO authenticated WITH CHECK (true);

-- 9. ÍNDICES
CREATE INDEX idx_demands_status ON demands(status);
CREATE INDEX idx_demands_neighborhood ON demands(neighborhood_id);
CREATE INDEX idx_demands_created_at ON demands(created_at DESC);
CREATE INDEX idx_contacts_neighborhood ON contacts(neighborhood_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);

-- 10. UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_demands_updated_at
    BEFORE UPDATE ON demands FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- PRONTO! Crie um usuário admin:
-- 1. Authentication > Users > Add User
-- 2. Execute: UPDATE profiles SET role = 'master_admin' WHERE email = 'seu@email.com';
-- =============================================
