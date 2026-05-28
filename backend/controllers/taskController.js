const Task = require("../models/Task");
const Project = require("../models/Project");

const isProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return false;
  return project.members.some((m) => m.user.toString() === userId.toString());
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const allowed = await isProjectMember(projectId, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title)
      return res.status(400).json({ message: "Task title is required" });

    const allowed = await isProjectMember(projectId, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      priority: priority || "medium",
      project: projectId,
      dueDate: dueDate || null,
      assignee: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const allowed = await isProjectMember(task.project, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });

    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const allowed = await isProjectMember(task.project, req.user._id);
    if (!allowed) return res.status(403).json({ message: "Access denied" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
