
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import BackgroundCustomizer from '@/components/BackgroundCustomizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Button>
          
          <h1 className="text-3xl font-bold text-easyweb-gray mb-2">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Personnalisez l'apparence de votre application
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BackgroundCustomizer />
          </div>
          
          <div>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connecté depuis: {new Date(user.created_at || '').toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
