const Project = require("../models/Project");
const User = require("../models/User");
const Activity = require("../models/Activity");

const inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can invite members" });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    if (userToInvite._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't invite yourself" });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToInvite._id.toString(),
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({
      user: userToInvite._id,
      role: role || "collaborator",
    });
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: `invited ${userToInvite.name} as ${role || "collaborator"}`,
      type: "member",
    });

    const updated = await Project.findById(project._id).populate(
      "members.user",
      "name email",
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can remove members" });
    }

    if (memberId === req.user._id.toString()) {
      return res.status(400).json({ message: "Owner cannot be removed" });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== memberId,
    );
    await project.save();

    await Activity.create({
      project: project._id,
      user: req.user._id,
      action: "removed a member",
      type: "member",
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members.user",
      "name email",
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project.members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { inviteMember, removeMember, getMembers };
