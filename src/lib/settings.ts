import { createClient } from '@/lib/supabase/client';

export type SiteSettingKey =
    | 'hero_image_url'
    | 'bio_image_url'
    | 'bio_quote'
    | 'hero_subtitle'
    | 'whatsapp_number'
    | 'instagram_url'
    | 'facebook_url';

export interface SiteSettings {
    hero_image_url: string;
    bio_image_url: string;
    bio_quote: string;
    hero_subtitle: string;
    whatsapp_number: string;
    instagram_url: string;
    facebook_url: string;
}

const defaultSettings: SiteSettings = {
    hero_image_url: '',
    bio_image_url: '',
    bio_quote: 'Com luta e persistência, transformamos a realidade do nosso povo.',
    hero_subtitle: 'Trabalhando todos os dias pela nossa cidade. Defendo mulheres, cultura caiçara e moradia digna para quem mais precisa.',
    whatsapp_number: '5512999999999',
    instagram_url: '',
    facebook_url: '',
};

/**
 * Busca todas as configurações do site
 */
export async function getSiteSettings(): Promise<SiteSettings> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

    if (error || !data) {
        console.error('Erro ao buscar configurações:', error);
        return defaultSettings;
    }

    const settings = { ...defaultSettings };

    for (const row of data) {
        const key = row.key as SiteSettingKey;
        if (key in settings) {
            settings[key] = row.value as string;
        }
    }

    return settings;
}

/**
 * Busca uma configuração específica
 */
export async function getSetting(key: SiteSettingKey): Promise<string> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error || !data) {
        return defaultSettings[key];
    }

    return data.value as string;
}

/**
 * Atualiza uma configuração
 */
export async function updateSetting(key: SiteSettingKey, value: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

    if (error) {
        console.error('Erro ao atualizar configuração:', error);
        return false;
    }

    return true;
}

/**
 * Atualiza múltiplas configurações de uma vez
 */
export async function updateSettings(settings: Partial<SiteSettings>): Promise<boolean> {
    const supabase = createClient();

    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

    if (error) {
        console.error('Erro ao atualizar configurações:', error);
        return false;
    }

    return true;
}
