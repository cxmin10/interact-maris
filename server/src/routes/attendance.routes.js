const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  registerToEvent,
  getUserAttendances,
  cancelAttendance,
  getParticipants,
  updateAttendanceStatus,
} = require("../controllers/attendance.controller");

router.post("/", requireAuth, registerToEvent);

router.get(
  "/user/:userId",
  requireAuth,
  getUserAttendances
);

router.put(
  "/cancel",
  requireAuth,
  cancelAttendance
);

router.get(
  "/:eventId",
  requireAuth,
  requireAdmin,
  getParticipants
);

router.put(
  "/:attendanceId/status",
  requireAuth,
  requireAdmin,
  updateAttendanceStatus
);

module.exports = router;