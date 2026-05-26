import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
            className="sm:hidden text-slate-300 focus:outline-none"
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
              className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition text-left"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage your projects and tasks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6">
            <p className="text-slate-400 text-xs sm:text-sm mb-1">
              Total Projects
            </p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6">
            <p className="text-slate-400 text-xs sm:text-sm mb-1">
              Tasks Completed
            </p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
            <p className="text-slate-400 text-xs sm:text-sm mb-1">
              Collaborators
            </p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 text-center">
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
          <h2 className="text-lg sm:text-xl font-semibold text-slate-200 mb-2">
            No projects yet
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Create your first project to get started
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition text-sm sm:text-base">
            + New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
