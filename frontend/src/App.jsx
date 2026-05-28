import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectBoard from "./pages/ProjectBoard";
import PrivateRoute from "./components/PrivateRoute";

function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-400 mb-4">
          DevCollab
        </h1>
        <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
          Real-time collaborative development platform with AI-powered tools
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/register"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition text-sm sm:text-base"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="border border-slate-600 hover:border-slate-400 text-slate-300 px-8 py-3 rounded-lg font-medium transition text-sm sm:text-base"
          >
            Sign In
          </a>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-slate-200 font-medium text-sm mb-1">
              Real-time
            </h3>
            <p className="text-slate-400 text-xs">
              Live collaboration with your team
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="text-slate-200 font-medium text-sm mb-1">
              AI Powered
            </h3>
            <p className="text-slate-400 text-xs">
              Smart code review and task generation
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="text-2xl mb-2">🗂️</div>
            <h3 className="text-slate-200 font-medium text-sm mb-1">
              Kanban Board
            </h3>
            <p className="text-slate-400 text-xs">
              Manage tasks visually with drag and drop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/project/:id"
        element={
          <PrivateRoute>
            <ProjectBoard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
