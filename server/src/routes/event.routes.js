const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

// Toți utilizatorii autentificați
router.get("/", requireAuth, getEvents);
router.get("/:id", requireAuth, getEventById);

// Doar administratorii
router.post("/", requireAuth, requireAdmin, createEvent);
router.put("/:id", requireAuth, requireAdmin, updateEvent);
router.delete("/:id", requireAuth, requireAdmin, deleteEvent);

module.exports = router;