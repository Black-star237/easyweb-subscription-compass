
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Installer l'application
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Ajoutez EasyWeb SM à votre écran d'accueil pour un accès rapide
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={installPWA} className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                Installer
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsDismissed(true)}
              >
                Plus tard
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;
