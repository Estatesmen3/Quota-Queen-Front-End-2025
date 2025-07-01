// context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: 'student' | 'recruiter'
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<any>) => Promise<{ error: any | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (session?.user) {
        console.log("session?.user ---- ", session?.user)
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {


    console.log("------- userId ", userId)


    const { data, error } = await supabase
      .from('profiles')           // <-- before it was 'profiles'
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    console.log("------- data ", data)
    setProfile(data);
  };

  const updateProfile = async (updates: Partial<any>) => {
    if (!user) return { error: new Error('User is not authenticated') };

    try {
      const { error } = await supabase
        .from('users')         // <-- also 'users' here
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile(user.id);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      return { error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { url: null, error: new Error('User is not authenticated') };

    try {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(data.path);

      await updateProfile({ avatar_url: urlData.publicUrl });
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated successfully.',
      });
      return { url: urlData.publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      return { url: null, error };
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    userType: "student" | "recruiter"
  ) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        },
      },
    });
  
    if (signUpError) return { error: signUpError };
  
    const userId = signUpData.user?.id;
  
    if (userId) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        auth_uid: userId, // Store Supabase UUID here
        firstname: firstName,
        lastname: lastName,
        email,
        password: hashedPassword,
        role: userType,
        created_at: new Date().toISOString(),
      });
  
      if (insertError) return { error: insertError };
    }
  
    return { error: null };
  };
  

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    }
    return { error };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Sign out issue', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Logged out', description: 'You have been logged out successfully.' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
