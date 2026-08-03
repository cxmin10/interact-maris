const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server InteractMureș funcționează!");
});

// Rutele de autentificare
app.use("/api/auth", authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});