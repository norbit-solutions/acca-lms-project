# Setup Guide

## Prerequisites
- Node.js 20+
- MySQL 8+
- Mux account with signing keys
- Digital Ocean Spaces bucket (for uploads)

## Step 1: Initialize Projects

### Backend (AdonisJS)
```
cd acca-lms-project
npm init adonisjs@latest backend -- -K=api --db=mysql
cd backend
npm install @mux/mux-node luxon uuid
```

### Frontend (Next.js)
```
cd acca-lms-project
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend
npm install axios @mux/mux-player-react zustand
```

## Step 2: Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=acca_lms

MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret
MUX_SIGNING_KEY_ID=your_signing_key_id
MUX_SIGNING_PRIVATE_KEY=your_base64_private_key

DO_SPACES_KEY=
DO_SPACES_SECRET=
DO_SPACES_ENDPOINT=
DO_SPACES_BUCKET=

APP_KEY=generate_with_node_ace_generate_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

## Step 3: Local MySQL Setup

### macOS (Homebrew)
```
brew install mysql
brew services start mysql
mysql_secure_installation
mysql -u root -p -e "CREATE DATABASE acca_lms;"
```

### Ubuntu/Debian
```
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
sudo mysql -e "CREATE DATABASE acca_lms;"
```

### Run Migrations
```
cd backend
node ace migration:run
node ace db:seed  # if seeders exist
```

## Step 4: Mux Webhook Setup
- For local dev: use ngrok to expose backend
- Webhook URL: `https://your-ngrok-url/admin/lessons/video/webhook`
- Events to subscribe: `video.asset.ready`, `video.asset.errored`

## Step 5: Digital Ocean Spaces
- Create bucket with public read access
- Configure CORS for your domains
- Get access keys from API settings

## Running Locally
```
# Terminal 1: Backend
cd backend
node ace serve --watch

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Deployment (Digital Ocean Droplet)

### Why Droplet over App Platform
- Cost: ~$12/mo vs $40-60/mo
- Full control over MySQL config
- All services on single server
- Better for small-medium LMS

### Server Setup (Ubuntu 22.04)
1. Create Droplet (2GB RAM, $12/mo)
2. SSH into server
3. Install Node.js 20, MySQL 8, Nginx, PM2
4. Clone repo, install dependencies
5. Configure Nginx as reverse proxy
6. Set up SSL with Certbot
7. Run apps with PM2

### Nginx Config
- Frontend: yourdomain.com → localhost:3000
- Backend: api.yourdomain.com → localhost:3333
- Or: yourdomain.com/api → localhost:3333

### PM2 Process Management
- Run both frontend and backend as PM2 processes
- Auto-restart on crash
- Auto-start on server reboot

### Scaling Later
- If needed: separate DB to its own droplet
- Or migrate to DO Managed Database ($15/mo)
