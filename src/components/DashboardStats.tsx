
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSubscriptions } from '@/data/mockData';

const DashboardStats = () => {
  const totalSubscriptions = mockSubscriptions.length;
  const activeSubscriptions = mockSubscriptions.filter(s => s.paymentStatus === 'paid').length;
  const pendingSubscriptions = mockSubscriptions.filter(s => s.paymentStatus === 'pending').length;
  const overdueSubscriptions = mockSubscriptions.filter(s => s.paymentStatus === 'overdue').length;
  const dueSoon = mockSubscriptions.filter(s => s.daysRemaining <= 7).length;

  const stats = [
    {
      title: "Total des abonnements",
      value: totalSubscriptions,
      description: "Clients actifs",
      color: "text-interface-primary"
    },
    {
      title: "Paiements reçus",
      value: activeSubscriptions,
      description: "À jour",
      color: "text-interface-success"
    },
    {
      title: "En attente",
      value: pendingSubscriptions,
      description: "Paiements attendus",
      color: "text-interface-warning"
    },
    {
      title: "En retard",
      value: overdueSubscriptions,
      description: "Nécessitent relance",
      color: "text-interface-danger"
    },
    {
      title: "Bientôt dus",
      value: dueSoon,
      description: "< 7 jours",
      color: "text-interface-secondary"
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
