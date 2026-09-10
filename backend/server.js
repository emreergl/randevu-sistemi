process.env.TZ = "Europe/Istanbul";
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;
const serviceRoutes = require("./routes/serviceRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const cors = require("cors");
const app = express();
const  { startReminderJob } = require("./utils/reminderService");

app.use(cors({
    origin: "https://randevu-sistemi-pi.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/reports", reportRoutes);


app.get("/", (req, res) => {
    res.json({message: "Randevu sistemi API çalışıyor" });
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
    startReminderJob();
});