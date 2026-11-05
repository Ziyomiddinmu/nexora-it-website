
const express = require("express");
const app = express();

app.use(express.json({ limit: "10kb" }));

// Asosiy sahifa
app.get("/", (req, res) => {
    res.send("NEXORA IT backend ishlayapti!");
});

// Server holatini tekshirish
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "NEXORA IT server faol"
    });
});

// Buyurtmalarni qabul qilish
app.post("/api/order", async (req, res) => {
    try {
        const { name, phone, service, message } = req.body;

        if (!name || !phone || !service) {
            return res.status(400).json({
                success: false,
                message: "Ism, telefon va xizmat turi majburiy!"
            });
        }

        if (
            typeof name !== "string" ||
            typeof phone !== "string" ||
            typeof service !== "string" ||
            (message !== undefined && typeof message !== "string")
        ) {
            return res.status(400).json({
                success: false,
                message: "Ma'lumotlar formati noto'g'ri!"
            });
        }

        if (
            name.length > 100 ||
            phone.length > 30 ||
            service.length > 100 ||
            (message && message.length > 1000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Ma'lumotlar juda uzun!"
            });
        }

        console.log("Yangi buyurtma:", {
            name,
            phone,
            service,
            message: message || "Izoh yo'q"
        });

        return res.json({
            success: true,
            message: "Buyurtmangiz qabul qilindi!"
        });

    } catch (error) {
        console.error("Xatolik:", error);

        return res.status(500).json({
            success: false,
            message: "Serverda xatolik yuz berdi"
        });
    }
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
});
