const cron = require("node-cron");
const prisma = require("../config/prisma");
const nodemailer = require("nodemailer");
const { sendMail } = require("./emailService");

const checkAndSendReminders = async () => {
    console.log("[CRON] Hatırlatma kontrolü başladı:", new Date().toISOString());

    try {
        const tomorrowStart = new Date();
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);

        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                status: "CONFIRMED",
                startTime: { gte: tomorrowStart, lt: tomorrowEnd },
                reminderSent: false
            },
            include: {
                service: true,
                employee: true,
                customer: { select: { name: true, email: true } }
            }
        });

        console.log(`[CRON] ${appointments.length} randevu için hatırlatma gönderilecek`);

        for (const apt of appointments) {
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0;">Randevu Hatırlatması</h2>
                    </div>
                    <div style="padding: 24px; background-color: #f9f9f9;">
                        <p>Yarınki randevunuzu hatırlatmak isteriz.</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Hizmet</strong></td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${apt.service.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Çalışan</strong></td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${apt.employee.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px;"><strong>Saat</strong></td>
                                <td style="padding: 8px;">${apt.startTime.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `;

            await sendMail(apt.customer.email, "Yarınki Randevu Hatırlatması", html);
            await prisma.appointment.update({
                where: { id: apt.id },
                data: { reminderSent: true }
            });
        }

        console.log("[CRON] Hatırlatma kontrolü tamamlandı");
    }   catch (error) {
        console.error("[CRON] Hatırlatma gönderiminde hata:", error);
    }
};

const startReminderJob = () => {
    cron.schedule("*/1 * * * *", checkAndSendReminders);
    console.log("Randevu hatırlatma zamanlayıcı başlatıldı (her gün 09:00)");
};

module.exports = { startReminderJob, checkAndSendReminders };