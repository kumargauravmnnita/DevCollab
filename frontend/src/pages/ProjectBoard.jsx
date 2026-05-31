import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../hooks/useTasks";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../context/AuthContext";
import CreateTaskModal from "../components/CreateTaskModal";
import AITaskGenerator from "../components/AITaskGenerator";
import MembersPanel from "../components/MembersPanel";
import ActivityFeed from "../components/ActivityFeed";
import toast from "react-hot-toast";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-slate-500" },
  { id: "inprogress", label: "In Progress", color: "bg-blue-500" },
  { id: "review", label: "Review", color: "bg-yellow-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
];

const PRIORITY_COLORS = {
  low: "bg-green-500/20 text-green-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-red-500/20 text-red-400",
};

const TaskCard = ({ task, index, onDelete }) => (
  <Draggable draggableId={task._id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-slate-800 border rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing transition group
          ${
            snapshot.isDragging
              ? "border-primary-500 shadow-lg shadow-primary-500/10 rotate-1"
              : "border-slate-700 hover:border-slate-500"
          }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-slate-200 text-sm font-medium leading-snug flex-1">
            {task.title}
          </p>
          <button
            onClick={() => onDelete(task._id)}
            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 mt-0.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {task.description && (
          <p className="text-slate-500 text-xs mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-slate-500">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    )}
  </Draggable>
);

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socketRef = useSocket();
  const { tasks, setTasks, loading, createTask, updateTask, deleteTask } =
    useTasks(id, socketRef);

  const [showModal, setShowModal] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activeColumn, setActiveColumn] = useState("todo");

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: newStatus } : t,
      ),
    );
    try {
      await updateTask(draggableId, { status: newStatus });
      toast.success(
        `Moved to ${newStatus === "inprogress" ? "In Progress" : newStatus}`,
      );
    } catch {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === draggableId ? { ...t, status: source.droppableId } : t,
        ),
      );
      toast.error("Failed to update task");
    }
  };

  const handleOpenModal = (columnId) => {
    setActiveColumn(columnId);
    setShowModal(true);
  };

  const handleAITasksGenerated = async (generatedTasks) => {
    const loadingToast = toast.loading(
      `Adding ${generatedTasks.length} tasks...`,
    );
    try {
      for (const task of generatedTasks) {
        await createTask(task.title, task.description, task.priority);
      }
      toast.dismiss(loadingToast);
      toast.success(`${generatedTasks.length} tasks added to board!`);
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to add some tasks");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <nav className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-400 hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white truncate">
              Project Board
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowActivity(true)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
              title="Activity Feed"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="hidden sm:inline">Activity</span>
            </button>

            <button
              onClick={() => setShowMembers(true)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
              title="Team Members"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="hidden sm:inline">Members</span>
            </button>

            <button
              onClick={() => setShowAIGenerator(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
            >
              <span>✨</span>
              <span className="hidden sm:inline">AI Generate</span>
            </button>

            <button
              onClick={() => navigate(`/editor/${id}`)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
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
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="hidden sm:inline">Editor</span>
            </button>

            <button
              onClick={() => handleOpenModal("todo")}
              className="bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-x-auto p-4 sm:p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => {
              const colTasks = getColumnTasks(col.id);
              return (
                <div
                  key={col.id}
                  className="w-72 sm:w-auto flex flex-col bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${col.color}`}
                      ></div>
                      <span className="text-sm font-medium text-slate-200">
                        {col.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">
                        {colTasks.length}
                      </span>
                      <button
                        onClick={() => handleOpenModal(col.id)}
                        className="text-slate-400 hover:text-white transition"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-2 min-h-32 transition-colors ${
                          snapshot.isDraggingOver ? "bg-primary-500/5" : ""
                        }`}
                      >
                        {colTasks.map((task, index) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            index={index}
                            onDelete={deleteTask}
                          />
                        ))}
                        {provided.placeholder}
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="text-center py-8 text-slate-600 text-xs">
                            No tasks yet
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={async (title, desc, priority) => {
            const task = await createTask(title, desc, priority);
            if (activeColumn !== "todo") {
              await updateTask(task._id, { status: activeColumn });
            }
            setShowModal(false);
          }}
        />
      )}

      {showAIGenerator && (
        <AITaskGenerator
          onClose={() => setShowAIGenerator(false)}
          onTasksGenerated={handleAITasksGenerated}
        />
      )}

      {showMembers && (
        <MembersPanel projectId={id} onClose={() => setShowMembers(false)} />
      )}

      {showActivity && (
        <ActivityFeed projectId={id} onClose={() => setShowActivity(false)} />
      )}
    </div>
  );
};

export default ProjectBoard;
