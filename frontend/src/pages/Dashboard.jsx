import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import CreateProjectModal from "../components/CreateProjectModal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-primary-400">
            DevCollab
          </h1>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-slate-300 text-sm">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-slate-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-700 flex flex-col gap-3 px-1">
            <span className="text-slate-300 text-sm">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-left"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              My Projects
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 cursor-pointer hover:border-slate-500 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this project?"))
                        deleteProject(project._id);
                    }}
                    className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
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
                  <span className="text-slate-500 text-xs">
                    {project.members.length} member
                    {project.members.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={createProject}
        />
      )}
    </div>
  );
};

export default Dashboard;
