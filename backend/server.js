
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Randevu sistemi API çalışıyor" });
});

app.listen(PORT, () => {
    console.log("Sunucu ${PORT} portunda çalışıyor");
});