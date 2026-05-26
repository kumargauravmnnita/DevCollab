import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-400">DevCollab</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1">Tasks Completed</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-1">Collaborators</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-200 mb-2">
            No projects yet
          </h2>
          <p className="text-slate-400 mb-6">
            Create your first project to get started
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition">
            + New Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
