const express = require("express");
const router = express.Router();

const {
  requireAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");

const {
  getUsers,
  toggleUser,
  deleteUser,
  changeUserPassword,
} = require("../controllers/user.controller");

router.get(
  "/",
  requireAuth,
  requireAdmin,
  getUsers
);

router.put(
  "/:id/toggle",
  requireAuth,
  requireAdmin,
  toggleUser
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteUser
);
router.put(
  "/:id/password",
  requireAuth,
  changeUserPassword
);

module.exports = router;