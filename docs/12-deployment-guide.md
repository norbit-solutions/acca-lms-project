# AWS Lightsail Deployment Guide

Production deployment of ACCA LMS backend to AWS Lightsail.

## Architecture Overview

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Vercel | https://learnspirepro.in |
| Backend | AWS Lightsail | https://api.learnspirepro.in |
| Database | MySQL on Lightsail | localhost:3306 |
| Storage | Cloudflare R2 | S3-compatible |
| Video | Mux | Streaming & encoding |

> [!NOTE]
> **Future: Staging Environment**
> A staging environment can be added later at `staging.learnspirepro.in` using port 4444, with a separate database `learnspire_staging`. The architecture supports running both on the same instance.

---

## Directory Structure

```
~/apps/learnspire/
├── prod/
│   └── learnspire-project/
│       └── backend/
│           └── build/          ← Production app runs from here
├── ecosystem.config.cjs        ← PM2 config
└── deploy-prod.sh              ← Production deploy script
```

---

## Phase 1: Lightsail Instance Setup

### Create Instance (AWS Console)
1. Go to **AWS Lightsail Console**
2. Click **Create instance**
3. Select:
   - **Region**: Mumbai (ap-south-1) for Indian users
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: $10/mo (2GB RAM) or $20/mo (4GB RAM) recommended

### Attach Static IP
1. Go to **Networking** tab
2. Click **Create static IP**
3. Attach to your instance
4. **Note down the IP** - you'll need it for DNS

### Configure Firewall
In the **Networking** tab, add these rules:
| Port | Protocol | Description |
|------|----------|-------------|
| 22 | TCP | SSH (already enabled) |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |

---

## Phase 2: Domain Configuration

### DNS Records (GoDaddy)

Add these A records pointing to your Lightsail Static IP:

| Type | Name | Value |
|------|------|-------|
| A | api | `<Your-Lightsail-Static-IP>` |

> [!TIP]
> **Future Staging**: When ready, add `A | staging | <Same-IP>` for staging subdomain.

Wait 5-10 minutes for DNS propagation. Verify with:
```bash
dig api.learnspirepro.in
```

---

## Phase 3: Server Setup

SSH into your Lightsail instance:

```bash
ssh ubuntu@<your-lightsail-ip>
```

### Update System & Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## Phase 4: MySQL Installation

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
```

When prompted:
- Set root password: **Y** (choose a strong password)
- Remove anonymous users: **Y**
- Disallow root login remotely: **Y**
- Remove test database: **Y**
- Reload privilege tables: **Y**

### Create Database & User

```bash
sudo mysql
```

Run these SQL commands:
```sql
-- Create production database
CREATE DATABASE learnspire_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create app user with password
CREATE USER 'learnspire'@'localhost' IDENTIFIED BY 'Le@rnspire@2026';

-- Grant privileges
GRANT ALL PRIVILEGES ON learnspire_prod.* TO 'learnspire'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT user, host FROM mysql.user;

EXIT;
```

> [!TIP]
> **Future Staging**: Add `CREATE DATABASE learnspire_staging ...` and `GRANT ALL PRIVILEGES ON learnspire_staging.* ...` when ready.

Test the connection:
```bash
mysql -u learnspire -p -e "SHOW DATABASES;"
```

---

## Phase 5: Clone & Build Application

### Setup SSH Key for GitHub
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Display public key
cat ~/.ssh/id_ed25519.pub

# Add this key to GitHub: Settings → SSH and GPG keys → New SSH Key
```

### Clone and Build
```bash
# Create directory structure
mkdir -p ~/apps/learnspire/prod
cd ~/apps/learnspire/prod

# Clone repository
git clone git@github.com:norbit-solutions/acca-lms-project.git learnspire-project

# Navigate to backend
cd learnspire-project/backend

# Install dependencies
npm install

# Build for production
npm run build

# Install production dependencies in build folder
cd build && npm install --production
```

---

## Phase 6: Environment Configuration

Create the production `.env` file:

```bash
nano ~/apps/learnspire/prod/learnspire-project/backend/build/.env
```

```env
TZ=UTC
PORT=3333
HOST=0.0.0.0
NODE_ENV=production
APP_KEY=ZeUy1PZZXsKZ7NW3uCeCqOSGVvKridfLZcf5d3SSCe4=

CORS_ORIGIN=https://learnspirepro.in,https://www.learnspirepro.in

# MySQL on localhost
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=learnspire
DB_PASSWORD=Le@rnspire@2026
DB_DATABASE=learnspire_prod

# Mux

MUX_SIGNING_KEY_ID="EHf2M5zGbBLszcohIvcQJmgsAjLC4f00Q1AwmAlHUmjA"
MUX_SIGNING_PRIVATE_KEY="LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBbjBtcDBQZFhueS92OHN3OHNxSmpqVm9FeWRDZEQ2M2hSM1BHVGF3N3g1RWpFWnpVCjhKd2puSERhdkptS1FzN1pKSGNuNG81TnRQeEF0VCt4anJJTzk1L0VYb3NJN254NHZpMk1LZzlQOWlYVWtvblQKVlZWYUN1VmlKRk0zRTlPOVRMLzhwRGd0Y3FsaDdBNUx5Y3o0ZUhaWXF1Tmo2S1RBV09ubHRMeTJrbWhqakJZRAp4a09WVG02NE9qaHN1b2JaRGhMd2RiWHp0VXhoRjBPU3V4eG5rL0NlSVZxOTh3Mld5UldUZ2cvSUVNb0hDNjhiClhqWDM4NXROdFpPT1g2eHpvbjlZNERCeHM1S3BjODc1Nmx6NVdGZ2lwcFpuOU82cEtkeHcvWDF6Rkc1Q0NsbjYKNzAzREo2VXFRaXlwUys1TjlLLzdRenBOUTBGSHEzMElsajJVS1FJREFRQUJBb0lCQUE2bG9tbzhaRXFYWGpRYgpBd3NyYUREQThmeHd6MlhOWFJBZlNFRXZoa0VLbjk2VEVrMmNhS0NPWVdsdG9QWVZ1VEtPTm1wY2RZUWY4ZjlOCi83dHZDaUNoQ0szbmtRY0ZCbXY1R2p0cWliVnpzeGFxZW5hMyszMzhWbkwxVXArTng5NjlMMTVyd0FURzB6ZEwKOVR6SzQvVGRHbUxVWXEvV0tTTVpRWmh3c0pwenZtMjQ3TEdMNDRPcy9pMmpVS1hubE84NmxuOGxDZUFXc1BsMQp2UjJRMG04UjJWMFZHcSt3UEZKVHVreW1vYjdlUnhic0pOMFpXdnBlZUp3SDdueUoxbnRVYklrMXo5ajhCV0pHCkRqN1d0aXlpTHRLellscFFKR1lQY2ZKeFpMTTkzenJVUlBpSC9JamlPYytXM08vRGhIWklvUkFFaEhUZkJKbWMKczRhSGVwVUNnWUVBeWJBR1hMVmFOdUFTNHl0enNINHcxZTlmR0tiNksrZTdsSVg4Sy9aRGlqTWIxdlFqSmV3Tgp1cGRlNjNockdJOFowUG54MWJWYXBrbUltajdHeThkYVc5aWpPR3dxczJOTlBtK2ppNGlvQlY0dDg0UFlLZUhhCnVPRGxvdEwyeFlwSVNHRFZjVzRnYmozalFrK3R1SFExMXVnL0t6NzRtUFJ4a3lRTldaaVY5V01DZ1lFQXlpNnIKa05DU1lZVzNLQ0xwVjFKWVd2M0NGZVdORFNkVW9WZ3ltcXExMVM4bFJoaW1xVUU2bjcvT3lYQjZDR0hlb1RYSAo3ZmhYa2dUNXp2dnNqa3ZKTGFVQlZMdk1tdVRKb1JFaXdkKzd2RE0rTnlRZlBKbS9XOHM2c0R5Smt4cW42cGdxCklpL2ZLaytiWEhNMTdGc0pOZG1TNVROeEUvVHlEVHEwUk9UTnZBTUNnWUVBbll0am5OMklwOTdtd2c3NklyNmYKOVMwemtuVTBiRUZxOUh5bzI4cFZQY25va0VOS2hWL2I1WXBDZWhzcFJSamJLTE5sWmZOdzZQMzl0OGNiMEtoYgplKzFBcWwxTUNhNmk4d2VQci9wQ2pWYmcvQnhjS1hNa1FGQms4SWhzZlNna2lHMGpyYVJCcnZ1bTN2Q1FtY29sCkdFZDR1SlpLNkdmaG8vZUFlaUZIMmxNQ2dZQkQ0NFBzYm55WWpvTy8wR2sxendxb0V3azJ2UXV0M1FVSDRFdXQKcjZDNjRzZkxUNysybVphTHlhWXY4YnFvVWVTbGtSOS9BcUswLzBLNmc5RWN2c25ncjhWUXBIYkJsQTA0TGo3VApoc0xOSVEvRkNEWU03VHRhSVZXbGs4NUdQTzhoVU5MbEE5b1ZwUUZ2KzZlaG83Zm1BeGJXSzMzT3k3THpTa0Q1CjJUSlQ3UUtCZ0d3ZXFhR05WSjRWZjI2YjJrUjZMeFV2V213cDUrbm9CWVVkVzFSZm9WUkh4SjRKc1haM0dPVDYKdUszc0o5L21qUXpHMkVMT2JFcmhHWlZ5Ukg3dFQ3OVRDVUIxYmdaN2Z2YWRyazlERGR2SkJRVGJseGpkTWZkNApReXJ6MVlsa096eW9oMjE0aHFuVVQzVGlMaWRxQzlvTTlxV3E3ZGgzc3hIdFVHM0t0VWN6Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg"
MUX_TOKEN_ID="e3c528c7-3221-4c79-bbbb-e6dcb00cfd86"
MUX_TOKEN_SECRET="l8McllzBt1rtxEM3mxrd6BFA2gWKSV0eohA/wPwnTSWcKwnp9d5CF4biE8mSX3wxFr7Wh63i6Ij"


# R2 Storage
S3_ACCESS_KEY="4010360603b8c39bde068c73b65009a5"
S3_BUCKET="learnspire"
S3_ENDPOINT="7ce76d40d90f29f0b43d6f1d705a21b4.r2.cloudflarestorage.com"
S3_PUBLIC_ENDPOINT="pub-21b67f544eae4559b7436b81b0250a58.r2.dev"
S3_SECRET_KEY="4e8ae86a86a2000f9a5ce93644469cc0791beb1975113a8a610b196fb8a46feb"
```

> [!TIP]
> Generate APP_KEY with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## Phase 7: Run Migrations

```bash
cd ~/apps/learnspire/prod/learnspire-project/backend
node ace migration:run
node ace db:seed
```

---

## Phase 8: PM2 Configuration

Create PM2 ecosystem file:

```bash
nano ~/apps/learnspire/ecosystem.config.cjs
```

```javascript
module.exports = {
  apps: [
    {
      name: 'learnspire-prod',
      cwd: '/home/ubuntu/apps/learnspire/prod/learnspire-project/backend/build',
      script: 'bin/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      }
    }
    // Future: Add learnspire-staging app on port 4444
  ]
};
```

Start the application:
```bash
pm2 start ~/apps/learnspire/ecosystem.config.cjs
pm2 save
pm2 startup  # Follow the instructions to enable auto-start on reboot
```

Verify it's running:
```bash
pm2 status
curl http://localhost:3333/health
```

---

## Phase 9: Nginx Configuration

Remove default config and create production config:

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create production config
sudo nano /etc/nginx/sites-available/learnspire-prod
```

```nginx
server {
    listen 80;
    server_name api.learnspirepro.in;

    location / {
        proxy_pass http://localhost:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for video uploads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        
        # Increase body size for uploads
        client_max_body_size 100M;
    }
}
```

Enable config and restart:
```bash
sudo ln -s /etc/nginx/sites-available/learnspire-prod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Phase 10: SSL Certificate

> [!IMPORTANT]
> DNS must be configured and propagated BEFORE running certbot.

```bash
# Verify DNS is working
dig api.learnspirepro.in

# Get SSL certificate
sudo certbot --nginx -d api.learnspirepro.in

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## Deployment Script

Create a deployment script for easy updates:

```bash
nano ~/apps/learnspire/deploy-prod.sh
```

```bash
#!/bin/bash
set -e
echo "🚀 Deploying to PRODUCTION..."
cd ~/apps/learnspire/prod/learnspire-project
git pull origin main
cd backend
npm install
npm run build
cd build && npm install --production
pm2 restart learnspire-prod
echo "✅ Production deployed!"
```

Make it executable:
```bash
chmod +x ~/apps/learnspire/deploy-prod.sh
```

**Usage:**
```bash
~/apps/learnspire/deploy-prod.sh
```

---

## Post-Deployment Checklist

- [ ] DNS A record added in GoDaddy for `api`
- [ ] MySQL database created and user configured
- [ ] SSL certificate installed and working
- [ ] Health check: `curl https://api.learnspirepro.in/health`
- [ ] Update Mux webhook URL to `https://api.learnspirepro.in/webhooks/mux`
- [ ] Update Vercel `NEXT_PUBLIC_API_URL` to `https://api.learnspirepro.in`
- [ ] Update R2 CORS policy with new domain
- [ ] Test admin login
- [ ] Test video upload and playback
- [ ] Test image uploads

---

## Monitoring & Maintenance

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs learnspire-prod
pm2 logs learnspire-prod --lines 100

# Monitor resources
pm2 monit

# Restart app
pm2 restart learnspire-prod

# Check Nginx status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check MySQL status
sudo systemctl status mysql
```

---

## Database Backup

```bash
# Create backup directory
mkdir -p ~/backups

# Create backup script
nano ~/apps/learnspire/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)

# Backup production database
mysqldump -u learnspire -pYOUR_PASSWORD learnspire_prod > $BACKUP_DIR/prod_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x ~/apps/learnspire/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add this line:
0 2 * * * ~/apps/learnspire/backup-db.sh >> ~/backups/backup.log 2>&1
```

---

## Troubleshooting

### App not starting?
```bash
pm2 logs learnspire-prod --lines 50
# Check for missing .env variables
```

### MySQL connection refused?
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

### Nginx 502 Bad Gateway?
```bash
# Check if app is running
pm2 status
# Check app port
curl http://localhost:3333/health
```

### SSL certificate error?
```bash
# Check DNS propagation first
dig api.learnspirepro.in
# Re-run certbot
sudo certbot --nginx -d api.learnspirepro.in
```

---

## Cost Breakdown

| Resource | Monthly Cost |
|----------|-------------|
| Lightsail Instance ($10-20) | ~$10-20 |
| MySQL (on same instance) | $0 |
| Cloudflare R2 (free tier) | $0 |
| Domain (GoDaddy) | ~$10/year |
| Vercel (free tier) | $0 |
| **Total** | **~$10-20/mo** |

---

## Future: Adding Staging Environment

When you're ready to add staging:

1. **DNS**: Add A record for `staging.learnspirepro.in` pointing to same IP
2. **MySQL**: Create `learnspire_staging` database
3. **Clone**: `git clone` to `~/apps/learnspire/staging/`
4. **Env**: Create `.env` with `PORT=4444` and `DB_DATABASE=learnspire_staging`
5. **PM2**: Add `learnspire-staging` app in ecosystem config
6. **Nginx**: Create config for `staging.learnspirepro.in` → `localhost:4444`
7. **SSL**: Run `certbot --nginx -d staging.learnspirepro.in`
