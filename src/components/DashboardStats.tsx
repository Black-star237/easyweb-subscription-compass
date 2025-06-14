
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const DashboardStats = () => {
  const { subscriptions, loading } = useSubscriptions();

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

  // Calculer les statistiques réelles à partir des données de la base
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.paymentStatus === 'paid').length;
  const pendingSubscriptions = subscriptions.filter(s => s.paymentStatus === 'pending').length;
  const overdueSubscriptions = subscriptions.filter(s => s.paymentStatus === 'overdue').length;
  
  // Calculer les abonnements qui expirent bientôt (dans les 7 prochains jours)
  const dueSoon = subscriptions.filter(s => {
    if (s.paymentStatus === 'paid' && s.daysRemaining <= 7 && s.daysRemaining > 0) {
      return true;
    }
    return false;
  }).length;

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
      color: "text-yellow-600"
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
