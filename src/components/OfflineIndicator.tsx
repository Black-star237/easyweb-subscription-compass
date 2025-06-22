
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  return (
    <Badge 
      variant={isOnline ? "secondary" : "destructive"}
      className="flex items-center gap-1"
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          En ligne
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          Hors ligne
        </>
      )}
    </Badge>
  );
};

export default OfflineIndicator;
