const express = require("express");
const router = express.Router();
const {
  reviewCode,
  explainCode,
  generateTasks,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/review", reviewCode);
router.post("/explain", explainCode);
router.post("/generate-tasks", generateTasks);

module.exports = router;
