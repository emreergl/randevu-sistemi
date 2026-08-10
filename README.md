# Randevu Yönetim Sistemi

Kuaför salonları için geliştirilen full stack web uygulaması. Müşteriler
online randevu alabilir, işletme sahibi hizmetleri, çalışanları ve tüm
randevu akışını tek panelden yönetebilir.

## Kullanıcı Rolleri

- **Müşteri:** Hizmetleri görüntüler, müsait saatlere randevu alır, randevusunu iptal eder
- **Admin (İşletme Sahibi):** Hizmet ve çalışan yönetimi yapar, tüm randevuları takip eder, doluluk ve gelir raporlarını görür

> Not: Çalışanlar sistemde veri olarak tutulur (hizmet ve çalışma saati bilgileriyle),
> giriş yapan bir kullanıcı rolü değildir. Randevu ataması admin tarafından yönetilir.

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
- Otomatik e-posta bildirimleri ve randevu hatırlatma (cron job)

## Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Veritabanı | PostgreSQL (Prisma ORM) |
| Kimlik Doğrulama | JWT |
| Diğer | Nodemailer, Chart.js, node-cron |

## Kurulum

> Proje geliştirme aşamasındadır. Kurulum adımları tamamlandıkça güncellenecektir.