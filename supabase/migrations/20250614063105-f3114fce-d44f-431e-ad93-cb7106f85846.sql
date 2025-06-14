
-- Créer la table 'profiles' pour stocker les données spécifiques à l'utilisateur
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Commentaire: La fonction 'handle_updated_at' existe déjà et sera utilisée.
-- Créer un trigger pour mettre à jour 'updated_at' sur la table 'profiles'
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at(); -- Utilise la fonction existante

-- Créer une fonction pour insérer une nouvelle ligne dans public.profiles lors de l'inscription d'un nouvel utilisateur
-- Cette fonction récupérera first_name, last_name, avatar_url depuis raw_user_meta_data si fournis à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer un trigger pour appeler handle_new_user après la création d'un utilisateur dans auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Activer la sécurité au niveau des lignes (RLS) pour la table 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique RLS: Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Politique RLS: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
