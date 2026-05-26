import { Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-400 mb-4">DevCollab</h1>
        <p className="text-slate-400 text-lg">
          Real-time collaborative development platform
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition">
            Get Started
          </button>
          <button className="border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-2 rounded-lg font-medium transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
