const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

router.get("/:projectId/tasks", getTasks);
router.post("/:projectId/tasks", createTask);
router.put("/:projectId/tasks/:taskId", updateTask);
router.delete("/:projectId/tasks/:taskId", deleteTask);

module.exports = router;
