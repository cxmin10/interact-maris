const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./src/routes/auth.routes");
const eventRoutes = require("./src/routes/event.routes");
const attendanceRoutes = require("./src/routes/attendance.routes");
const membershipFeeRoutes = require("./src/routes/membershipFee.routes");
const userRoutes = require("./src/routes/user.routes");
const profileRoutes = require("./src/routes/profile.routes");
const absenceRoutes = require("./src/routes/absence.routes");

const {
  startMembershipFeeScheduler,
} = require("./src/services/membershipFee.service");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Interact Maris API funcționează",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", membershipFeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/absences", absenceRoutes);

// Frontend React build
const clientDistPath = path.join(
  __dirname,
  "../client/dist"
);

app.use(express.static(clientDistPath));

// React Router fallback - Express 5
app.get("/{*splat}", (req, res) => {
  res.sendFile(
    path.join(clientDistPath, "index.html")
  );
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server pornit pe portul ${PORT}`);

  startMembershipFeeScheduler();
});