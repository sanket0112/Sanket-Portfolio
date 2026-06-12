# Setup Guide

## 1. Installation Guide
First, ensure you have Node.js and MongoDB installed on your system.

### Install Root Dependencies (Optional, for concurrently running)
```bash
cd "D:\Sanket Document\Sanket Portfolio"
npm init -y
npm install concurrently
```
*Note: I will provide a root `package.json` to make running both server and client together easy.*

### Install Server Dependencies
```bash
cd "D:\Sanket Document\Sanket Portfolio\server"
npm install
```

### Install Client Dependencies
```bash
cd "D:\Sanket Document\Sanket Portfolio\client"
npm install
```

## 2. MongoDB Setup Guide
1. Ensure MongoDB is running on your machine (e.g., using MongoDB Compass or mongod service).
2. The server will attempt to connect to `mongodb://127.0.0.1:27017/sanket_portfolio`.
3. If you want to use MongoDB Atlas, replace the `MONGO_URI` in `server/.env` with your connection string.

## 3. Environment Variables
### Server `.env` (Location: `server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sanket_portfolio
```

### Client `.env` (Location: `client/.env` - optional for Vite)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 4. Run Commands
### Option A: Run Separately
**Terminal 1 (Backend):**
```bash
cd "D:\Sanket Document\Sanket Portfolio\server"
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "D:\Sanket Document\Sanket Portfolio\client"
npm run dev
```

### Option B: Run Together (If root package.json is configured)
```bash
cd "D:\Sanket Document\Sanket Portfolio"
npm run dev
```

## 5. Build Commands
To build the React application for production:
```bash
cd "D:\Sanket Document\Sanket Portfolio\client"
npm run build
```
This generates a `dist` folder.

## 6. Deployment Guide
1. **Frontend**: The `client/dist` folder can be hosted on Vercel, Netlify, or GitHub Pages.
2. **Backend**: The `server` folder can be hosted on Render, Heroku, or an AWS EC2 instance. Ensure you provide the production `MONGO_URI` to your host's environment variables.
3. Configure CORS in `server.js` to accept requests from your deployed frontend domain.
