import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import CreateProjectModal from "../components/CreateProjectModal";
import Navbar from "../components/Navbar";
import {
  ProjectCardSkeleton,
  DashboardStatSkeleton,
} from "../components/Skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (name, description, color) => {
    await createProject(name, description, color);
    toast.success("Project created!");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    toast.success("Project deleted");
  };

  const totalTasks = 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar title="DevCollab" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              My Projects
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {loading
                ? "Loading..."
                : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {loading ? (
            <>
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
              <DashboardStatSkeleton />
            </>
          ) : (
            <>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6">
                <p className="text-slate-400 text-xs sm:text-sm mb-1">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-white">
                  {projects.length}
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6">
                <p className="text-slate-400 text-xs sm:text-sm mb-1">
                  Tasks Completed
                </p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6">
                <p className="text-slate-400 text-xs sm:text-sm mb-1">
                  Collaborators
                </p>
                <p className="text-3xl font-bold text-white">
                  {projects.reduce((acc, p) => acc + p.members.length, 0)}
                </p>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
            <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m7-7v14"
                />
              </svg>
            </div>
            <h3 className="text-slate-200 font-semibold mb-2">
              No projects yet
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
            >
              + New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-slate-500 hover:shadow-lg hover:shadow-black/20 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => handleDelete(project._id, e)}
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-primary-400 transition">
                  {project.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <span className="text-slate-500 text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex -space-x-1">
                    {project.members.slice(0, 3).map((member, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-primary-600 border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold"
                        title={member.user?.name}
                      >
                        {member.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    ))}
                    {project.members.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-white text-xs">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default Dashboard;
