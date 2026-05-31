const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const Project = require("../models/Project");
    const Task = require("../models/Task");

    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    });

    const projectIds = projects.map((p) => p._id);

    const totalTasks = await Task.countDocuments({
      project: { $in: projectIds },
    });
    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds },
      status: "done",
    });

    const totalCollaborators = projects.reduce(
      (acc, p) => acc + p.members.length,
      0,
    );

    res.json({
      totalProjects: projects.length,
      totalTasks,
      completedTasks,
      totalCollaborators,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, changePassword, getUserStats };
