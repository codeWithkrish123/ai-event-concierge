# AI Event Concierge 🎉

A full-stack AI-powered event and trip planning application built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **AI-Powered Planning**: Generate detailed trip and event plans using Google's Gemini AI
- **Real-time Chat**: Modern chat interface with streaming responses
- **Session Management**: Multiple chat sessions with local storage persistence
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Dark/Light Themes**: Toggle between themes for comfortable usage
- **History Tracking**: View and manage your planning history

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Axios** - HTTP client for API calls
- **Framer Motion** - Smooth animations
- **CSS3** - Custom styling with Claude-inspired design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Google Gemini AI** - AI model integration

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Google AI Studio account (for Gemini API key)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "AI Event Travel Plan"
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?appName=<app-name>
GEMINI_API_KEY=<your-gemini-api-key>
```

### 3. Install Dependencies

#### Backend Dependencies
```bash
cd Server
npm install
```

#### Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Start the Development Servers

#### Start Backend Server
```bash
# From the Server directory
cd Server
npm start
```
The server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
# From the client directory
cd client
npm start
```
The frontend will start on `http://localhost:3000`

## 🏗️ Project Structure

```
AI Event Travel Plan/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.js         # API configuration
│   │   └── App.js         # Main App component
│   └── package.json
├── Server/                 # Node.js backend
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── routes/
│   │   └── eventRoutes.js # API routes
│   ├── server.js          # Main server file
│   └── package.json
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
└── README.md             # This file
```

## 🔧 Configuration

### API Configuration
The frontend API configuration is in `client/src/api.js`:

```javascript
const API = axios.create({
  baseURL: "http://localhost:5000", // Development
  // baseURL: "https://ai-event-concierge-ikoi.onrender.com", // Production
});
```

### CORS Configuration
Server CORS settings are in `Server/server.js`:
```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-vercel-domain.vercel.app",
  // Add your production domains here
];
```

## 📝 API Endpoints

### Generate Event Plan
```http
POST /api/events/generate
Content-Type: application/json

{
  "prompt": "Plan a 3-day trip to Manali for 5 people"
}
```

### Get History
```http
GET /api/events/history
```

### List Available Models
```http
GET /api/events/models
```

## 🎨 Features Overview

### Chat Interface
- **Modern Design**: Clean, Claude-inspired UI
- **Streaming Responses**: Real-time text streaming
- **Message History**: Persistent chat sessions
- **Error Handling**: User-friendly error messages with retry functionality

### AI Integration
- **Multiple Models**: Support for various Gemini AI models
- **Fallback Logic**: Automatic model switching on failures
- **Rate Limiting**: Built-in rate limit handling

### Theme System
- **Light/Dark Modes**: Toggle between themes
- **Persistent Settings**: Theme preference saved locally

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the build directory to `client`
3. Configure environment variables if needed
4. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set the root directory to `Server`
3. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy automatically on push to main branch

## 🔐 Security Notes

- **Never commit API keys** to version control
- **Always use environment variables** for sensitive data
- **API keys are server-side only** - never expose them in frontend code
- **CORS is properly configured** to restrict access

## 🐛 Troubleshooting

### Common Issues

1. **"API key was reported as leaked"**
   - Generate a new API key from Google AI Studio
   - Update environment variables in `.env` and deployment platform
   - Restart the server

2. **CORS Errors**
   - Add your frontend domain to `allowedOrigins` in `Server/server.js`
   - Restart the server after changes

3. **MongoDB Connection Issues**
   - Verify your MongoDB URI is correct
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check database user credentials

4. **Frontend Build Issues**
   - Ensure `"homepage": "."` is in `client/package.json`
   - Run `npm run build` to test locally

### Development Tips

- Use the browser's Network tab to debug API calls
- Check server console for detailed error messages
- Test API endpoints with Postman or curl
- Use React Developer Tools for frontend debugging

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy Planning! 🎯**
