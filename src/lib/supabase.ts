// QIC Gamified Insurance App - Supabase Client Configuration
// This file sets up the Supabase client and provides helper functions

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Environment variables (these will be set in .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (error?.error_description) {
    return error.error_description;
  }
  return 'An unexpected error occurred';
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(handleSupabaseError(error));
  }
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(handleSupabaseError(error));
  }
};

// Generic CRUD helper functions
export const createRecord = async <T>(
  table: string,
  data: Partial<T>
): Promise<T> => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return result;
};

export const getRecord = async <T>(
  table: string,
  id: string
): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return data;
};

export const updateRecord = async <T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<T> => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return result;
};

export const deleteRecord = async (
  table: string,
  id: string
): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(handleSupabaseError(error));
  }
};

export const getRecords = async <T>(
  table: string,
  options?: {
    filters?: Record<string, any>;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    offset?: number;
  }
): Promise<T[]> => {
  let query = supabase.from(table).select('*');

  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return data || [];
};

// Real-time subscription helper
export const subscribeToTable = <T>(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  let channel = supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: table,
      filter: filter
    }, callback);

  return channel.subscribe();
};

// File upload helper
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return data.path;
};

// File download helper
export const downloadFile = async (
  bucket: string,
  path: string
): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return data;
};

// Get public URL for file
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

// Database health check
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    return !error;
  } catch {
    return false;
  }
};

// Export types for database schema
export type { Database } from '@/types/supabase';
