const prisma = require("../config/prisma");
const { timeToMinutes, getDayOfWeek, isOverlapping } = require("../utils/timeUtils");

const createAppointment = async (req, res) => {
    try {
        const { serviceId, employeeId, startTime } = req.body;
        const customerId = req.user.userId;

        if (!serviceId || !employeeId || !startTime) {
            return res.status(400).json({ message: "serviceId, employeeId ve startTime zorunludur"});
        }

        const start = new Date(startTime);
        if (isNaN(start.getTime())) {
            return res.status(400).json({ message: "Geçersiz tarih formatı" });
        }

        if (start < new Date()) {
            return res.status(400).json({ message: "Geçmiş bir tarihte randevu oluşturulamaz" });
        }

        const service = await prisma.service.findUnique({
            where: { id: Number(serviceId) }
        });

        if (!service) {
            return res.status(404).json({ message: "Hizmet bulunamadı" });
        }

        const employee = await prisma.employee.findUnique({
            where: { id: Number(employeeId) }
        });

        if (!employee) {
            return res.status(404).json({ message:"Çalışan bulunamadı" });
        }

        const canProvide = await prisma.employeeService.findFirst({
            where: { employeeId: Number(employeeId), serviceId: Number(serviceId) }
        });

        if (!canProvide) {
            return res.status(400).json({ message: "Bu çalışan seçilen hizmeti vermemektedir" });
        }

        const end = new Date(start.getTime() + service.duration * 60000);

        const dayOfWeek = getDayOfWeek(start);

        const workingHour = await prisma.workingHour.findFirst({
            where: { employeeId: Number(employeeId), dayOfWeek }
        });

        if (!workingHour) {
            return res.status(400).json({ message: "Çalışan seçilen günde çalışmamaktadır" });
        }

        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        const workStart = timeToMinutes(workingHour.startTime);
        const workEnd = timeToMinutes(workingHour.endTime);

        if (startMinutes < workStart || endMinutes > workEnd) {
            return res.status(400).json({ message: "Seçilen saat çalışma saatleri dışındadır" });
        }

        const dayStart = new Date(start); //çakışma check
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const existingAppointments = await prisma.appointment.findMany({
            where: {
                employeeId: Number(employeeId),
                status: { not: "CANCELLED" },
                startTime: { gte: dayStart, lt: dayEnd }
            }
        });

        const hasConflict = existingAppointments.some((apt) =>
        isOverlapping(start.getTime(), end.getTime(), apt.startTime.getTime(), apt.endTime.getTime())
    );

    if (hasConflict) {
        return res.status(409).json({ message: "Seçilen saat aralığı dolu" });
    }

    const appointment = await prisma.appointment.create({
        data: {
            customerId,
            serviceId: Number(serviceId),
            employeeId: Number(employeeId),
            startTime: start,
            endTime: end
        },
        include: {
            service: true,
            employee: true
        }
    });

    res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

module.exports = { createAppointment };