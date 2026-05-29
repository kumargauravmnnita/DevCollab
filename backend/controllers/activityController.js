const Activity = require("../models/Activity");
const Project = require("../models/Project");

const getActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    const activities = await Activity.find({ project: projectId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getActivities };
