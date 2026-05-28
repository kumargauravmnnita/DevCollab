import { useState, useEffect } from "react";
import axios from "axios";

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title, description, priority) => {
    const { data } = await axios.post(`/api/projects/${projectId}/tasks`, {
      title,
      description,
      priority,
    });
    setTasks((prev) => [data, ...prev]);
    return data;
  };

  const updateTask = async (taskId, updates) => {
    const { data } = await axios.put(
      `/api/projects/${projectId}/tasks/${taskId}`,
      updates,
    );
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    return data;
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  return { tasks, setTasks, loading, createTask, updateTask, deleteTask };
};
