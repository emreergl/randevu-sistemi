# Kadın Kuaför Çetin — Randevu Yönetim Sistemi

Kadın kuaför salonları için geliştirilen full stack web uygulaması. Müşteriler online randevu alabilir, işletme sahibi hizmetleri, çalışanları ve tüm randevu akışını tek panelden yönetebilir.

## Canlı Demo

- **Site:** https://randevu-sistemi-pi.vercel.app
- **API:** https://randevu-sistemi-backend.onrender.com

> Not: Backend ücretsiz planda barındırıldığı için, uzun süre kullanılmadığında "uyku moduna" geçer. İlk istek 30-50 saniye sürebilir, sonraki istekler normal hızda çalışır.

## Kullanıcı Rolleri

- **Müşteri:** Hizmetleri görüntüler, müsait saatlere randevu alır, randevusunu iptal eder, profil bilgilerini günceller
- **Admin (İşletme Sahibi):** Hizmet, çalışan ve müşteri yönetimi yapar, tüm randevuları takip eder, doluluk ve gelir raporlarını görür

> Not: Çalışanlar sistemde veri olarak tutulur (hizmet ve çalışma saati bilgileriyle), giriş yapan bir kullanıcı rolü değildir. Randevu ataması admin tarafından yönetilir.

## Öne Çıkan Teknik Özellikler

- Çalışma saatleri ve mevcut randevulara göre dinamik müsaitlik hesaplama
- Çakışan randevu oluşturulmasını engelleyen doğrulama mantığı (hem çalışan hem müşteri bazında)
- JWT tabanlı rol bazlı yetkilendirme
- Rol bazlı veri filtreleme (müşteri yalnızca kendi kayıtlarına erişir)
- Otomatik e-posta bildirimleri (randevu oluşturma, onaylama, iptal)
- Zamanlanmış görev (cron job) ile randevu hatırlatma e-postaları
- Yönetim paneli için gelir, doluluk ve popülerlik raporları (grafiklerle)
- Responsive tasarım (mobil ve masaüstü)
- Bulut veritabanı (Neon/PostgreSQL) ve production deploy (Render + Vercel)

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React, React Router, Tailwind CSS, Chart.js |
| Backend | Node.js, Express |
| Veritabanı | PostgreSQL (Neon), Prisma ORM |
| Kimlik Doğrulama | JWT, bcrypt |
| Diğer | Nodemailer, node-cron |
| Barındırma | Render (backend), Vercel (frontend), Neon (veritabanı) |

## Ekran Görüntüleri

## Ana Sayfa
![Ana Sayfa](screenshots/ana-sayfa-1.png)

### Randevu Alma - Tarih ve Çalışan Seçimi
![Randevu Tarih Seçimi](screenshots/randevu-alma-akisi-1.png)

### Randevu Alma - Saat Seçimi
![Randevu Saat Seçimi](screenshots/randevu-alma-akisi-2.png)

### Randevularım
![Randevularım](screenshots/musteri-randevularim.png)

### Yönetim Paneli - Dashboard
![Admin Dashboard](screenshots/admin-paneli.png)

### Yönetim Paneli
![Admin Randevu Yönetimi](screenshots/admin-randevular.png)

### Giriş Sayfası
![Giriş Sayfası](screenshots/login.png)

### Kayıt Sayfası
![Kayıt Olma Sayfası](screenshots/register.png)

## API Endpoint'leri

Tüm istekler `/api` öneki ile başlar. Korumalı endpoint'ler için `Authorization: Bearer <token>` başlığı gereklidir.

### Kimlik Doğrulama

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| POST | `/auth/register` | Yeni kullanıcı kaydı | Herkese açık |
| POST | `/auth/login` | Giriş, JWT token döner | Herkese açık |
| GET | `/auth/me` | Giriş yapmış kullanıcı bilgisi | Giriş gerekli |
| PUT | `/auth/me` | Ad ve telefon günceller | Giriş gerekli |
| PUT | `/auth/me/password` | Şifre değiştirir | Giriş gerekli |
| GET | `/auth/customers` | Tüm müşterileri listeler | Admin |

### Hizmetler

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| GET | `/services` | Hizmetleri listeler | Herkese açık |
| GET | `/services/:id` | Hizmet detayı | Herkese açık |
| POST | `/services` | Hizmet ekler | Admin |
| PUT | `/services/:id` | Hizmet günceller | Admin |
| DELETE | `/services/:id` | Hizmet siler | Admin |

### Çalışanlar

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| GET | `/employees` | Çalışanları listeler | Herkese açık |
| GET | `/employees/:id` | Çalışan detayı | Herkese açık |
| POST | `/employees` | Çalışan ekler (hizmet ataması dahil) | Admin |
| PUT | `/employees/:id` | Çalışan günceller (hizmet ataması dahil) | Admin |
| DELETE | `/employees/:id` | Çalışan siler (randevu kaydı yoksa) | Admin |
| GET | `/employees/:id/working-hours` | Çalışma saatlerini getirir | Herkese açık |
| PUT | `/employees/:id/working-hours` | Çalışma saatlerini tanımlar | Admin |
| GET | `/employees/:id/availability` | Müsait saatleri hesaplar | Herkese açık |

Müsaitlik sorgusu `?date=YYYY-MM-DD&serviceId=1` parametrelerini alır.

### Randevular

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| POST | `/appointments` | Randevu oluşturur | Giriş gerekli |
| GET | `/appointments` | Randevuları listeler | Role göre filtreli |
| GET | `/appointments/:id` | Randevu detayı | Sahibi veya admin |
| PATCH | `/appointments/:id/status` | Durum günceller (beklemede/onaylandı/tamamlandı/iptal/gelmedi) | Admin |
| DELETE | `/appointments/:id` | Randevu iptal eder | Sahibi veya admin |

Listeleme sorgusu `?status=&employeeId=&date=` parametreleriyle filtrelenebilir.

### Raporlar

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| GET | `/reports/summary` | Genel özet istatistikleri | Admin |
| GET | `/reports/revenue` | Aylık gelir raporu | Admin |
| GET | `/reports/popular-services` | En çok tercih edilen hizmetler | Admin |
| GET | `/reports/occupancy` | Çalışan bazında doluluk oranı | Admin |

## Yerel Kurulum

### Gereksinimler

- Node.js 18 veya üzeri
- Git
- PostgreSQL veritabanı (Neon gibi bir bulut sağlayıcı önerilir)

### Backend

```
git clone https://github.com/emreergl/randevu-sistemi.git
cd randevu-sistemi/backend
npm install
```

`backend` klasöründe `.env` dosyası oluşturun:

```
PORT=5000
DATABASE_URL="postgresql://kullanici:sifre@host/veritabani?sslmode=require"
JWT_SECRET=gizli-anahtar
JWT_EXPIRES_IN=7d
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
MAIL_FROM=randevu@salon.com
MAIL_ENABLED=false
```

Veritabanını oluşturun:

```
npx prisma generate
npx prisma migrate deploy
```

Sunucuyu başlatın:

```
npm run dev
```

Backend `http://localhost:5000` adresinde çalışır.

### Frontend

```
cd ../frontend
npm install
```

`frontend` klasöründe `.env` dosyası oluşturun:

```
VITE_API_URL=http://localhost:5000/api
```

Sunucuyu başlatın:

```
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışır.

> E-posta bildirimlerini denemek için `MAIL_ENABLED=true` yapın ve SMTP bilgilerini doldurun. Devre dışı bırakıldığında bildirimler gönderilmez, yalnızca konsola yazdırılır.

## Kapsam Notu

Sistem tek işletme için tasarlanmıştır. Çok işletmeli (multi-tenant) yapıya geçiş için `Business` tablosu eklenmesi ve `Service`, `Employee`, `Appointment` tablolarına `businessId` alanı ile filtreleme uygulanması yeterlidir.

## Proje Yapısı

```
randevu-sistemi/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/          (e-posta servisi, hatırlatma zamanlayıcısı)
│   └── prisma/
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        ├── services/    (API çağrıları)
        ├── context/     (kimlik doğrulama durumu)
        └── hooks/
```