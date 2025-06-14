
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/types/subscription';
import { calculateDaysRemaining } from '@/utils/dateUtils';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePaymentStatus = (nextPaymentDate: string): 'paid' | 'pending' | 'overdue' => {
    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    paymentDate.setHours(0, 0, 0, 0);
    
    if (paymentDate > today) {
      return 'paid'; // Future date - subscription is active/paid
    } else if (paymentDate.getTime() === today.getTime()) {
      return 'pending'; // Today - payment due
    } else {
      return 'overdue'; // Past date - payment overdue
    }
  };

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

      // Transform data and calculate status and remaining days automatically
      const transformedData: Subscription[] = data.map(item => ({
        id: item.id,
        companyName: item.company_name,
        clientName: item.client_name,
        logo: item.logo,
        whatsappNumber: item.whatsapp_number,
        websiteUrl: item.website_url,
        adminUrl: item.admin_url,
        notionUrl: item.notion_url,
        daysRemaining: calculateDaysRemaining(item.next_payment_date),
        paymentStatus: calculatePaymentStatus(item.next_payment_date), // Auto-calculated
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
