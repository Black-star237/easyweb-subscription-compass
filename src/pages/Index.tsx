
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import SubscriptionTable from '@/components/SubscriptionTable';

const Index = () => {
  return (
    <div className="min-h-screen bg-interface-light">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-interface-dark mb-2">
            Gestionnaire d'abonnements
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez tous vos abonnements clients en un seul endroit
          </p>
        </div>
        
        <DashboardStats />
        <SubscriptionTable />
      </main>
    </div>
  );
};

export default Index;
