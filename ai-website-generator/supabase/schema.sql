-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  html_content TEXT,
  css_content TEXT,
  js_content TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT NOT NULL,
  js_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY users_policy ON users
  FOR ALL
  USING (auth.uid() = id);

-- Projects can only be accessed by their owners
CREATE POLICY projects_policy ON projects
  FOR ALL
  USING (auth.uid() = user_id);

-- Templates are readable by everyone
CREATE POLICY templates_read_policy ON templates
  FOR SELECT
  USING (true);

-- Insert some default templates
INSERT INTO templates (name, description, thumbnail, html_content, css_content, js_content) VALUES
(
  'Business',
  'Professional template for businesses',
  'public/images/templates/business.jpg',
  '<!DOCTYPE html><html><head><title>Business Template</title></head><body><header><nav><div class="logo">Business Name</div><ul class="nav-links"><li><a href="#">Home</a></li><li><a href="#">Services</a></li><li><a href="#">About</a></li><li><a href="#">Contact</a></li></ul></nav></header><main><section class="hero"><h1>We Help Businesses Grow</h1><p>Professional services for your company</p><button>Get Started</button></section></main><footer><p>&copy; 2023 Business Name</p></footer></body></html>',
  'body{font-family:Arial,sans-serif;margin:0;padding:0;line-height:1.6;}header{background-color:#333;color:white;padding:1rem;}nav{display:flex;justify-content:space-between;align-items:center;}.logo{font-size:1.5rem;font-weight:bold;}.nav-links{display:flex;list-style:none;}.nav-links li{margin-left:1rem;}.nav-links a{color:white;text-decoration:none;}.hero{height:80vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background-color:#f4f4f4;}button{padding:0.75rem 1.5rem;background-color:#333;color:white;border:none;border-radius:4px;cursor:pointer;}footer{background-color:#333;color:white;text-align:center;padding:1rem;}',
  'document.addEventListener("DOMContentLoaded", function() { console.log("Business template loaded"); });'
),
(
  'Portfolio',
  'Showcase your work with this elegant portfolio',
  'public/images/templates/portfolio.jpg',
  '<!DOCTYPE html><html><head><title>Portfolio Template</title></head><body><header><h1>My Portfolio</h1><p>Showcasing my creative work</p></header><main><section class="gallery"><div class="project"><img src="https://via.placeholder.com/300x200" alt="Project 1"><h3>Project 1</h3><p>Description of project</p></div><div class="project"><img src="https://via.placeholder.com/300x200" alt="Project 2"><h3>Project 2</h3><p>Description of project</p></div></section></main><footer><p>&copy; 2023 My Portfolio</p></footer></body></html>',
  'body{font-family:"Montserrat",sans-serif;margin:0;padding:0;line-height:1.6;}header{text-align:center;padding:3rem 0;background-color:#f8f9fa;}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem;padding:2rem;}.project{border-radius:5px;overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.1);}.project img{width:100%;height:200px;object-fit:cover;}.project h3,.project p{padding:0 1rem;}footer{text-align:center;padding:2rem;background-color:#f8f9fa;}',
  'document.addEventListener("DOMContentLoaded", function() { console.log("Portfolio template loaded"); });'
);

-- Create indexes for better performance
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX users_email_idx ON users(email);