# AI Event Concierge

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended - Free & Easy)

#### Frontend + Backend Together:
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from root folder:**
   ```bash
   cd "c:\Users\sahkr\OneDrive\Desktop\AI Event Travel Plan\ai-event-concierge"
   vercel
   ```

4. **Set Environment Variable:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = your Gemini API key

#### Frontend Only:
1. **Build frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify (Free Static Hosting)

#### Frontend Only:
1. **Build frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag `build` folder to netlify.com
   - OR use Netlify CLI: `npx netlify-cli deploy --prod --dir=build`

### Option 3: Railway (Full-Stack)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy:**
   ```bash
   railway deploy
   ```

### Option 4: Traditional Hosting

#### Backend (Node.js):
1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Start server:**
   ```bash
   cd Server
   pm2 start server.js --name "ai-event-concierge"
   ```

#### Frontend (Apache/Nginx):
1. **Build frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Copy `build` folder** to your web server

## 🔧 Environment Setup

### Required Environment Variables:
- `GEMINI_API_KEY`: Your Google Gemini API key

### For Development:
1. **Start Backend:**
   ```bash
   cd Server
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm install
   npm start
   ```

## 📱 Quick Deploy Commands

### Vercel (Easiest):
```bash
cd "c:\Users\sahkr\OneDrive\Desktop\AI Event Travel Plan\ai-event-concierge"
vercel --prod
```

### Netlify (Frontend Only):
```bash
cd client
npm run build
# Upload build folder to netlify.com
```

### Railway (Full-Stack):
```bash
railway login
railway deploy
```

## ✅ Verification

After deployment, test:
1. Frontend loads at your domain
2. API calls work (check network tab)
3. Theme toggle functions
4. Chat functionality works
5. Delete chat works

## 🌐 Domain Setup

After deployment, you can:
- Add custom domain in Vercel/Netlify dashboard
- Update CORS if needed in `Server/server.js`

## 📞 Support

For issues:
- Check console logs
- Verify API key is set
- Ensure CORS allows your domain
- Check build logs for errors