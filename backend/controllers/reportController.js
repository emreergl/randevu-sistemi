const prisma = require("../config/prisma");

const getSummary = async (req, res) => {
    try {
      const now = new Date();
      
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalAppointments, todayAppointments, pendingAppointments, totalCustomers, totalServices, totalEmployees] = await Promise.all([
        prisma.appointment.count(),
        prisma.appointment.count({
            where: { startTime: { gte: todayStart, lt: todayEnd } }
        }),
        prisma.appointment.count({
            where: { status: "PENDING" }
        }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.service.count(),
        prisma.employee.count()
      ]);

      const montlyAppointments = await prisma.appointment.findMany({
        where: {
            status: "COMPLETED",
            startTime: { gte: monthStart }
        },
        include: { service: true }
      });

      const monthlyRevenue = montlyAppointments.reduce(
        (total, apt) => total + apt.service.price,
        0
      );

      res.json({
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        totalCustomers,
        totalEmployees,
        totalServices,
        monthlyRevenue
      });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

const getRevenue = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: "COMPLETED",
        startTime: { gte: startDate }
      },
      include: { service: true },
      orderBy: { startTime: "asc" }
    });

    const revenueByMonth = {};

    appointments.forEach((apt) => {
      const date = new Date(apt.startTime);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!revenueByMonth[key]) {
      revenueByMonth[key] = { month: key, revenue: 0, count: 0 };
    }
      revenueByMonth[key].revenue += apt.service.price;
      revenueByMonth[key].count += 1;
    });

    res.json(Object.values(revenueByMonth));
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getPopularServices = async (req, res) => {
  try {
  const grouped = await prisma.appointment.groupBy({
  by: ["serviceId"],
  where: { status: { not: "CANCELLED" } },
  _count: { id: true },
  orderBy: { _count: { id: "desc" } },
  take: 5
  });

  const result = await Promise.all(
    grouped.map(async (item) => {
      const service = await prisma.service.findUnique({
        where: { id: item.serviceId }
      });

      return{
        serviceId: item.serviceId,
        serviceName: service ? service.name : "Bilinmiyor",
        appointmentCount: item._count.id
      };
    })
  );

  res.json(result);

} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Sunucu hatası" });
  }
};

const getOccupancy = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date parametresi zorunludur" });
    }

    const dayStart = new Date(date + "T00:00:00");

    if (isNaN(dayStart.getTime())) {
      return res.status(400).json({ message: "Geçersiz tarih formatı" });
    }

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const jsDay = dayStart.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;

    const employees = await prisma.employee.findMany({
      include: {
        workingHours: { where: { dayOfWeek } },
        appointments: {
          where: {
            status: { not: "CANCELLED" },
            startTime: { gte: dayStart, lt: dayEnd }
          }
        }
      }
    });

    const result = employees.map((emp) => {
      const wh = emp.workingHours[0];

      if (!wh) {
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          working: false,
          totalMinutes: 0,
          bookedMinutes: 0,
          occupancyRate: 0
        };
      }

      const [startH, startM] = wh.startTime.split(":").map(Number);
      const [endH, endM] = wh.endTime.split(":").map(Number);
      const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);

      const bookedMinutes = emp.appointments.reduce((sum, apt) => {
        const diff = (apt.endTime - apt.startTime) / 60000;
        return sum + diff;
      }, 0);

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        working: true,
        totalMinutes,
        bookedMinutes,occupancyRate: Math.round ((bookedMinutes / totalMinutes) * 100)
      };
    })

    res.json({ date, employees: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
module.exports = { getSummary, getRevenue, getPopularServices, getOccupancy };