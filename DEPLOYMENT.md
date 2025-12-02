# 🚀 Deployment Guide

Panduan lengkap untuk deployment aplikasi Hackaton.

## 📋 Daftar Isi

- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Health Checks](#health-checks)
- [Monitoring](#monitoring)

---

## Prerequisites

- Docker >= 20.x
- Docker Compose >= 2.x
- PostgreSQL >= 14.x (jika tidak menggunakan Docker)
- Node.js >= 20.x (untuk manual deployment)

---

## Docker Deployment

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd hackaton

# 2. Create .env file
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai

# 3. Generate APP_KEY
node ace generate:key
# Copy output ke .env sebagai APP_KEY

# 4. Start services
docker-compose up -d

# 5. Check logs
docker-compose logs -f app
```

### Production Deployment

```bash
# Build production image
docker-compose build

# Start services
docker-compose up -d

# Run migrations (otomatis di startup, atau manual)
docker-compose exec app node ace migration:run --force

# Check status
docker-compose ps
```

### Environment Variables untuk Production

Pastikan set environment variables berikut:

```env
NODE_ENV=production
APP_KEY=<strong-random-key-generate-with-ace-generate-key>
DB_PASSWORD=<strong-password>
LOG_LEVEL=info
```

---

## Manual Deployment

### 1. Install Dependencies

```bash
npm ci --only=production
```

### 2. Build Application

```bash
npm run build
```

### 3. Setup Database

```bash
# Create database
createdb hackaton

# Run migrations
node ace migration:run --force
```

### 4. Start Application

```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start bin/server.js --name hackaton

# Or using node directly
node bin/server.js
```

---

## Database Setup

### Using Docker

Database akan otomatis dibuat saat pertama kali menjalankan `docker-compose up`.

### Manual Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE hackaton;

-- Create user (optional)
CREATE USER hackaton_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE hackaton TO hackaton_user;
```

---

## Health Checks

### Application Health

```bash
# Check if app is running
curl http://localhost:3333

# Check API docs
curl http://localhost:3333/api-docs
```

### Database Health

```bash
# Using Docker
docker-compose exec postgres pg_isready -U hackaton

# Manual
psql -U hackaton -d hackaton -c "SELECT 1"
```

---

## Monitoring

### View Logs

```bash
# Docker logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

### Resource Usage

```bash
# Container stats
docker stats hackaton-app hackaton-db
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose up -d --build
```

### Database connection issues

```bash
# Check database is running
docker-compose ps postgres

# Test connection
docker-compose exec app node -e "require('pg').Pool({host:'postgres',user:'hackaton',password:'hackaton123',database:'hackaton'}).query('SELECT 1',(e,r)=>process.exit(e?1:0))"
```

### Migration errors

```bash
# Rollback
docker-compose exec app node ace migration:rollback

# Run again
docker-compose exec app node ace migration:run --force
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale app instances
docker-compose up -d --scale app=3
```

**Note**: Pastikan menggunakan load balancer dan shared session storage untuk production.

---

## Backup & Restore

### Database Backup

```bash
# Backup
docker-compose exec postgres pg_dump -U hackaton hackaton > backup.sql

# Restore
docker-compose exec -T postgres psql -U hackaton hackaton < backup.sql
```

---

## Security Checklist

- [ ] Change default passwords
- [ ] Use strong APP_KEY
- [ ] Enable HTTPS in production
- [ ] Set proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database backups
- [ ] Rate limiting enabled
- [ ] Input validation enabled

---

## Performance Optimization

1. **Enable caching** (Redis recommended)
2. **Database indexing** (already in migrations)
3. **CDN for static assets**
4. **Load balancing** for multiple instances
5. **Database connection pooling** (configured in Lucid)

---

**Happy Deploying! 🚀**
