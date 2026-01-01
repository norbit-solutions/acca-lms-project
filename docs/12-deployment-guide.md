# Deployment Guide

This guide covers deploying the ACCA LMS to production.

## Architecture Overview

| Component | Service | Purpose |
|-----------|---------|---------|
| Frontend | Vercel | Next.js app hosting |
| Backend | Railway (dev) / DO Droplet (prod) | AdonisJS API |
| Database | TiDB Cloud Serverless | MySQL-compatible, free tier |
| Storage | Cloudflare R2 | S3-compatible, free tier |
| Video | Mux | Video streaming & encoding |

---

## 1. Database Setup (TiDB Cloud)

1. Create account at [tidbcloud.com](https://tidbcloud.com)
2. Create a **Serverless** cluster (free tier: 25GB)
3. Get connection details from **Connect** button
4. **Important**: TiDB requires SSL/TLS connections

**Backend `config/database.ts` must include:**
```typescript
ssl: {
  minVersion: 'TLSv1.2',
  rejectUnauthorized: true,
}
```

---

## 2. Storage Setup (Cloudflare R2)

1. Create Cloudflare account → R2 Object Storage
2. Create bucket (e.g., `learnspire`)
3. **Create API Token**: R2 → Manage R2 API Tokens → Create API Token
   - Permissions: Object Read & Write
   - Specify bucket
4. Enable **Public Access** for the bucket (for image URLs)

**Environment Variables:**
```env
S3_ACCESS_KEY=your_access_key_id
S3_SECRET_KEY=your_secret_access_key
S3_ENDPOINT=your-account-id.r2.cloudflarestorage.com  # NO https://
S3_BUCKET=learnspire
```

### R2 Bucket Settings (Cloudflare Dashboard)

| Setting | Action |
|---------|--------|
| **Public Development URL** | Enable (for public image access) |
| **CORS Policy** | Add (see below) |
| Custom Domains | Optional (for production) |
| R2 Data Catalog | Not needed |
| Object Lifecycle Rules | Not needed |

**CORS Policy (Add in R2 bucket settings):**
```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-frontend.vercel.app"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"]
  }
]
```

---

## 3. Video Setup (Mux)

### Get Credentials
1. [mux.com](https://mux.com) → Settings → API Access Tokens
2. Create token with **Mux Video** permissions
3. Generate **Signing Key** for signed playback URLs

### Configure Webhook (CRITICAL!)
1. Mux Dashboard → Settings → Webhooks
2. **Add Webhook**:
   - URL: `https://your-railway-backend.up.railway.app/webhooks/mux`
   - Events: `video.asset.ready`, `video.asset.errored`
3. Copy the **Signing Secret** (optional, for verification)

> ⚠️ **Without the webhook, videos will show "not available yet" forever!**
> The webhook notifies your backend when Mux finishes processing a video.

### Mux Troubleshooting

**"Video is not available yet" error:**
1. Check if webhook URL is configured in Mux Dashboard
2. Verify the URL matches your Railway backend exactly
3. Test webhook manually:
   ```bash
   curl -X POST https://YOUR-RAILWAY-URL/webhooks/mux \
     -H "Content-Type: application/json" \
     -d '{"type": "test"}'
   ```
4. Check Railway logs for incoming webhook requests

**Fix existing videos (uploaded before webhook was configured):**
- Re-upload the video, OR
- Manually update the lesson's `mux_playback_id` and `video_status` in the database

---

## 4. Backend Deployment (Railway)

### Initial Setup
1. Connect GitHub repo to Railway
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install && npm run build && cd build && npm install --production`
4. Set **Start Command**: `node build/bin/server.js`

### Environment Variables (Railway Dashboard)
```env
TZ=UTC
PORT=3333
HOST=0.0.0.0
NODE_ENV=production
APP_KEY=your_app_key

CORS_ORIGIN=https://your-frontend.vercel.app

DB_HOST=gateway01.region.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_tidb_user
DB_PASSWORD=your_tidb_password
DB_DATABASE=your_database

MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
MUX_SIGNING_KEY_ID=your_signing_key_id
MUX_SIGNING_PRIVATE_KEY=base64_encoded_private_key

S3_ACCESS_KEY=your_r2_access_key
S3_SECRET_KEY=your_r2_secret_key
S3_ENDPOINT=account-id.r2.cloudflarestorage.com
S3_BUCKET=learnspire
```

### Run Migrations
From local machine (connected to TiDB):
```bash
cd backend
node ace migration:run
node ace db:seed
```

---

## 5. Frontend Deployment (Vercel)

### Initial Setup
1. Connect GitHub repo to Vercel
2. Set **Root Directory**: `frontend`
3. Framework preset: **Next.js** (auto-detected)

### Environment Variables (Vercel Dashboard)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

---

## 6. Post-Deployment Checklist

- [ ] Test health endpoint: `GET /health`
- [ ] Configure Mux webhook URL with Railway backend URL
- [ ] Set `CORS_ORIGIN` in Railway to Vercel frontend URL
- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel to Railway backend URL
- [ ] Test admin login
- [ ] Test video upload and playback
- [ ] Test image uploads (thumbnails, avatars)

---

## 7. Migration Notes (TiDB Compatibility)

TiDB has slight differences from MySQL:
- **Don't use `.after()` in migrations** when adding multiple columns in same ALTER statement
- TiDB validates entire statement before executing

---

## 8. Production Deployment (DO Droplet)

For production, migrate from Railway to DigitalOcean Droplet:

### Why Droplet?
- Cost: ~$12/mo vs Railway variable pricing
- Full control over server configuration
- Better for consistent production workloads

### Server Setup (Ubuntu 22.04)
1. Create Droplet (2GB RAM minimum)
2. Install: Node.js 20, Nginx, PM2, Certbot
3. Clone repo, install dependencies
4. Configure Nginx reverse proxy
5. Set up SSL with Let's Encrypt
6. Run app with PM2

### Nginx Config
```nginx
server {
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Useful Commands

```bash
# Check backend health
curl https://your-backend-url/health

# Run migrations locally (connects to TiDB)
node ace migration:run

# Run specific seeder
node ace db:seed --files ./database/seeders/admin_seeder.ts

# Build locally
node ace build
```
