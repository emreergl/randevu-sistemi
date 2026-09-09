const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const buildTemplate = (title, message, appointment) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Kuaför Randevu Sistemi</h2>
      </div>
      <div style="padding: 24px; background-color: #f9f9f9;">
        <h3 style="color: #2c3e50;">${title}</h3>
        <p>${message}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Hizmet</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointment.service.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Çalışan</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${appointment.employee.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tarih ve Saat</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${formatDateTime(appointment.startTime)}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Ücret</strong></td>
            <td style="padding: 8px;">${appointment.service.price} TL</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px; text-align: center; color: #888; font-size: 12px;">
        Bu e-posta otomatik olarak gönderilmiştir.
      </div>
    </div>
  `;
};

const sendMail = async (to, subject, html) => {
    if (process.env.MAIL_ENABLED !== "true") {
        console.log(`[MAIL] ${to} → ${subject}`);
        return;
    }
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    });
    console.log(`E-posta gönderildi: ${to} - ${subject}`);
  } catch (error) {
    console.error("E-posta gönderilemedi:", error.message);
  }
};

const sendAppointmentCreated = async (appointment) => {
  const html = buildTemplate(
    "Randevunuz Oluşturuldu",
    "Randevu talebiniz alınmıştır. Onaylandığında tarafınıza bilgi verilecektir.",
    appointment
  );
  await sendMail(appointment.customer.email, "Randevunuz Oluşturuldu", html);
};

const sendAppointmentConfirmed = async (appointment) => {
  const html = buildTemplate(
    "Randevunuz Onaylandı",
    "Randevunuz onaylanmıştır. Belirtilen tarih ve saatte sizi bekliyoruz.",
    appointment
  );
  await sendMail(appointment.customer.email, "Randevunuz Onaylandı", html);
};

const sendAppointmentCancelled = async (appointment) => {
  const html = buildTemplate(
    "Randevunuz İptal Edildi",
    "Randevunuz iptal edilmiştir. Yeni bir randevu oluşturmak için sistemi kullanabilirsiniz.",
    appointment
  );
  await sendMail(appointment.customer.email, "Randevunuz İptal Edildi", html);
};

module.exports = {
  sendAppointmentCreated,
  sendAppointmentConfirmed,
  sendAppointmentCancelled,
  sendMail
};