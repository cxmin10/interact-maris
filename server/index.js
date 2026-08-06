const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const eventRoutes = require("./src/routes/event.routes");
const attendanceRoutes = require(
  "./src/routes/attendance.routes"
);
const membershipFeeRoutes = require(
  "./src/routes/membershipFee.routes"
);
const userRoutes = require("./src/routes/user.routes");
const profileRoutes = require(
  "./src/routes/profile.routes"
);

const {
  startMembershipFeeScheduler,
} = require(
  "./src/services/membershipFee.service"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Interact Maris funcționează!");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", membershipFeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);

  startMembershipFeeScheduler();
});