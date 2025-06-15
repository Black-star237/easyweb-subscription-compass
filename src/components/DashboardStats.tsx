
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DashboardStats = () => {
  const { subscriptions, loading, error, refetch } = useSubscriptions();

  // Listen for real-time changes on the subscriptions table
  useEffect(() => {
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'subscriptions'
        },
        (payload) => {
          console.log('Subscription change detected, updating stats...', payload);
          refetch(); // Reload data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading statistics</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate real statistics from database data with safety checks
  const totalSubscriptions = subscriptions?.length || 0;
  const activeSubscriptions = subscriptions?.filter(s => s?.paymentStatus === 'paid')?.length || 0;
  const pendingSubscriptions = subscriptions?.filter(s => s?.paymentStatus === 'pending')?.length || 0;
  const overdueSubscriptions = subscriptions?.filter(s => s?.paymentStatus === 'overdue')?.length || 0;
  
  // Calculate subscriptions expiring soon (within the next 7 days)
  const dueSoon = subscriptions?.filter(s => {
    try {
      return s?.paymentStatus === 'paid' && s?.daysRemaining <= 7 && s?.daysRemaining > 0;
    } catch (err) {
      console.error('Error filtering due soon subscriptions:', err);
      return false;
    }
  })?.length || 0;

  const stats = [
    {
      title: "Total des abonnements",
      value: totalSubscriptions,
      description: "Clients actifs",
      color: "text-blue-600"
    },
    {
      title: "Paiements reçus",
      value: activeSubscriptions,
      description: "À jour",
      color: "text-green-600"
    },
    {
      title: "En attente",
      value: pendingSubscriptions,
      description: "Paiements attendus",
      color: "text-orange-600"
    },
    {
      title: "En retard",
      value: overdueSubscriptions,
      description: "Nécessitent relance",
      color: "text-red-600"
    },
    {
      title: "Bientôt dus",
      value: dueSoon,
      description: "< 7 jours",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
