
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const serviceRoutes = require("./routes/serviceRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/employees", employeeRoutes);


app.get("/", (req, res) => {
    res.json({message: "Randevu sistemi API çalışıyor" });
});

app.listen(PORT, () => {
    console.log = ('Sunucu ${PORT} portunda çalışıyor');
});