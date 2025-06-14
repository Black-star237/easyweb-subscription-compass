
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface SubscriptionTableHeaderProps {
  onAddSubscription: () => void;
}

const SubscriptionTableHeader: React.FC<SubscriptionTableHeaderProps> = ({
  onAddSubscription
}) => {
  return (
    <CardHeader>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle className="text-xl font-semibold">
          Gestionnaire d'abonnements
        </CardTitle>
        <Button 
          className="bg-easyweb-red hover:bg-easyweb-red/90"
          onClick={onAddSubscription}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un abonnement
        </Button>
      </div>
      <p className="text-muted-foreground">
        Gérez et suivez tous vos abonnements clients en un seul endroit
      </p>
    </CardHeader>
  );
};

export default SubscriptionTableHeader;
