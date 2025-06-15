
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

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
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: authListenerData } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Use setTimeout to prevent deadlocks as per Supabase best practices
          setTimeout(async () => {
            try {
              await fetchProfile(newSession.user.id);
            } catch (err) {
              console.error('Error fetching profile after auth change:', err);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListenerData?.subscription.unsubscribe();
    };
  }, []); // Removed loading dependency to prevent infinite loop

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
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      if (response.error) setError(response.error);
      return response;
    } catch (err) {
      console.error('Sign in error:', err);
      return { data: { user: null, session: null }, error: err as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp: typeof supabase.auth.signUp = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const response = await supabase.auth.signUp({
        ...credentials,
        options: {
          emailRedirectTo: redirectUrl,
          ...(credentials.options?.data && { data: credentials.options.data }),
        }
      });
      if (response.error) setError(response.error);
      return response;
    } catch (err) {
      console.error('Sign up error:', err);
      return { data: { user: null, session: null }, error: err as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut: typeof supabase.auth.signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await supabase.auth.signOut();
      if (response.error) setError(response.error);
      setProfile(null);
      return response;
    } catch (err) {
      console.error('Sign out error:', err);
      return { error: err as AuthError };
    } finally {
      setLoading(false);
    }
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
