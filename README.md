# 🏪 Aplikasi Manajemen UMKM - Hackathon Project

Aplikasi manajemen produk, transaksi, dan keuangan untuk UMKM (Usaha Mikro Kecil Menengah) dengan fitur lengkap untuk tracking produk, manajemen stok, buku kas, dan laporan keuangan.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Dokumentasi API](#-dokumentasi-api)
- [Struktur Proyek](#-struktur-proyek)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## ✨ Fitur Utama

### 🔐 Authentication & Authorization

- **Register & Login**: Sistem autentikasi dengan validasi password yang kuat
- **Role-Based Access Control**: Dua level akses (Admin & User)
  - **Admin**: Akses penuh ke semua fitur
  - **User**: Hanya bisa mengelola buku kas dan pembayaran

### 📦 Product Management

- **CRUD Products**: Create, Read, Update, Delete produk
- **Stock Management**: Update stok dengan tracking history
- **Import/Export**: Import dan export produk via CSV
- **Low Stock Alerts**: Notifikasi produk dengan stok rendah

### 💰 Transaction Management

- **Transaction Log**: Pencatatan semua transaksi
- **Payment Methods**: Multiple payment methods (Cash, QRIS, E-Wallet, dll)
- **Transaction Status**: Tracking status transaksi (Pending, Success, Failed)
- **Statistics**: Statistik transaksi dan revenue

### 📊 Dashboard & Analytics

- **Comprehensive Dashboard**: Overview lengkap dengan metrics utama
- **Chart Data Provider**: Visualisasi data dengan berbagai chart
  - Revenue Time Series
  - Transaction Time Series
  - Stock Distribution
  - Payment Methods Distribution
  - Top Selling Products
  - Low Stock Alerts

### 📝 Logs System

- **Activity Logs**: Log semua aktivitas sistem
- **Stock History**: History perubahan stok produk
- **System Logs**: Log sistem dengan filtering

### 💵 Cash Book (Buku Kas)

- **Pemasukan & Pengeluaran**: Pencatatan kas masuk dan keluar
- **Kategori & Deskripsi**: Organisasi transaksi dengan kategori
- **Statistics**: Statistik total masuk, keluar, dan balance

### 🏢 Operasional Management

- **Biaya Operasional**: Manajemen biaya operasional (listrik, gas, dll)
- **Periode**: Monthly dan Annual operasional costs
- **Statistics**: Total biaya operasional

### 📈 Rekap & Laporan

- **Rekap Lengkap**: Summary semua data (penjualan, produk, operasional, keuangan)
- **Rekap Penjualan**: Laporan penjualan dengan filter tanggal
- **Rekap Produk**: Laporan produk dan inventory
- **Rekap Operasional**: Laporan biaya operasional
- **Rekap Keuangan**: Laporan keuangan lengkap

### 💼 HPP (Harga Pokok Penjualan)

- **HPP Calculation**: Perhitungan HPP otomatis
- **HPP per Produk**: Detail HPP untuk setiap produk
- **Laba Kotor & Bersih**: Kalkulasi laba kotor dan bersih
- **Margin Calculation**: Perhitungan margin profit

### 👥 Ranking System

- **Role Statistics**: Statistik distribusi role user
- **User Management**: Manajemen user dan role

### 🤖 AI/ML Features (Cutting Edge)

- **Sales Prediction**: Prediksi penjualan menggunakan Linear Regression
- **Product Recommendations**: Rekomendasi produk berbasis ML
- **Trend Analysis**: Analisis trend penjualan dengan berbagai metrik
- **Growth Rate Calculation**: Perhitungan growth rate otomatis
- **Confidence Scoring**: Skor kepercayaan untuk predictions

### 🔔 Real-time Notifications

- **Low Stock Alerts**: Notifikasi otomatis untuk stok rendah
- **Transaction Notifications**: Notifikasi untuk setiap transaksi
- **System Notifications**: Notifikasi sistem untuk admin
- **Unread Count**: Tracking notifikasi yang belum dibaca
- **Broadcast Notifications**: Broadcast ke semua user (admin only)

### 💾 Redis Caching

- **Performance Optimization**: Caching untuk meningkatkan response time
- **Cache-aside Pattern**: Implementasi cache-aside pattern
- **TTL Support**: Time-to-live untuk cache expiration
- **Pattern-based Deletion**: Hapus cache berdasarkan pattern

### 📊 Advanced Monitoring

- **System Health**: Monitoring kesehatan sistem
- **Performance Metrics**: Tracking response time dan error rate
- **Slow Endpoints**: Identifikasi endpoint yang lambat
- **Memory Monitoring**: Tracking penggunaan memory
- **Database & Cache Status**: Monitoring koneksi database dan cache

### 🚀 CI/CD Pipeline

- **Automated Testing**: Testing otomatis pada setiap push/PR
- **Docker Build**: Automated Docker image building
- **Coverage Reporting**: Test coverage reporting
- **Automated Deployment**: Deployment otomatis untuk main branch

---

## 🛠 Teknologi yang Digunakan

### Backend

- **AdonisJS 6**: Modern Node.js framework
- **TypeScript**: Type safety
- **PostgreSQL**: Database
- **Lucid ORM**: Database ORM
- **VineJS**: Validation
- **Inertia.js**: Server-side rendering dengan Vue

### Frontend

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Build tool dan dev server
- **TailwindCSS**: Utility-first CSS framework

### DevOps & Infrastructure

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Node.js 22**: Runtime environment

### Tools & Libraries

- **Swagger/OpenAPI**: API documentation
- **ESLint & Prettier**: Code quality
- **Japa**: Testing framework
- **ml-regression**: Machine learning untuk sales prediction
- **simple-statistics**: Statistical analysis
- **GitHub Actions**: CI/CD pipeline

---

## 📋 Persyaratan Sistem

### Untuk Development

- **Node.js**: >= 20.x
- **npm**: >= 9.x
- **PostgreSQL**: >= 14.x
- **Git**: Latest version

### Untuk Production (Docker)

- **Docker**: >= 20.x
- **Docker Compose**: >= 2.x

---

## 🚀 Instalasi

### Metode 1: Menggunakan Docker (Recommended)

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd hackaton
   ```

2. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

3. **Edit file `.env`** dan sesuaikan konfigurasi:

   ```env
   NODE_ENV=production
   PORT=3333
   HOST=0.0.0.0
   APP_KEY=your-app-key-here
   LOG_LEVEL=info
   SESSION_DRIVER=cookie

   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=hackaton
   DB_PASSWORD=hackaton123
   DB_DATABASE=hackaton
   ```

4. **Generate APP_KEY** (jika belum ada):

   ```bash
   node ace generate:key
   ```

5. **Build dan jalankan dengan Docker Compose**

   ```bash
   docker-compose up -d
   ```

6. **Aplikasi akan otomatis menjalankan migration** saat pertama kali dijalankan

7. **Akses aplikasi** di `http://localhost:3333`

### Metode 2: Instalasi Manual

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd hackaton
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup database PostgreSQL**

   ```bash
   # Buat database
   createdb hackaton

   # Atau menggunakan psql
   psql -U postgres
   CREATE DATABASE hackaton;
   ```

4. **Copy environment file**

   ```bash
   cp .env.example .env
   ```

5. **Edit file `.env`** dan sesuaikan:

   ```env
   NODE_ENV=development
   PORT=3333
   HOST=0.0.0.0
   APP_KEY=your-app-key-here
   LOG_LEVEL=debug
   SESSION_DRIVER=cookie

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_DATABASE=hackaton
   ```

6. **Generate APP_KEY**

   ```bash
   node ace generate:key
   ```

7. **Jalankan migration**
   ```bash
   node ace migration:run
   ```

---

## ⚙️ Konfigurasi

### Environment Variables

File `.env` berisi konfigurasi penting:

| Variable         | Deskripsi                                 | Default       |
| ---------------- | ----------------------------------------- | ------------- |
| `NODE_ENV`       | Environment (development/production/test) | `development` |
| `PORT`           | Port aplikasi                             | `3333`        |
| `HOST`           | Host aplikasi                             | `0.0.0.0`     |
| `APP_KEY`        | Application encryption key                | **Required**  |
| `LOG_LEVEL`      | Log level (debug/info/warn/error)         | `info`        |
| `SESSION_DRIVER` | Session driver (cookie/memory)            | `cookie`      |
| `DB_HOST`        | Database host                             | `localhost`   |
| `DB_PORT`        | Database port                             | `5432`        |
| `DB_USER`        | Database user                             | `postgres`    |
| `DB_PASSWORD`    | Database password                         | **Required**  |
| `DB_DATABASE`    | Database name                             | `hackaton`    |

### Generate APP_KEY

```bash
node ace generate:key
```

Copy output ke file `.env` sebagai nilai `APP_KEY`.

---

## 🏃 Cara Menjalankan

### Development Mode

#### Menggunakan Docker Compose (Development)

```bash
# Jalankan dengan profile dev
docker-compose --profile dev up app-dev

# Atau jalankan semua services
docker-compose --profile dev up
```

#### Manual Development

```bash
# Install dependencies (jika belum)
npm install

# Jalankan migration
node ace migration:run

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3333` dengan hot-reload enabled.

### Production Mode

#### Menggunakan Docker Compose

```bash
# Build dan jalankan
docker-compose up -d

# Lihat logs
docker-compose logs -f app

# Stop aplikasi
docker-compose down

# Stop dan hapus volumes
docker-compose down -v
```

#### Manual Production

```bash
# Build aplikasi
npm run build

# Jalankan migration
node ace migration:run --force

# Start aplikasi
npm start
```

### Docker Commands

```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Remove containers and volumes
docker-compose down -v

# Rebuild dan restart
docker-compose up -d --build
```

---

## 📚 Dokumentasi API

### Interactive API Documentation

Aplikasi menyediakan Swagger UI untuk dokumentasi API interaktif:

- **Swagger UI**: `http://localhost:3333/api-docs`
- **OpenAPI JSON**: `http://localhost:3333/api-docs.json`
- **OpenAPI YAML**: Lihat file `openapi.yaml`

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

#### Products

- `GET /api/products` - List semua produk
- `GET /api/products/:id` - Detail produk
- `POST /api/products` - Create produk (Admin)
- `PUT /api/products/:id` - Update produk (Admin)
- `PATCH /api/products/:id/stock` - Update stok
- `DELETE /api/products/:id` - Delete produk (Admin)
- `GET /api/products/export` - Export CSV
- `POST /api/products/import` - Import CSV

#### Transactions

- `GET /api/transactions/my-transactions` - Transaksi user
- `GET /api/transactions/statistics` - Statistik transaksi (Admin)
- `GET /api/transactions/status/:status` - Transaksi by status (Admin)

#### Cash Book (Buku Kas)

- `GET /api/cash-books` - List cash book entries
- `POST /api/cash-books` - Create entry (User)
- `GET /api/cash-books/statistics` - Statistik cash book
- `PUT /api/cash-books/:id` - Update entry
- `DELETE /api/cash-books/:id` - Delete entry

#### Operasional

- `GET /api/operasional` - List biaya operasional
- `POST /api/operasional` - Create operasional (Admin)
- `GET /api/operasional/statistics` - Statistik operasional
- `PUT /api/operasional/:id` - Update (Admin)
- `DELETE /api/operasional/:id` - Delete (Admin)

#### Rekap

- `GET /api/rekap` - Rekap lengkap
- `GET /api/rekap/penjualan` - Rekap penjualan
- `GET /api/rekap/produk` - Rekap produk
- `GET /api/rekap/operasional` - Rekap operasional
- `GET /api/rekap/keuangan` - Rekap keuangan

#### HPP

- `GET /api/hpp/calculate` - Calculate HPP
- `GET /api/hpp/product/:productId` - HPP per produk

#### AI/ML (Cutting Edge)

- `GET /api/ai/predict-sales` - Sales prediction dengan ML
- `GET /api/ai/recommendations` - Product recommendations
- `GET /api/ai/trends` - Trend analysis

#### Notifications (Real-time)

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

#### Monitoring (Observability)

- `GET /api/monitoring/health` - System health check
- `GET /api/monitoring/metrics` - Performance metrics
- `GET /api/monitoring/slow-endpoints` - Top slow endpoints

#### Dashboard

- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/stats` - General statistics
- `GET /api/dashboard/revenue-timeseries` - Revenue chart
- `GET /api/dashboard/top-selling-products` - Top products

Lihat `API_DOCUMENTATION.md` untuk dokumentasi lengkap.

---

## 📁 Struktur Proyek

```
hackaton/
├── app/
│   ├── controllers/      # HTTP Controllers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── validators/      # Request validators
│   ├── middleware/      # HTTP middleware
│   └── exceptions/      # Exception handlers
├── config/              # Configuration files
├── database/
│   └── migrations/      # Database migrations
├── resources/           # Frontend resources
├── start/               # Application startup files
├── tests/               # Test files
├── public/              # Public assets
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Dependencies
└── README.md           # This file
```

---

## 🧪 Testing

```bash
# Run semua tests
npm test

# Run specific test suite
node ace test --suite=functional

# Run dengan coverage
node ace test --coverage
```

---

## 🚢 Deployment

### Docker Deployment

1. **Build production image**

   ```bash
   docker build -t hackaton:latest .
   ```

2. **Run container**
   ```bash
   docker run -d \
     --name hackaton-app \
     -p 3333:3333 \
     --env-file .env \
     hackaton:latest
   ```

### Docker Compose Deployment

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# Dengan custom env file
docker-compose --env-file .env.production up -d
```

### Environment Variables untuk Production

Pastikan set environment variables berikut di production:

```env
NODE_ENV=production
APP_KEY=<strong-random-key>
DB_PASSWORD=<strong-password>
```

---

## 📸 Screenshots

> **Note**: Screenshots aplikasi akan ditambahkan setelah deployment atau saat demo.

### Dashboard Overview

![Dashboard](screenshots/dashboard.png)

### Product Management

![Products](screenshots/products.png)

### Transaction History

![Transactions](screenshots/transactions.png)

### Cash Book

![Cash Book](screenshots/cashbook.png)

---

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the UNLICENSED license.

---

## 👥 Tim

- **Developer**: [Your Name]
- **Project**: Hackathon UMKM Management System

---

## 🆘 Troubleshooting

### Database Connection Error

- Pastikan PostgreSQL running
- Check credentials di `.env`
- Pastikan database sudah dibuat

### Port Already in Use

```bash
# Change PORT di .env atau
# Kill process menggunakan port
lsof -ti:3333 | xargs kill -9
```

### Migration Error

```bash
# Rollback migration
node ace migration:rollback

# Run migration lagi
node ace migration:run
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down -v
docker-compose up -d --build
```

---

## 📞 Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.

---

**Happy Coding! 🚀**
