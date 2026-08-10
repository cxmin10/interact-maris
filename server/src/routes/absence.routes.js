const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  addAbsence,
  getUserAbsences,
  deleteAbsence,
} = require("../controllers/absence.controller");

router.get(
  "/user/:userId",
  requireAuth,
  getUserAbsences
);

router.post(
  "/user/:userId",
  requireAuth,
  requireAdmin,
  addAbsence
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteAbsence
);

module.exports = router;