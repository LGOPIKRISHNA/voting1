import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, role: 'admin' | 'voter') {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { role }
    }
  });

  if (signUpError) throw signUpError;
  if (!user?.id) throw new Error('User ID not found');

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ 
      id: user.id, 
      email, 
      role 
    }]);

  if (profileError) throw profileError;
  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user ?? null;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}