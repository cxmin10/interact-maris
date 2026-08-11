const express = require("express");

const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  getProfile,
  updateProfile,
  updateProfilePhoto,
} = require("../controllers/profile.controller");

router.get(
  "/:id",
  requireAuth,
  getProfile
);

router.put(
  "/:id/photo",
  requireAuth,
  updateProfilePhoto
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  updateProfile
);

module.exports = router;