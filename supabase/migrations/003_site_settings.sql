-- =============================================
-- SITE SETTINGS - Configurações do Site
-- Execute no SQL Editor do Supabase
-- =============================================

-- Tabela para armazenar configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "site_settings_select" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "site_settings_update" ON site_settings
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "site_settings_insert" ON site_settings
    FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Inserir configurações padrão
INSERT INTO site_settings (key, value) VALUES
    ('hero_image_url', '""'),
    ('bio_image_url', '""'),
    ('bio_quote', '"Com luta e persistência, transformamos a realidade do nosso povo."'),
    ('hero_subtitle', '"Trabalhando todos os dias pela nossa cidade. Defendo mulheres, cultura caiçara e moradia digna para quem mais precisa."'),
    ('whatsapp_number', '"5512999999999"'),
    ('instagram_url', '""'),
    ('facebook_url', '""')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- CRIAR BUCKET DE IMAGENS (Storage)
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'site-images',
    'site-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy para permitir leitura pública
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'site-images');

-- Policy para permitir upload autenticado
CREATE POLICY "Authenticated Upload" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'site-images');

-- Policy para permitir update autenticado
CREATE POLICY "Authenticated Update" ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'site-images');

-- Policy para permitir delete autenticado
CREATE POLICY "Authenticated Delete" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'site-images');
