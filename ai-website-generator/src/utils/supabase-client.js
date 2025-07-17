/**
 * Supabase Client
 * 
 * This module provides a connection to Supabase for database operations.
 */

import config from '../config.js';

// Get Supabase configuration from config.js
const supabaseUrl = config.api.supabase.url;
const supabaseKey = config.api.supabase.key;

// Initialize Supabase client
let supabase = null;

// Dynamically import the Supabase client
async function initSupabase() {
  try {
    // In a real project with proper bundling, you would use:
    // import { createClient } from '@supabase/supabase-js'
    
    // For this demo, we'll use a CDN import
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
}

// Get the Supabase client
async function getClient() {
  if (!supabase) {
    await initSupabase();
  }
  return supabase;
}

export { getClient, initSupabase };