import { useState, useEffect } from "react";
import axios from "axios";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name, description, color) => {
    const { data } = await axios.post("/api/projects", {
      name,
      description,
      color,
    });
    setProjects((prev) => [data, ...prev]);
    return data;
  };

  const deleteProject = async (id) => {
    await axios.delete(`/api/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    fetchProjects,
  };
};
