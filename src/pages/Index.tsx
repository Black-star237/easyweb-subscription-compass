
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import SubscriptionTable from '@/components/SubscriptionTable';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-easyweb-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 bg-white/70 backdrop-blur-md rounded-lg p-6 shadow-sm border border-white/20">
          <h1 className="text-3xl font-bold text-easyweb-gray mb-2">
            Gestionnaire d'abonnements
          </h1>
          <p className="text-gray-700">
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
