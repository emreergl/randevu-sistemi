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

const getAppointments = async (req, res) => {
    try {
        const where = {};

        if (req.user.role !== "ADMIN") {
            where.customerId = req.user.userId;
        }

        const { status, employeeId, date } = req.query;

        if (status) {
            where.status = status;
        }

        if (employeeId) {
            where.employeeId = Number(employeeId);
        }

        if(date) {
            const dayStart = new Date(date + "T00:00:00");
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            where.startTime = { gte: dayStart, lt: dayEnd };
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                service: true,
                employee: true,
                customer: {
                    select: { id: true, name: true, email: true, phone: true }
                }
            },
            orderBy: { startTime: "asc" }
        });

        res.json(appointments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Sunucu hatası" });
        }        
};

const getAppointmentById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz radenvu ID'si" });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                service: true,
                employee: true,
                customer: {
                    select: { id: true, name: true, email: true, phone: true }
                }
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: "Randevu bulunamadı" });
        }

        if (req.user.role !== "ADMIN" && appointment.customerId !== req.user.userId) {
            return res.status(403).json({ message: "Bu randevuya erişim yetkiniz yok" });
        }

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const updateAppointmentStatus = async (req,res) => {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz randevu ID'si" });
        }

        const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'status şu değerlerden biri olmalıdır: ${validStatuses.join(", ")}'
            });
        }

        const existing = await prisma.appointment.findUnique({ where: { id} });

        if (!existing) {
            return res.status(404).json({ message: "Randevu bulunamadı" });
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status },
            include: {
                service: true,
                employee: true,
                customer: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const cancelAppointment = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz randevu ID'si" });
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Randevu bulunamadı" });
    }

    if (req.user.role !== "ADMIN" && existing.customerId !== req.user.userId) {
      return res.status(403).json({ message: "Bu randevuyu iptal etme yetkiniz yok" });
    }

    if (existing.status === "CANCELLED") {
      return res.status(400).json({ message: "Randevu zaten iptal edilmiş" });
    }

    if (existing.status === "COMPLETED") {
      return res.status(400).json({ message: "Tamamlanmış randevu iptal edilemez" });
    }

    const hoursUntilAppointment = (existing.startTime - new Date()) / (1000 * 60 * 60);

    if (req.user.role !== "ADMIN" && hoursUntilAppointment < 24) {
      return res.status(400).json({
        message: "Randevuya 24 saatten az kaldığı için iptal edilemez"
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" }
    });

    res.json({ message: "Randevu iptal edildi", appointment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

module.exports = { createAppointment, getAppointments, getAppointmentById, updateAppointmentStatus, cancelAppointment };