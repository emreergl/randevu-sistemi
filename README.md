# Randevu Yönetim Sistemi

Kuaför salonları için geliştirilen full stack web uygulaması. Müşteriler online randevu alabilir, işletme sahibi hizmetleri, çalışanları ve tüm randevu akışını tek panelden yönetebilir.

## Kullanıcı Rolleri

- **Müşteri:** Hizmetleri görüntüler, müsait saatlere randevu alır, randevusunu iptal eder
- **Admin (İşletme Sahibi):** Hizmet ve çalışan yönetimi yapar, tüm randevuları takip eder, doluluk ve gelir raporlarını görür

> Not: Çalışanlar sistemde veri olarak tutulur (hizmet ve çalışma saati bilgileriyle), giriş yapan bir kullanıcı rolü değildir. Randevu ataması admin tarafından yönetilir.

## User Stories

### Müşteri
- Hizmetleri ve fiyatları görmek istiyorum ki hangi hizmeti alacağıma karar verebileyim
- Seçtiğim çalışanın müsait saatlerini görmek istiyorum ki uygun bir zaman seçebileyim
- Randevumu iptal edebilmek istiyorum ki planım değişirse mağdur olmayayım
- Geçmiş ve yaklaşan randevularımı görmek istiyorum ki takibini yapabileyim
- Randevum onaylandığında e-posta almak istiyorum ki bilgim olsun

### Admin
- Hizmet ekleyip düzenlemek istiyorum ki müşteriler güncel seçenekleri görsün
- Çalışan ekleyip çalışma saatlerini tanımlamak istiyorum ki müsaitlik doğru hesaplansın
- Tüm randevuları tarih ve çalışana göre filtreleyerek görmek istiyorum
- Randevu durumunu güncellemek istiyorum (onayla / iptal et / tamamlandı)
- Haftalık doluluk ve gelir istatistiklerini görmek istiyorum ki işletmeyi değerlendirebileyim

## Öne Çıkan Teknik Özellikler

- Çalışma saatleri ve mevcut randevulara göre dinamik müsaitlik hesaplama
- Çakışan randevu oluşturulmasını engelleyen doğrulama mantığı
- JWT tabanlı rol bazlı yetkilendirme
- Rol bazlı veri filtreleme (müşteri yalnızca kendi kayıtlarına erişir)
- Otomatik e-posta bildirimleri
- Yönetim paneli için gelir, doluluk ve popülerlik raporları

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Veritabanı | SQLite (Prisma ORM) |
| Kimlik Doğrulama | JWT, bcrypt |
| Diğer | Nodemailer, Chart.js |

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
| POST | `/employees` | Çalışan ekler | Admin |
| PUT | `/employees/:id` | Çalışan günceller | Admin |
| DELETE | `/employees/:id` | Çalışan siler | Admin |
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
| PATCH | `/appointments/:id/status` | Durum günceller | Admin |
| DELETE | `/appointments/:id` | Randevu iptal eder | Sahibi veya admin |

Listeleme sorgusu `?status=&employeeId=&date=` parametreleriyle filtrelenebilir.

### Raporlar

| Metod | Endpoint | Açıklama | Erişim |
|---|---|---|---|
| GET | `/reports/summary` | Genel özet istatistikleri | Admin |
| GET | `/reports/revenue` | Aylık gelir raporu | Admin |
| GET | `/reports/popular-services` | En çok tercih edilen hizmetler | Admin |
| GET | `/reports/occupancy` | Çalışan bazında doluluk oranı | Admin |

## Kurulum

### Gereksinimler

- Node.js 18 veya üzeri
- Git

### Adımlar

Depoyu klonlayın:

```
git clone https://github.com/KULLANICI-ADIN/randevu-sistemi.git
cd randevu-sistemi/backend
```

Bağımlılıkları yükleyin:

```
npm install
```

`backend` klasöründe `.env` dosyası oluşturun:

```
PORT=5000
DATABASE_URL="file:./dev.db"
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

Uygulama `http://localhost:5000` adresinde çalışır.

> E-posta bildirimlerini denemek için `MAIL_ENABLED=true` yapın ve SMTP bilgilerini doldurun. Devre dışı bırakıldığında bildirimler gönderilmez, yalnızca konsola yazdırılır.

## Kapsam Notu

Sistem tek işletme için tasarlanmıştır. Çok işletmeli (multi-tenant) yapıya geçiş için `Business` tablosu eklenmesi ve `Service`, `Employee`, `Appointment` tablolarına `businessId` alanı ile filtreleme uygulanması yeterlidir.

Geliştirme ortamında SQLite kullanılmıştır. Prisma ORM sayesinde PostgreSQL'e geçiş, yalnızca datasource tanımının güncellenmesiyle mümkündür.

## Yapılacaklar

- Frontend geliştirme (React, Tailwind CSS)
  - Giriş ve kayıt ekranları
  - Hizmet listeleme ve randevu alma akışı
  - Müşteri randevu yönetimi
  - Yönetim paneli: hizmet, çalışan ve randevu yönetimi
  - Grafik ve raporlama ekranı (Chart.js)
- Randevu hatırlatma bildirimleri (zamanlanmış görev)
- Responsive tasarım
- Yayına alma (deploy)