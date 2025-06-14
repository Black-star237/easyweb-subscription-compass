
-- Créer le bucket pour les logos des abonnements
INSERT INTO storage.buckets (id, name, public)
VALUES ('subscription-logos', 'subscription-logos', true);

-- Politique pour permettre à tous les utilisateurs authentifiés d'uploader des logos
CREATE POLICY "Authenticated users can upload logos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'subscription-logos');

-- Politique pour permettre à tous les utilisateurs authentifiés de voir les logos
CREATE POLICY "Anyone can view logos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'subscription-logos');

-- Politique pour permettre aux utilisateurs authentifiés de mettre à jour les logos
CREATE POLICY "Authenticated users can update logos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'subscription-logos');

-- Politique pour permettre aux utilisateurs authentifiés de supprimer les logos
CREATE POLICY "Authenticated users can delete logos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'subscription-logos');
