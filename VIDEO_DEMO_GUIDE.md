# 🎬 Panduan Video Demo - Hackathon

Panduan lengkap untuk membuat video demo yang efektif dan mendapatkan skor maksimal.

## 📊 Penilaian Video Demo (40% dari Total Nilai!)

### Kriteria Penilaian:

1. **Video Demo: Storytelling** (0-30 poin)
   - Masalah (Problem) & Solusi (Solution) dijelaskan dengan sangat jelas
   - Alur cerita menarik, audio jelas, visual mendukung

2. **Kualitas Demo Produk** (0-25 poin)
   - Video menampilkan aplikasi yang berjalan real (bukan mockup)
   - Fitur-fitur unggulan didemokan dengan jelas dalam durasi waktu

3. **Dokumentasi Teknis (README)** (0-25 poin)
   - Instruksi instalasi langkah-demi-langkah
   - Penjelasan fitur dan cara penggunaan
   - Screenshots aplikasi di dalam README

---

## 🎯 Struktur Video Demo (Rekomendasi: 3-5 menit)

### Bagian 1: Introduction & Problem (30-45 detik)

**Apa yang harus ditampilkan:**

- **Masalah yang diselesaikan**:
  - UMKM kesulitan mengelola produk, stok, dan keuangan secara terintegrasi
  - Pencatatan manual yang rawan error
  - Tidak ada visibility terhadap cash flow dan profitabilitas
  - Kesulitan tracking biaya operasional

**Script Saran:**

> "UMKM seringkali kesulitan mengelola bisnis mereka karena harus mencatat produk, stok, transaksi, dan keuangan secara terpisah. Aplikasi kami menyediakan solusi terintegrasi untuk mengelola semua aspek bisnis UMKM dalam satu platform."

---

### Bagian 2: Solution Overview (30-45 detik)

**Apa yang harus ditampilkan:**

- **Solusi yang ditawarkan**:
  - Aplikasi manajemen UMKM terintegrasi
  - Dua role: Admin (full access) dan User (buku kas & pembayaran)
  - Dashboard real-time untuk monitoring bisnis

**Script Saran:**

> "Aplikasi kami menyediakan sistem manajemen terintegrasi dengan role-based access control. Admin dapat mengelola semua aspek bisnis, sementara User fokus pada pencatatan keuangan harian. Semua data terintegrasi dalam dashboard real-time."

---

### Bagian 3: Feature Demo - Core Features (2-3 menit)

**Prioritas Fitur untuk Ditampilkan:**

#### 3.1 Authentication & Role System (20 detik)

- Register user baru
- Login sebagai Admin
- Login sebagai User
- Tunjukkan perbedaan akses

**Demo Script:**

> "Sistem menggunakan role-based access control. Mari kita lihat perbedaan antara akses Admin dan User."

#### 3.2 Product Management (30 detik)

- Create produk baru
- Update stok produk
- Lihat stock history
- Low stock alerts
- Import/Export CSV

**Demo Script:**

> "Admin dapat mengelola produk dengan mudah. Sistem otomatis tracking perubahan stok dan memberikan alert untuk produk dengan stok rendah."

#### 3.3 Transaction Management (30 detik)

- Create transaksi
- Lihat transaction history
- Filter by status
- Payment methods
- Transaction statistics

**Demo Script:**

> "Semua transaksi tercatat dengan detail, termasuk metode pembayaran. Admin dapat melihat statistik dan analisis transaksi."

#### 3.4 Cash Book (Buku Kas) - User Feature (30 detik)

- Login sebagai User
- Tambah pemasukan (masuk)
- Tambah pengeluaran (keluar)
- Lihat statistik (total masuk, keluar, balance)
- Filter by kategori

**Demo Script:**

> "User dapat mencatat pemasukan dan pengeluaran harian. Sistem otomatis menghitung balance dan menyediakan statistik keuangan."

#### 3.5 Operasional Management (20 detik)

- Tambah biaya operasional (listrik, gas, dll)
- Set periode (monthly/annual)
- Lihat total biaya operasional

**Demo Script:**

> "Admin dapat mengelola biaya operasional seperti listrik dan gas. Sistem mendukung biaya bulanan dan tahunan."

#### 3.6 Rekap & Laporan (30 detik)

- Rekap lengkap (semua data)
- Rekap penjualan dengan filter tanggal
- Rekap produk
- Rekap keuangan
- Summary (pendapatan, pengeluaran, laba bersih)

**Demo Script:**

> "Sistem menyediakan berbagai laporan rekap. Mari kita lihat rekap penjualan dan keuangan untuk periode tertentu."

#### 3.7 HPP (Harga Pokok Penjualan) (30 detik)

- Calculate HPP untuk periode
- HPP per produk
- Lihat laba kotor dan laba bersih
- Margin calculation

**Demo Script:**

> "Fitur HPP menghitung harga pokok penjualan secara otomatis, termasuk biaya operasional. Kita bisa melihat laba kotor, laba bersih, dan margin profit."

#### 3.8 Dashboard & Analytics (30 detik)

- Dashboard overview
- Revenue charts
- Transaction charts
- Top selling products
- Low stock alerts

**Demo Script:**

> "Dashboard menyediakan visualisasi data real-time. Kita bisa melihat trend penjualan, produk terlaris, dan alert stok rendah."

---

### Bagian 4: Technical Highlights (30-45 detik)

**Apa yang harus disebutkan:**

- Tech stack: AdonisJS, Vue 3, TypeScript, PostgreSQL
- API Documentation dengan Swagger
- Testing dengan coverage
- Docker containerization
- Pre-commit hooks untuk quality checks

**Script Saran:**

> "Aplikasi dibangun dengan teknologi modern seperti AdonisJS dan Vue 3. Kami juga menyediakan API documentation lengkap, testing dengan coverage, dan containerization dengan Docker."

---

### Bagian 5: Conclusion (15-30 detik)

**Apa yang harus disebutkan:**

- Ringkasan manfaat
- Call to action (jika ada)
- Link repository/deployment

**Script Saran:**

> "Aplikasi ini membantu UMKM mengelola bisnis mereka dengan lebih efisien dan terintegrasi. Semua kode tersedia di repository GitHub, dan aplikasi dapat di-deploy menggunakan Docker."

---

## 📋 Checklist Sebelum Rekaman

### Persiapan Aplikasi

- [ ] Pastikan aplikasi berjalan tanpa error
- [ ] Siapkan data sample (produk, transaksi, cash book entries)
- [ ] Pastikan database sudah terisi dengan data demo
- [ ] Test semua fitur yang akan didemo
- [ ] Siapkan 2 akun: 1 Admin, 1 User

### Persiapan Recording

- [ ] Gunakan screen recording tool (OBS, Loom, atau built-in recorder)
- [ ] Pastikan resolusi minimal 1080p
- [ ] Test audio dan microphone
- [ ] Siapkan script/narasi
- [ ] Siapkan browser dengan tab yang sudah dibuka

### Data Demo yang Perlu Disiapkan

- [ ] 5-10 produk dengan berbagai stok
- [ ] 10-15 transaksi dengan berbagai status
- [ ] 5-7 cash book entries (masuk & keluar)
- [ ] 3-5 biaya operasional
- [ ] Data untuk berbagai periode (untuk rekap)

---

## 🎥 Tips untuk Video Demo

### Visual

1. **Gunakan zoom/besar font** untuk memudahkan melihat detail
2. **Highlight cursor** saat mengklik/mengetik
3. **Gunakan transitions** yang smooth antar fitur
4. **Tampilkan loading states** jika ada (menunjukkan real app)

### Audio

1. **Gunakan microphone berkualitas baik**
2. **Rekam di ruangan tenang**
3. **Bicara dengan jelas dan tidak terlalu cepat**
4. **Gunakan background music yang soft** (opsional)

### Content

1. **Jangan terlalu cepat** - beri waktu untuk viewer memahami
2. **Tunjukkan error handling** jika terjadi (menunjukkan robustness)
3. **Tampilkan fitur unik** seperti HPP calculation
4. **Tunjukkan perbedaan role** (Admin vs User)

---

## 📝 Script Template untuk Video Demo

### Opening (30 detik)

```
"Halo, saya [Nama] dari tim [Nama Tim]. Hari ini saya akan mempresentasikan
aplikasi manajemen UMKM yang kami buat untuk hackathon ini.

Masalah yang sering dihadapi UMKM adalah kesulitan mengelola produk, stok,
transaksi, dan keuangan secara terintegrasi. Pencatatan manual seringkali
menyebabkan error dan tidak efisien.

Aplikasi kami menyediakan solusi terintegrasi dengan role-based access control,
dimana Admin dapat mengelola semua aspek bisnis, sementara User fokus pada
pencatatan keuangan harian."
```

### Feature Demo (2-3 menit)

```
"Mari kita mulai dengan melihat fitur-fitur utama:

[Demo Authentication & Role]
"Pertama, sistem autentikasi dengan dua role. Admin memiliki akses penuh,
sedangkan User hanya bisa mengelola buku kas."

[Demo Product Management]
"Admin dapat mengelola produk dengan mudah. Sistem otomatis tracking
perubahan stok dan memberikan alert untuk produk dengan stok rendah."

[Demo Cash Book - User]
"Sekarang mari login sebagai User. User dapat mencatat pemasukan dan
pengeluaran harian. Sistem otomatis menghitung balance."

[Demo Rekap & HPP]
"Fitur rekap menyediakan berbagai laporan. Dan yang unik, kami memiliki
fitur HPP yang menghitung harga pokok penjualan secara otomatis."

[Demo Dashboard]
"Dashboard menyediakan visualisasi data real-time untuk monitoring bisnis."
```

### Closing (30 detik)

```
"Aplikasi ini membantu UMKM mengelola bisnis mereka dengan lebih efisien.
Kami menggunakan teknologi modern seperti AdonisJS, Vue 3, dan TypeScript.
Aplikasi juga sudah dilengkapi dengan testing, Docker containerization,
dan API documentation lengkap.

Terima kasih, dan silakan cek repository kami untuk detail lebih lanjut."
```

---

## 🎯 Poin-Poin Penting untuk Ditampilkan

### Wajib Ditampilkan (High Priority):

1. ✅ **Authentication & Role System** - Tunjukkan perbedaan Admin vs User
2. ✅ **Product Management** - CRUD + Stock Management
3. ✅ **Cash Book (User Feature)** - Pemasukan & Pengeluaran
4. ✅ **Dashboard** - Visualisasi data
5. ✅ **Rekap** - Laporan lengkap
6. ✅ **HPP** - Fitur unik untuk UMKM

### Opsional (Jika Ada Waktu):

7. ⚠️ Transaction Management
8. ⚠️ Operasional Management
9. ⚠️ Logs System
10. ⚠️ Import/Export CSV

---

## 📊 Skor Target untuk Video Demo

| Kriteria        | Target Skor  | Cara Mencapai                          |
| --------------- | ------------ | -------------------------------------- |
| Storytelling    | 25-30/30     | Problem & Solution jelas, alur menarik |
| Kualitas Demo   | 20-25/25     | Aplikasi real, fitur ditampilkan jelas |
| **Total Video** | **45-55/55** | **Excellent!**                         |

---

## ✅ Final Checklist Sebelum Upload

- [ ] Video durasi 3-5 menit
- [ ] Audio jelas dan tidak ada noise
- [ ] Visual jelas (resolusi baik)
- [ ] Semua fitur utama ditampilkan
- [ ] Problem & Solution dijelaskan
- [ ] Aplikasi berjalan real (bukan mockup)
- [ ] Tidak ada error saat demo
- [ ] Transitions smooth
- [ ] Script jelas dan mudah dipahami

---

## 🚀 Rekomendasi Tools untuk Recording

1. **OBS Studio** (Free, Open Source)
   - Best untuk screen recording
   - Support multiple sources
   - High quality output

2. **Loom** (Free tier available)
   - Easy to use
   - Built-in editing
   - Direct sharing

3. **QuickTime** (Mac) / **Xbox Game Bar** (Windows)
   - Built-in screen recorder
   - Simple and fast

4. **Zoom/Google Meet Recording**
   - Jika sudah familiar
   - Easy sharing

---

**Good Luck dengan Video Demo! 🎬✨**
