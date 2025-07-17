# Supabase Setup for AI Website Generator

This directory contains the necessary files to set up the Supabase database for the AI Website Generator.

## Database Schema

The `schema.sql` file contains the SQL statements to create the following tables:

1. **users** - Stores user information
   - id (UUID, primary key)
   - name (text)
   - email (text, unique)
   - created_at (timestamp)
   - updated_at (timestamp)

2. **projects** - Stores website projects
   - id (UUID, primary key)
   - name (text)
   - description (text)
   - template (text)
   - html_content (text)
   - css_content (text)
   - js_content (text)
   - user_id (UUID, foreign key to users)
   - created_at (timestamp)
   - updated_at (timestamp)

3. **templates** - Stores website templates
   - id (UUID, primary key)
   - name (text)
   - description (text)
   - thumbnail (text)
   - html_content (text)
   - css_content (text)
   - js_content (text)
   - created_at (timestamp)
   - updated_at (timestamp)

## Setup Instructions

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of `schema.sql`
4. Paste into the SQL Editor and run the queries

### Option 2: Using the Setup Script

1. Make sure you have Node.js installed
2. Run the setup script:
   ```
   node setup.js
   ```

## Row Level Security (RLS)

The schema includes Row Level Security policies:

- Users can only access their own user data
- Users can only access their own projects
- Templates are readable by everyone

## Default Data

The schema includes two default templates:
- Business template
- Portfolio template