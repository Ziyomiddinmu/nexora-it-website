const express = require("express");
const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
res.send("NEXORA IT backend ishlayapti!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server ${PORT} portda ishga tushdi");
});
