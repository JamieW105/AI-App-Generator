/**
 * Supabase Setup Script
 * 
 * This script helps set up the Supabase database tables for the AI Website Generator.
 * Run this script to create the necessary tables and initial data.
 * 
 * Usage:
 * 1. Make sure you have the Supabase JavaScript client installed
 * 2. Run this script with Node.js: node setup.js
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read configuration
const configPath = path.join(__dirname, '..', 'src', 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Extract Supabase URL and key from config
const supabaseUrlMatch = configContent.match(/url: ['"]([^'"]+)['"]/);
const supabaseKeyMatch = configContent.match(/key: ['"]([^'"]+)['"]/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
  console.error('Could not find Supabase URL or key in config.js');
  process.exit(1);
}

const supabaseUrl = supabaseUrlMatch[1];
const supabaseKey = supabaseKeyMatch[1];

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL schema
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split schema into individual statements
const statements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

// Execute each statement
async function setupDatabase() {
  console.log('Setting up Supabase database...');
  
  try {
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error('Error executing statement:', error);
      }
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup
setupDatabase();