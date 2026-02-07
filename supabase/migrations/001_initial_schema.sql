-- ================================================
-- VEREADORA CÁSSIA - SCHEMA DO BANCO DE DADOS
-- Supabase PostgreSQL
-- ================================================

-- ================================================
-- ENUMS
-- ================================================

-- Roles de usuários
CREATE TYPE user_role AS ENUM ('master_admin', 'vereadora', 'assessor');

-- Status de demandas
CREATE TYPE demand_status AS ENUM ('nova', 'em_analise', 'enviada_prefeitura', 'resolvida', 'arquivada');

-- Tipo de demanda
CREATE TYPE demand_type AS ENUM (
  'iluminacao', 
  'buraco', 
  'assistencia_social', 
  'saude', 
  'educacao', 
  'transporte', 
  'moradia', 
  'outros'
);

-- ================================================
-- TABELAS
-- ================================================

-- Tabela de perfis (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'assessor',
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de bairros de Caraguatatuba
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  zone TEXT, -- 'Centro', 'Litoral Norte', 'Litoral Sul', etc.
  population_estimate INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir bairros de Caraguatatuba
INSERT INTO neighborhoods (name, zone) VALUES
  ('Centro', 'Centro'),
  ('Indaiá', 'Litoral Sul'),
  ('Martim de Sá', 'Litoral Sul'),
  ('Massaguaçu', 'Litoral Norte'),
  ('Tabatinga', 'Litoral Norte'),
  ('Sumaré', 'Centro'),
  ('Porto Novo', 'Litoral Sul'),
  ('Jardim Primavera', 'Centro'),
  ('Tinga', 'Litoral Sul'),
  ('Travessão', 'Centro'),
  ('Caputera', 'Centro'),
  ('Casa Branca', 'Litoral Norte'),
  ('Jaraguazinho', 'Centro'),
  ('Morro do Algodão', 'Centro'),
  ('Pegorelli', 'Centro'),
  ('Perequê-Mirim', 'Litoral Sul'),
  ('Rio do Ouro', 'Centro'),
  ('Prainha', 'Litoral Sul'),
  ('Pan Brasil', 'Centro'),
  ('Jardim Aruan', 'Centro')
ON CONFLICT (name) DO NOTHING;

-- Tabela de demandas cidadãs (Gabinete Digital)
CREATE TABLE IF NOT EXISTS demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados do cidadão
  citizen_name TEXT NOT NULL,
  citizen_phone TEXT,
  citizen_email TEXT,
  
  -- Localização
  neighborhood_id INTEGER REFERENCES neighborhoods(id),
  address_detail TEXT, -- Endereço específico ou ponto de referência
  
  -- Demanda
  demand_type demand_type NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  
  -- Status e responsável
  status demand_status DEFAULT 'nova',
  assigned_to UUID REFERENCES profiles(id),
  priority INTEGER DEFAULT 0, -- 0=normal, 1=urgente, 2=crítico
  
  -- Resolução
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_demands_status ON demands(status);
CREATE INDEX IF NOT EXISTS idx_demands_neighborhood ON demands(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_demands_created ON demands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demands_assigned ON demands(assigned_to);

-- Tabela de notícias/conteúdo
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT,
  
  -- Publicação
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Tabela de contatos (CRM)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  neighborhood_id INTEGER REFERENCES neighborhoods(id),
  
  -- Segmentação
  interests TEXT[], -- ARRAY['educacao', 'saude', 'moradia']
  tags TEXT[],
  
  -- Metadata
  source TEXT, -- 'gabinete_digital', 'evento', 'indicacao', etc.
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_interests ON contacts USING GIN(interests);

-- Tabela de logs do sistema (apenas para Master Admin)
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT, -- 'demand', 'news', 'contact', etc.
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON system_logs(user_id, created_at DESC);

-- ================================================
-- TRIGGERS
-- ================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas principais
CREATE TRIGGER trigger_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_demands_updated
  BEFORE UPDATE ON demands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_news_updated
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_contacts_updated
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: todos autenticados podem ver, só próprio pode editar
CREATE POLICY "Profiles são visíveis para todos autenticados"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem editar próprio perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Demands: assessores e acima podem ver/editar
CREATE POLICY "Demandas visíveis para staff"
  ON demands FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_active = true
    )
  );

CREATE POLICY "Demandas editáveis por staff"
  ON demands FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_active = true
    )
  );

-- Permitir inserção anônima de demandas (Gabinete Digital público)
CREATE POLICY "Cidadãos podem criar demandas"
  ON demands FOR INSERT
  TO anon
  WITH CHECK (true);

-- News: todos podem ver publicadas, staff pode editar
CREATE POLICY "Notícias publicadas são públicas"
  ON news FOR SELECT
  TO anon
  USING (published = true);

CREATE POLICY "Staff pode ver todas notícias"
  ON news FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_active = true
    )
  );

CREATE POLICY "Staff pode editar notícias"
  ON news FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_active = true
    )
  );

-- Contacts: apenas staff
CREATE POLICY "Contatos visíveis apenas para staff"
  ON contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_active = true
    )
  );

-- System Logs: apenas master_admin
CREATE POLICY "Logs apenas para master_admin"
  ON system_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'master_admin'
      AND profiles.is_active = true
    )
  );

-- ================================================
-- VIEWS PARA DASHBOARD
-- ================================================

-- View: Demandas por bairro (para o termômetro)
CREATE OR REPLACE VIEW demand_stats_by_neighborhood AS
SELECT 
  n.id as neighborhood_id,
  n.name as neighborhood_name,
  n.zone,
  COUNT(d.id) as total_demands,
  COUNT(CASE WHEN d.status = 'nova' THEN 1 END) as new_demands,
  COUNT(CASE WHEN d.status = 'em_analise' THEN 1 END) as in_analysis,
  COUNT(CASE WHEN d.status = 'enviada_prefeitura' THEN 1 END) as sent_to_mayor,
  COUNT(CASE WHEN d.status = 'resolvida' THEN 1 END) as resolved
FROM neighborhoods n
LEFT JOIN demands d ON d.neighborhood_id = n.id
GROUP BY n.id, n.name, n.zone
ORDER BY total_demands DESC;

-- View: Estatísticas gerais
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  COUNT(DISTINCT d.id) as total_demands,
  COUNT(DISTINCT CASE WHEN d.status = 'resolvida' THEN d.id END) as resolved_demands,
  COUNT(DISTINCT c.id) as total_contacts,
  COUNT(DISTINCT CASE WHEN n.published = true THEN n.id END) as published_news,
  COUNT(DISTINCT CASE WHEN d.created_at > NOW() - INTERVAL '30 days' THEN d.id END) as demands_last_30_days
FROM demands d
CROSS JOIN contacts c
CROSS JOIN news n;
