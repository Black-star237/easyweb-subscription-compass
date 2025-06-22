
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardStats from '@/components/DashboardStats';
import SubscriptionTable from '@/components/SubscriptionTable';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('User not authenticated, redirecting to auth page');
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Show loading state while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-easyweb-red mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an auth error
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-medium">Erreur d'authentification</p>
            <p className="text-sm">{authError.message}</p>
          </div>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-easyweb-red text-white px-4 py-2 rounded hover:bg-easyweb-red/90 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (this should be handled by the useEffect above)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 bg-white/70 backdrop-blur-md rounded-lg p-6 shadow-sm border border-white/20">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-easyweb-gray">
              Gestionnaire d'abonnements
            </h1>
            <OfflineIndicator />
          </div>
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
