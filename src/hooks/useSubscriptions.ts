
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from '@/types/subscription';
import { calculateDaysRemaining } from '@/utils/dateUtils';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculatePaymentStatus = (nextPaymentDate: string): 'paid' | 'pending' | 'overdue' => {
    try {
      const today = new Date();
      const paymentDate = new Date(nextPaymentDate);
      
      // Validate dates
      if (isNaN(paymentDate.getTime())) {
        console.warn('Invalid payment date:', nextPaymentDate);
        return 'overdue';
      }
      
      // Reset time to start of day for accurate comparison
      today.setHours(0, 0, 0, 0);
      paymentDate.setHours(0, 0, 0, 0);
      
      const timeDiff = paymentDate.getTime() - today.getTime();
      
      if (timeDiff > 0) {
        return 'paid'; // Future date - subscription is active/paid
      } else if (timeDiff === 0) {
        return 'pending'; // Today - payment due
      } else {
        return 'overdue'; // Past date - payment overdue
      }
    } catch (err) {
      console.error('Error calculating payment status:', err);
      return 'overdue';
    }
  };

  const fetchSubscriptions = async () => {
    try {
      console.log('Fetching subscriptions...');
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      console.log('Raw subscription data:', data);

      if (!data) {
        console.log('No subscription data received');
        setSubscriptions([]);
        return;
      }

      // Transform data with enhanced error handling
      const transformedData: Subscription[] = data.map((item, index) => {
        try {
          const daysRemaining = calculateDaysRemaining(item.next_payment_date);
          const paymentStatus = calculatePaymentStatus(item.next_payment_date);
          
          return {
            id: item.id,
            companyName: item.company_name || 'Unknown Company',
            clientName: item.client_name || 'Unknown Client',
            logo: item.logo,
            whatsappNumber: item.whatsapp_number || '',
            websiteUrl: item.website_url || '',
            adminUrl: item.admin_url || '',
            notionUrl: item.notion_url,
            daysRemaining,
            paymentStatus,
            nextPaymentDate: item.next_payment_date,
            notes: item.notes,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          };
        } catch (transformError) {
          console.error(`Error transforming subscription ${index}:`, transformError, item);
          // Return a safe fallback subscription
          return {
            id: item.id || `fallback-${index}`,
            companyName: 'Error Loading',
            clientName: 'Error Loading',
            logo: null,
            whatsappNumber: '',
            websiteUrl: '',
            adminUrl: '',
            notionUrl: null,
            daysRemaining: 0,
            paymentStatus: 'overdue' as const,
            nextPaymentDate: new Date().toISOString().split('T')[0],
            notes: null,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString()
          };
        }
      });

      console.log('Transformed subscription data:', transformedData);
      setSubscriptions(transformedData);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to load subscriptions: ${errorMessage}`);
      setSubscriptions([]); // Set empty array on error
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
