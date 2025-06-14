
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types'; // Assurez-vous que ce chemin est correct

type Profile = Tables<'profiles'>;

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  error: AuthError | null;
  signIn: typeof supabase.auth.signInWithPassword;
  signUp: typeof supabase.auth.signUp;
  signOut: typeof supabase.auth.signOut;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          // Defer profile fetching to avoid potential deadlocks
          setTimeout(async () => {
            setLoading(true); // Set loading true before fetching profile
            await fetchProfile(newSession.user.id);
            setLoading(false); // Set loading false after fetching profile
          }, 0);
        } else {
          setProfile(null);
          // Ensure loading is false if no user/session
          // This might already be handled by getInitialSession's setLoading(false)
          // but good to be explicit if a state change leads here without a user.
          if (loading) setLoading(false);
        }
      }
    );

    return () => {
      authListenerData?.subscription.unsubscribe();
    };
  }, [loading]); // Added loading to dependency array, as it's modified within setTimeout

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setProfile(null);
        return;
      }
      setProfile(data as Profile);
    } catch (e) {
      console.error('Unexpected error fetching profile:', e);
      setProfile(null);
    }
  };
  
  const signIn: typeof supabase.auth.signInWithPassword = async (credentials) => {
    setLoading(true);
    setError(null);
    const response = await supabase.auth.signInWithPassword(credentials);
    if (response.error) setError(response.error);
    setLoading(false);
    return response;
  };

  const signUp: typeof supabase.auth.signUp = async (credentials) => {
    setLoading(true);
    setError(null);
    // Assurez-vous d'inclure l'URL de redirection pour la confirmation par e-mail
    const redirectUrl = `${window.location.origin}/`;
    const response = await supabase.auth.signUp({
      ...credentials,
      options: {
        emailRedirectTo: redirectUrl,
        ...(credentials.options?.data && { data: credentials.options.data }),
      }
    });
    if (response.error) setError(response.error);
    setLoading(false);
    return response;
  };

  const signOut: typeof supabase.auth.signOut = async () => {
    setLoading(true);
    setError(null);
    const response = await supabase.auth.signOut();
    if (response.error) setError(response.error);
    setProfile(null); // Effacer le profil lors de la déconnexion
    setLoading(false);
    return response;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

