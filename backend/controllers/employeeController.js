const prisma = require("../config/prisma");
const { timeToMinutes, minutesToTime, getDayOfWeek, isOverlapping } = require("../utils/timeUtils");

const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { name: "asc" }
        });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz çalışan ID'si"});
        }

        const employee = await prisma.employee.findUnique({
            where: { id }
        });

        if (!employee) {
            return res.status(404).json({ message: "Çalışan bulunamadı" });
        }

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, phone, serviceIds } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Çalışan adı zorunludur"});
        }

        if (serviceIds && serviceIds.length > 0) {
            const services = await prisma.service.findMany({
                where: { id: { in: serviceIds} }
            });
        if (services.length !== serviceIds.length) {
            return res.status(400).json({ message: "Bir veya daha fazla hizmet bulunamadı"})
        }
    }

        const employee = await prisma.employee.create({
            data: {
                name,
                phone,

                employeeServices: serviceIds
                 ? {
                    create: serviceIds.map((serviceId) => ({ serviceId }))
                   }
            
                : undefined
            },
            include: {
                employeeServices: {
                    include: { service: true }
                }
            }
        });

        res.status(201).json(employee);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, service } =req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz çalışan ID'si"  });
    }

    const existing = await prisma.employee.findUnique({ where: { id } });

    if (!existing) {
        return res.status(404).json({ message: "Çalışan bulunamadı" });
    }

    const employee = await prisma.employee.update({
        where: { id },
        data: {
            name: name ?? existing.name,
            email: email ?? existing.email,
            service: service ?? existing.service
        }
    });

    res.json(employee);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Geçersiz çalışan id'si" });
        }

        const existing = await prisma.employee.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ message: "Çalışan bulunamadı" });
        }

        await prisma.employee.delete({ where: { id } });

        res.json({ message: "Çalışan silindi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
}; 

const setWorkingHours = async (req, res) => {
    try {
        const employeeId = Number(req.params.id);
        const { workingHours } = req.body;

        if (isNaN(employeeId)) {
            return res.status(400).json({ message: "Geçersiz çalışan ID'si"});
        }

        const employee = await prisma.employee.findUnique({ where: { id: employeeId} });

        if (!employee) {
            return res.status(404).json({ message: "Çalışan bulunamadı" });
        }

        if (!Array.isArray(workingHours)) {
            return res.status(400).json({ message: "workingHours bir dizi olmalıdır" });
        }

        const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

        for (const wh of workingHours) {
            if (!Number.isInteger(wh.dayOfWeek) || wh.dayOfWeek < 1 || wh.dayOfWeek > 7) {
                return res.status(400).json({ message: "dayOfWeek 1 ile 7 arasında olmalıdır" });
            }

            if (!timePattern.test(wh.startTime) || !timePattern.test(wh.endTime)) {
                return res.status(400).json({ message: "Saatler HH:MM formatında olmalıdır" });
            }

            if (wh.startTime >= wh.endTime) {
                return res.status(400).json({ message: "Başlangıç saati bitiş sattinden önce olmalıdır" });
            }
       }

       const days = workingHours.map((wh) => wh.dayOfWeek);
       if (new Set(days).size !== days.length) {
        return res.status(400).json({ message: "Aynı gün birden fazla kez tanımlanamaz" });
       }

       await prisma.$transaction([
        prisma.workingHour.deleteMany({ where: { employeeId } }),
        prisma.workingHour.createMany({
            data: workingHours.map((wh) => ({
                employeeId,
                dayOfWeek: wh.dayOfWeek,
                startTime: wh.startTime,
                endTime: wh.endTime
            }))
        })
       ]);

       const updated = await prisma.workingHour.findMany({
        where: { employeeId },
        orderBy: { dayOfWeek: "asc" }
       });

       res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }

};

const getAvailability = async (req, res) => {
    try {
        const employeeId = Number(req.params.id);
        const { date, serviceId } = req.query;

        if (isNaN(employeeId)) {
            return res.status(400).json({ message: "Geçersiz çalışan ID'si " });
        }

        if (!date || !serviceId) {
            return res.status(400).json({ message: "date ve serviceId paramterleri zorunludur" });
        }

        const targetDate = new Date(date + "T00:00:00");
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ message: "Geçersiz tarih formatı (YYYY-MM-DD bekleniyor"});
        }

        const service = await prisma.service.findUnique({
            where: { id: Number(serviceId) }
        });

        if (!service) {
            return res.status(400).json({ message: "Hizmet bulunamadı" });
        }

        const canProvide = await prisma.employeeService.findFirst ({
            where: { employeeId, serviceId: Number(serviceId) }
        });

        if (!canProvide) {
            return res.status(400).json({ message: "Buçalışan seçilen hizmeti vermemektedir" });
        }

        const dayOfWeek = getDayOfWeek(targetDate);

        const workingHour = await prisma.workingHour.findFirst({
            where: { employeeId, dayOfWeek }
        });

        if (!workingHour) {
            return res.json({ date, slots: [] });
        }

        const dayStart = new Date(targetDate);
        const dayEnd = new Date(targetDate);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                employeeId,
                status: { not: "CANCELED" },
                startTime: { gte: dayStart, lt: dayEnd }
            }
        });

        const busySlots = appointments.map((apt) => ({
            start: apt.startTime.getHours() * 60 + apt.startTime.getMinutes(),
            end: apt.endTime.getHours() * 60 + apt.endTime.getMinutes()
        }));

        const workStart = timeToMinutes(workingHour.startTime);
        const workEnd = timeToMinutes(workingHour.endTime);

        const slotStep = 15;
        const duration = service.duration;

        const availableSlots = [];

        for (let start = workStart; start + duration <= workEnd; start += slotStep) {
            const end = start + duration;

            const hasConflict = busySlots.some((busy) =>
                isOverlapping(start, end, busy.start, busy.end)
        );

        if (!hasConflict) {
            availableSlots.push({
                sartTime: minutesToTime(start),
                endTime: minutesToTime(end)
            });
        }
    }
    res.json({
        date,employeeId,
        serviceId: Number(serviceId),
        duration,
        slots: availableSlots
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setWorkingHours,
    getAvailability
};