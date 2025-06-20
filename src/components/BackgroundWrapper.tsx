
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useUserBackgrounds } from '@/hooks/useUserBackgrounds';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  const { user } = useAuth();
  const { settings } = useUserSettings();
  const { backgrounds } = useUserBackgrounds();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.active_background_id) {
      const activeBackground = backgrounds.find(bg => bg.id === settings.active_background_id);
      if (activeBackground) {
        setBackgroundImage(activeBackground.image_url);
      }
    } else {
      setBackgroundImage(null);
    }
  }, [settings, backgrounds]);

  const blurValue = settings?.background_blur || 0;

  return (
    <div className="relative min-h-screen">
      {/* Background layer */}
      {backgroundImage && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${blurValue * 0.2}px)`,
          }}
        />
      )}
      
      {/* Light overlay for better contrast */}
      {backgroundImage && (
        <div className="fixed inset-0 z-10 bg-white/5" />
      )}
      
      {/* Content layer */}
      <div className="relative z-20 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
