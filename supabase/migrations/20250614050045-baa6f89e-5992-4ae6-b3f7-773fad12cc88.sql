
-- Créer une table pour les abonnements
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  logo TEXT,
  whatsapp_number TEXT NOT NULL,
  website_url TEXT NOT NULL,
  admin_url TEXT NOT NULL,
  notion_url TEXT,
  days_remaining INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'pending', 'overdue')),
  next_payment_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer un index pour optimiser les requêtes par statut de paiement
CREATE INDEX idx_subscriptions_payment_status ON public.subscriptions(payment_status);

-- Créer un index pour optimiser les requêtes par échéance
CREATE INDEX idx_subscriptions_days_remaining ON public.subscriptions(days_remaining);

-- Créer une fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insérer des données d'exemple basées sur l'interface
INSERT INTO public.subscriptions (
  company_name,
  client_name,
  whatsapp_number,
  website_url,
  admin_url,
  notion_url,
  days_remaining,
  payment_status,
  next_payment_date,
  notes
) VALUES
  ('TechCorp Solutions', 'Marie Dubois', '+33 6 12 34 56 78', 'https://techcorp-solutions.com', 'https://admin.techcorp-solutions.com', 'https://notion.so/techcorp', 15, 'paid', '2024-07-01', 'Client premium avec support prioritaire'),
  ('StartupXYZ', 'Pierre Martin', '+33 6 98 76 54 32', 'https://startupxyz.fr', 'https://admin.startupxyz.fr', 'https://notion.so/startupxyz', 3, 'pending', '2024-06-20', 'Paiement en attente depuis 2 jours'),
  ('Digital Agency Pro', 'Sophie Laurent', '+33 6 11 22 33 44', 'https://digital-agency-pro.com', 'https://admin.digital-agency-pro.com', 'https://notion.so/digitalpro', 45, 'paid', '2024-07-30', 'Excellent client, toujours à jour'),
  ('E-commerce Plus', 'Julien Rousseau', '+33 6 55 66 77 88', 'https://ecommerce-plus.fr', 'https://admin.ecommerce-plus.fr', 'https://notion.so/ecommerceplus', -5, 'overdue', '2024-06-10', 'Relance nécessaire - 5 jours de retard'),
  ('WebStudio Creative', 'Camille Moreau', '+33 6 99 88 77 66', 'https://webstudio-creative.com', 'https://admin.webstudio-creative.com', 'https://notion.so/webstudio', 7, 'pending', '2024-06-22', 'Nouveau client, premier paiement en cours');

-- Activer RLS (Row Level Security) pour la sécurité
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Créer une politique permettant à tous les utilisateurs authentifiés de voir tous les abonnements
-- (À ajuster selon vos besoins de sécurité)
CREATE POLICY "Allow authenticated users to view all subscriptions"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Créer une politique permettant aux utilisateurs authentifiés de créer des abonnements
CREATE POLICY "Allow authenticated users to create subscriptions"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Créer une politique permettant aux utilisateurs authentifiés de modifier des abonnements
CREATE POLICY "Allow authenticated users to update subscriptions"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Créer une politique permettant aux utilisateurs authentifiés de supprimer des abonnements
CREATE POLICY "Allow authenticated users to delete subscriptions"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (true);
