
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Trash2, Check } from 'lucide-react';
import { useUserBackgrounds } from '@/hooks/useUserBackgrounds';
import { useUserSettings } from '@/hooks/useUserSettings';

const BackgroundCustomizer = () => {
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { backgrounds, loading: backgroundsLoading, uploadBackground, deleteBackground } = useUserBackgrounds();
  const { settings, setActiveBackground, setBackgroundBlur } = useUserSettings();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadName) {
        setUploadName(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadName.trim()) return;

    setUploading(true);
    await uploadBackground(uploadFile, uploadName.trim());
    setUploadFile(null);
    setUploadName('');
    setUploading(false);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleBlurChange = (value: number[]) => {
    setBackgroundBlur(value[0]);
  };

  const handleSetActive = (backgroundId: string | null) => {
    setActiveBackground(backgroundId);
  };

  if (backgroundsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personnalisation de l'arrière-plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un arrière-plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="background-name">Nom de l'arrière-plan</Label>
              <Input
                id="background-name"
                placeholder="Nom de votre arrière-plan"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="background-file">Fichier image</Label>
              <Input
                id="background-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <Button 
            onClick={handleUpload}
            disabled={!uploadFile || !uploadName.trim() || uploading}
            className="w-full md:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Ajout en cours...' : 'Ajouter l\'arrière-plan'}
          </Button>
        </CardContent>
      </Card>

      {/* Blur Control */}
      <Card>
        <CardHeader>
          <CardTitle>Niveau de flou</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Intensité du flou: {settings?.background_blur || 0}%</Label>
            <Slider
              value={[settings?.background_blur || 0]}
              onValueChange={handleBlurChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Background Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Mes arrière-plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Default option */}
            <div className="relative">
              <div 
                className={`aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 cursor-pointer transition-all ${
                  !settings?.active_background_id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSetActive(null)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Par défaut</span>
                </div>
                {!settings?.active_background_id && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
            </div>

            {backgrounds.map((background) => (
              <div key={background.id} className="relative group">
                <div 
                  className={`aspect-video rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
                    settings?.active_background_id === background.id 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSetActive(background.id)}
                >
                  <img
                    src={background.image_url}
                    alt={background.name}
                    className="w-full h-full object-cover"
                  />
                  {settings?.active_background_id === background.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-primary bg-white rounded-full p-0.5" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {background.name}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteBackground(background.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {backgrounds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun arrière-plan personnalisé. Ajoutez-en un ci-dessus !
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackgroundCustomizer;
