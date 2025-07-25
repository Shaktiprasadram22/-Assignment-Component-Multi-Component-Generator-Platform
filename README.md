# AI Component Generator Platform

A full-stack application that generates React components using AI, built with Node.js, Express, MongoDB, and Next.js.

## 🚀 Features

- 🔐 **User Authentication** with JWT tokens
- 💬 **Interactive Chat Interface** for component generation
- 🤖 **AI-Powered Code Generation** using OpenRouter/OpenAI
- 📱 **Session Management** with persistent chat history
- 🎨 **Live Component Preview** in sandboxed iframe
- 📝 **Syntax-Highlighted Code Viewer** with multiple tabs
- 📦 **Download Components** as ZIP files
- 🔄 **Copy Code to Clipboard** functionality
- 💾 **Auto-Save** chat sessions and generated code

## 🏗️ Architecture

```mermaid
graph TD
  subgraph User
    A[User Browser]
  end

  subgraph Frontend
    B[Next.js Pages]
    C[Login]
    D[Dashboard]
    A --> B
    B --> C
    B --> D
    B --> E[Chat Panel]
    B --> F[Component Preview]
    B --> G[Code Tabs]
  end

  subgraph Backend
    H[Auth Controller]
    I[Session Controller]
    J[AI Controller]
  end

  subgraph MongoDB
    K[Users Collection]
    L[Sessions Collection]
  end

  subgraph OpenRouter
    M[LLM Endpoint]
  end

  %% Frontend to Backend
  E -- "Prompt" --> J
  J -- "POST /api/ai/generate" --> M
  M -- "AI Response (JSX/TSX + CSS)" --> J
  J -- "Save to Sessions" --> L

  A -- "Signup/Login" --> H
  H -- "Users CRUD" --> K

  B -- "Load Sessions" --> I
  I -- "Fetch Sessions" --> L

  %% Live Preview
  F -- "Renders JSX/TSX in sandboxed iframe" --> F

  %% Tabs
  G -- "Show Syntax Highlighted Code" --> G

  %% Session Save
  I -- "Auto-Save Chat + Code" --> L
```

## 🛠️ Tech Stack

### Backend

- **Node.js** + Express.js
- **MongoDB** + Mongoose ODM
- **JWT** Authentication
- **OpenRouter/OpenAI** API integration
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

### Frontend

- **Next.js** (JavaScript)
- **React 18** with hooks
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **React Syntax Highlighter** for code display
- **Sandboxed iframe** for component preview

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** 16+ installed
- **MongoDB Atlas** account (or local MongoDB)
- **OpenRouter** or **OpenAI** API key
- **Git** for version control

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-component-generator.git
cd ai-component-generator
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-components

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Service
OPENROUTER_API_KEY=your-openrouter-api-key
# OR
OPENAI_API_KEY=your-openai-api-key

# CORS
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Configure your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
ai-component-generator/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Session.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── sessions.js
│   │   └── ai.js
│   ├── utils/
│   │   └── openai.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── dashboard.js
│   ├── components/
│   │   ├── ChatPanel.js
│   │   ├── ComponentPreview.js
│   │   ├── CodeTabs.js
│   │   └── Layout.js
│   ├── utils/
│   │   ├── api.js
│   │   └── auth.js
│   ├── styles/
│   │   └── globals.css
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Sessions

- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### AI Generation

- `POST /api/ai/generate` - Generate component from prompt

## 🎯 Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Start Chatting**: Use the chat interface to describe the component you want
3. **Generate Code**: The AI will generate React/JSX/TSX code with CSS
4. **Live Preview**: See your component rendered in real-time
5. **Download/Copy**: Download as ZIP or copy code to clipboard
6. **Session History**: All your generations are automatically saved

## 🎨 Component Generation Examples

**Example Prompts:**

- "Create a modern button component with hover effects"
- "Build a responsive card component with image and text"
- "Generate a loading spinner with CSS animations"
- "Create a form component with validation"

## 🔧 Configuration

### AI Model Configuration

The platform supports multiple AI providers:

```javascript
// In aiController.js
const AI_PROVIDERS = {
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  openai: "https://api.openai.com/v1/chat/completions",
};
```

### Database Schema

**Users Collection:**

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Sessions Collection:**

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  messages: [{
    role: String, // 'user' | 'assistant'
    content: String,
    timestamp: Date
  }],
  generatedCode: {
    jsx: String,
    css: String,
    typescript: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. Set environment variables in your deployment platform
2. Configure MongoDB Atlas whitelist
3. Deploy with:

```bash
npm run start
```

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License. See `LICENSE` file for details.

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**

- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 isn't in use

**Frontend build fails:**

- Check API URL configuration
- Verify Node.js version compatibility
- Clear npm cache: `npm cache clean --force`

**AI generation not working:**

- Verify API key is correct
- Check API quota/billing
- Inspect network requests in browser dev tools

## 📞 Support

For support, email support@yourcompany.com or create an issue on GitHub.

## 🙏 Acknowledgments

- OpenAI/OpenRouter for AI capabilities
- Next.js team for the amazing framework
- MongoDB for the database solution
- Tailwind CSS for styling utilities

---

Built with ❤️ by [Shakti Prasad Ram]
