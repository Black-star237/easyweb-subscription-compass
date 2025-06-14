
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface UserBackground {
  id: string;
  user_id: string;
  image_url: string;
  name: string;
  is_active: boolean;
  blur_level: number;
  created_at: string;
  updated_at: string;
}

export const useUserBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useState<UserBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBackgrounds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_backgrounds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackgrounds(data || []);
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      toast.error('Erreur lors du chargement des arrière-plans');
    } finally {
      setLoading(false);
    }
  };

  const uploadBackground = async (file: File, name: string) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('user_backgrounds')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          name,
          blur_level: 0
        })
        .select()
        .single();

      if (error) throw error;

      setBackgrounds(prev => [data, ...prev]);
      toast.success('Arrière-plan ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error uploading background:', error);
      toast.error('Erreur lors de l\'ajout de l\'arrière-plan');
      return null;
    }
  };

  const deleteBackground = async (backgroundId: string) => {
    try {
      const background = backgrounds.find(bg => bg.id === backgroundId);
      if (!background) return;

      // Delete from storage
      const fileName = background.image_url.split('/').pop();
      if (fileName && user) {
        await supabase.storage
          .from('backgrounds')
          .remove([`${user.id}/${fileName}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('user_backgrounds')
        .delete()
        .eq('id', backgroundId);

      if (error) throw error;

      setBackgrounds(prev => prev.filter(bg => bg.id !== backgroundId));
      toast.success('Arrière-plan supprimé');
    } catch (error) {
      console.error('Error deleting background:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (user) {
      fetchBackgrounds();
    }
  }, [user]);

  return {
    backgrounds,
    loading,
    uploadBackground,
    deleteBackground,
    refetch: fetchBackgrounds
  };
};
