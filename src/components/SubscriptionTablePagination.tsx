
import React from 'react';
import { Button } from '@/components/ui/button';

interface SubscriptionTablePaginationProps {
  totalResults: number;
  currentResults: number;
}

const SubscriptionTablePagination: React.FC<SubscriptionTablePaginationProps> = ({
  totalResults,
  currentResults
}) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Affichage de 1 à {currentResults} sur {totalResults} résultats
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" disabled>
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-easyweb-red text-white hover:bg-easyweb-red/90"
        >
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionTablePagination;
