const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  getFees,
  getUserFees,
  getFeeSettings,
  updateFeeSettings,
  generateCurrentFees,
  updateFeeStatus,
  deleteFee,
} = require("../controllers/membershipFee.controller");

router.get(
  "/settings",
  requireAuth,
  requireAdmin,
  getFeeSettings
);

router.put(
  "/settings",
  requireAuth,
  requireAdmin,
  updateFeeSettings
);

router.post(
  "/generate-current",
  requireAuth,
  requireAdmin,
  generateCurrentFees
);

router.get(
  "/",
  requireAuth,
  requireAdmin,
  getFees
);

router.get(
  "/user/:userId",
  requireAuth,
  getUserFees
);

router.put(
  "/:feeId/status",
  requireAuth,
  requireAdmin,
  updateFeeStatus
);

router.delete(
  "/:feeId",
  requireAuth,
  requireAdmin,
  deleteFee
);

module.exports = router;