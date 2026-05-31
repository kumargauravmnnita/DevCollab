import { useState, useEffect } from "react";
import axios from "axios";

export const useTasks = (projectId, socketRef) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
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
    if (socketRef?.current) {
      socketRef.current.emit("task-created", { projectId, task: data });
    }
    return data;
  };

  const updateTask = async (taskId, updates) => {
    const { data } = await axios.put(
      `/api/projects/${projectId}/tasks/${taskId}`,
      updates,
    );
    setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
    if (socketRef?.current) {
      socketRef.current.emit("task-updated", { projectId, task: data });
    }
    return data;
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    if (socketRef?.current) {
      socketRef.current.emit("task-deleted", { projectId, taskId });
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket || !projectId) return;

    socket.emit("join-project", projectId);

    socket.on("task-created", (task) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
    });

    socket.on("task-updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
      );
    });

    socket.on("task-deleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.emit("leave-project", projectId);
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, socketRef?.current]);

  return { tasks, setTasks, loading, createTask, updateTask, deleteTask };
};
