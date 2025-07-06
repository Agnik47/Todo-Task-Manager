// ============================
// Home.jsx (Main Page)
// ============================

"use client";

import Todo from "@/components/Todo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  //Fetch User Details
  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  //Fetch Todo Lists
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api");
      setTodoData(response.data.todos || []);
    } catch (error) {
      toast.error("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTodos();
  }, []);

  //Onchange in input fields
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning("Title is required");
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.put("/api", formData, {
          params: { mongoId: editId },
        });
        toast.success(response.data.msg);
        setIsEditing(false);
        setEditId(null);
      } else {
        const response = await axios.post("/api", formData);
        toast.success(response.data.msg);
      }

      setFormData({ title: "", description: "" });
      await fetchTodos();
    } catch (error) {
      toast.error("Error submitting task");
    }
  };

  //! Delete Todo List
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete("/api", {
        params: { mongoId: id },
      });
      toast.success(response.data.msg);
      fetchTodos();
    } catch (error) {
      toast.error("Error deleting todo");
    }
  };

  //! Toggle Todo Status
  const toggleTodoStatus = async (id, status) => {
    try {
      // Optimistic UI update
      setTodoData((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: status } : todo
        )
      );

      await axios.put(
        "/api",
        { isCompleted: status },
        {
          params: { mongoId: id },
        }
      );
    } catch (error) {
      // Revert on error
      setTodoData((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !status } : todo
        )
      );
      toast.error("Error updating todo");
    }
  };

  //! Edit the Todo List
  const startEditing = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setFormData({ title: item.title, description: item.description });
  };

  //! Filters
  const filteredTodos = todoData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return !item.isCompleted;
    if (activeTab === "completed") return item.isCompleted;
    return true;
  });

  const pendingCount = todoData.filter((item) => !item.isCompleted).length;
  const completedCount = todoData.filter((item) => item.isCompleted).length;

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-pink-100 pt-24 pb-12 px-4 md:px-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto ">
        <header className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-handwriting"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hello {user?.name.split(" ")[0]}, Welcome to Task Flow
          </motion.h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Organize your work and boost productivity with a simple and intuitive task manager.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Task List */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-gradient-to-r from-orange-50 via-pink-50 to-pink-50 rounded-2xl shadow-sm p-6 h-fit border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 font-handwriting">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h2>
              <form onSubmit={onSubmitHandler} className="space-y-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={onChangeHandler}
                    name="title"
                    placeholder="Enter task title"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter task description"
                    name="description"
                    value={formData.description}
                    onChange={onChangeHandler}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:opacity-90 cursor-pointer transition-all duration-200 flex items-center justify-center font-medium shadow-md shadow-blue-100"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                      {pendingCount} Pending
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                      {completedCount} Completed
                    </span>
                  </div>
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        activeTab === "all"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        activeTab === "active"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setActiveTab("completed")}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        activeTab === "completed"
                          ? "bg-white shadow-sm text-blue-600"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>

              {/* Todo List */}
              <div className="divide-y divide-gray-100">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your tasks...</p>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                    <p className="text-gray-500">Add your first task to get started</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredTodos.map((item) => (
                      <Todo
                        key={item._id}
                        item={item}
                        mongoId={item._id}
                        deleteTodo={deleteTodo}
                        toggleTodoStatus={toggleTodoStatus}
                        startEditing={startEditing}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Global styles for handwriting font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Patrick+Hand&display=swap');
        .font-handwriting {
          font-family: 'Patrick Hand', cursive;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}