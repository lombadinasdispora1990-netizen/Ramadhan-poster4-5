import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================
// Authentication Helpers
// ============================================

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @returns {Promise<{data: any, error: any}>}
 */
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
  return { data, error };
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data: any, error: any}>}
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

/**
 * Sign out current user
 * @returns {Promise<{error: any}>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get current authenticated user
 * @returns {Promise<any|null>}
 */
export const getCurrentUser = async () => {
  // Use getSession() only — reads from local storage first (fast)
  // Avoid getUser() which always makes a network call
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session.user;
};

/**
 * Reset password for user
 * @param {string} email - User email
 * @returns {Promise<{data: any, error: any}>}
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  return { data, error };
};

/**
 * Update user profile
 * @param {object} updates - Profile updates
 * @returns {Promise<{data: any, error: any}>}
 */
export const updateUser = async (updates) => {
  const { data, error } = await supabase.auth.updateUser(updates);
  return { data, error };
};

// ============================================
// Database Helpers
// ============================================

/**
 * Save generation to database
 * @param {object} generationData - Generation data
 * @returns {Promise<{data: any, error: any}>}
 */
export const saveGeneration = async (generationData) => {
  const { data, error } = await supabase
    .from('generations')
    .insert([generationData]);
  return { data, error };
};

/**
 * Get user's generations
 * @param {string} userId - User ID
 * @param {number} limit - Max results (default: 50)
 * @returns {Promise<{data: any, error: any}>}
 */
export const getUserGenerations = async (userId, limit = 50) => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data, error };
};

/**
 * Get single generation by ID
 * @param {string} generationId - Generation ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const getGeneration = async (generationId) => {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .single();
  return { data, error };
};

/**
 * Delete generation
 * @param {string} generationId - Generation ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const deleteGeneration = async (generationId) => {
  const { data, error } = await supabase
    .from('generations')
    .delete()
    .eq('id', generationId);
  return { data, error };
};

/**
 * Update generation download count
 * @param {string} generationId - Generation ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const incrementDownloadCount = async (generationId) => {
  const { data, error } = await supabase.rpc('increment_download_count', {
    generation_id: generationId
  });
  return { data, error };
};

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{data: any, error: any}>}
 */
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const getUserStats = async (userId) => {
  const { data, error } = await supabase.rpc('get_user_stats', {
    user_id: userId
  });
  return { data, error };
};

/**
 * Sync user profile and credits
 * @param {string} userId - User ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const syncProfile = async (userId) => {
  // First refresh credits via RPC
  const { error: refreshError } = await supabase.rpc('refresh_user_credits', {
    target_user_id: userId
  });
  
  if (refreshError) console.warn('Credit refresh warning:', refreshError);

  // Then get the latest profile
  return getProfile(userId);
};

/**
 * Decrement one credit from user profile
 * @param {string} userId - User ID
 * @returns {Promise<{data: any, error: any}>}
 */
export const consumeOneCredit = async (userId) => {
  const { data, error } = await supabase.rpc('consume_credit', {
    target_user_id: userId
  });
  return { data, error };
};

export default supabase;
