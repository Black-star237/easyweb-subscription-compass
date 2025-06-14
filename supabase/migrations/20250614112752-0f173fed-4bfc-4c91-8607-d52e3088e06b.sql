
-- Activer les mises à jour en temps réel pour la table subscriptions
ALTER TABLE public.subscriptions REPLICA IDENTITY FULL;

-- Ajouter la table à la publication realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
