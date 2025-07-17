# AI Website Generator

A web application that allows users to create and edit websites through an AI chat interface.

## Features

- **AI Chat Interface**: Talk to the Deepseek AI assistant to edit your website
- **Visual Editor**: Select elements and ask the AI to modify them
- **Code Access**: View and edit HTML, CSS, and JavaScript directly
- **Live Preview**: See changes to your website in real-time with accurate rendering
- **Interactive AI Suggestions**: "Try it" buttons on AI suggestions for one-click implementation
- **User Accounts**: Save your projects and continue editing later
- **Responsive Design**: Preview your website on desktop, tablet, and mobile devices

## Project Structure

```
ai-website-generator/
├── public/
│   ├── css/
│   │   ├── styles.css      # Main styles for landing page
│   │   ├── auth.css        # Styles for login/signup pages
│   │   └── dashboard.css   # Styles for the dashboard
│   ├── js/
│   │   ├── main.js         # JavaScript for landing page
│   │   ├── auth.js         # Authentication functionality
│   │   └── dashboard.js    # Dashboard and editor functionality
│   └── images/             # Image assets
├── src/                    # Source code for more complex functionality
│   ├── components/         # Reusable UI components
│   ├── utils/              # Utility functions
│   └── auth/               # Authentication logic
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Signup page
└── dashboard.html          # Main application dashboard
```

## How to Use

1. Open `index.html` in your browser to view the landing page
2. Click "Sign Up" to create an account
3. After logging in, you'll be redirected to the dashboard
4. Use the AI chat interface to describe changes you want to make
5. Select elements on the page to edit them specifically
6. View and edit the code directly in the code editors
7. Preview your website and publish when ready

## AI Chat Commands

You can use natural language to instruct the AI. Here are some example commands:

- "Change the header color to blue"
- "Add a contact form section"
- "Make the font size larger"
- "Add a gallery section with 3 images"
- "Change the text in the hero section"

## Development

This project uses the Deepseek AI API for the chat interface and Supabase for database storage. API keys are configured in `src/config.js`.

### API Integration

The AI chat functionality is powered by the Deepseek API. The integration includes:

- Connection to the Deepseek Chat API endpoint
- Context management for conversation history
- Error handling and retry logic for API failures
- Status indicator showing connection state

### Database Integration

The project uses Supabase for database storage. The integration includes:

- User authentication and management
- Project storage and retrieval
- Template management
- Row Level Security (RLS) for data protection

### Database Setup

To set up the Supabase database:

1. Navigate to the `supabase` directory
2. Follow the instructions in the README file
3. Run the setup script or manually execute the SQL statements
4. Test the connection using the `db-test.html` page

### Production Considerations

For a production environment, you would need to:

1. Set up proper authentication flows
2. Move API keys to environment variables
3. Implement more robust error handling
4. Add proper hosting and deployment

## License

MIT