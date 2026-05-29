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
const {
  inviteMember,
  removeMember,
  getMembers,
} = require("../controllers/memberController");
const { getActivities } = require("../controllers/activityController");
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

router.get("/:id/members", getMembers);
router.post("/:id/members/invite", inviteMember);
router.delete("/:id/members/:memberId", removeMember);

router.get("/:projectId/activities", getActivities);

module.exports = router;
