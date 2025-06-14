
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/types/subscription';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transformer les données pour correspondre au type Subscription
      const transformedData: Subscription[] = data.map(item => ({
        id: item.id,
        companyName: item.company_name,
        clientName: item.client_name,
        logo: item.logo,
        whatsappNumber: item.whatsapp_number,
        websiteUrl: item.website_url,
        adminUrl: item.admin_url,
        notionUrl: item.notion_url,
        daysRemaining: item.days_remaining,
        paymentStatus: item.payment_status as 'paid' | 'pending' | 'overdue',
        nextPaymentDate: item.next_payment_date,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setSubscriptions(transformedData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des abonnements:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions
  };
};
