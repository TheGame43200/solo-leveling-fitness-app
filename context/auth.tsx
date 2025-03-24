import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';

// Définir le type des données de l'utilisateur
export type UserData = {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: 'male' | 'female' | null;
  coaching_style: 'bienveillant' | 'strict' | 'equilibre' | null;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  points: number;
  created_at: string;
};

// Interface du contexte d'authentification
interface AuthContextProps {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null, data: any | null }>;
  signOut: () => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<{ error: any | null }>;
  refreshUserData: () => Promise<void>;
}

// Créer le contexte
const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  userData: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  updateUserData: async () => ({ error: null }),
  refreshUserData: async () => {}
});

// Provider pour envelopper l'application
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error loading session:', error.message);
      } else {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      }
    } catch (error) {
      console.error('Unexpected error loading session:', error);
    } finally {
      setLoading(false);
    }
  }

  // Récupérer les données de l'utilisateur depuis Supabase
  async function fetchUserData(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error.message);
      } else if (data) {
        setUserData(data as UserData);
      }
    } catch (error) {
      console.error('Unexpected error fetching user data:', error);
    }
  }

  // Rafraîchir les données utilisateur
  async function refreshUserData() {
    if (user) {
      await fetchUserData(user.id);
    }
  }

  // Configurer l'écouteur d'événements pour les changements d'authentification
  useEffect(() => {
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await fetchUserData(newSession.user.id);
        } else {
          setUserData(null);
        }

        // Gérer la navigation basée sur l'état d'authentification
        if (event === 'SIGNED_IN' && newSession) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          
          // Si l'utilisateur n'a pas complété son profil, le rediriger
          if (!data || !data.coaching_style) {
            router.replace('/profile');
          } else {
            router.replace('/(tabs)');
          }
        } else if (event === 'SIGNED_OUT') {
          router.replace('/login');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Fonction de connexion
  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return { error };
    }
  }

  // Fonction d'inscription
  async function signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (!error && data.user) {
        // Créer un profil pour le nouvel utilisateur
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            email,
            rank: 'E',
            points: 0,
          }]);
        
        if (profileError) {
          console.error('Error creating user profile:', profileError.message);
        }
      }
      
      return { error, data };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      return { error, data: null };
    }
  }

  // Fonction de déconnexion
  async function signOut() {
    try {
      await supabase.auth.signOut();
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // Mettre à jour les données utilisateur
  async function updateUserData(data: Partial<UserData>) {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (!error) {
        // Mettre à jour le state local avec les nouvelles données
        setUserData(prev => prev ? { ...prev, ...data } : null);
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { error };
    }
  }

  const value = {
    user,
    session,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserData,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}