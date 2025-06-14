
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserSettings {
  id: string;
  user_id: string;
  background_blur: number;
  active_background_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return null;

    try {
      if (settings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('user_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
        return data;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
      return null;
    }
  };

  const setActiveBackground = async (backgroundId: string | null) => {
    const result = await updateSettings({ active_background_id: backgroundId });
    if (result) {
      toast.success('Arrière-plan mis à jour');
    }
    return result;
  };

  const setBackgroundBlur = async (blur: number) => {
    return await updateSettings({ background_blur: blur });
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    setActiveBackground,
    setBackgroundBlur,
    refetch: fetchSettings
  };
};
