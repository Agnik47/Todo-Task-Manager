// ============================
// Home.jsx (Main Page)
// ============================

"use client";

import Todo from "@/components/Todo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const response = await axios.get("/api/auth/me");
    try {
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  //Fetch Todo Lists (Need to Update only Authicated User can show their own task list)
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api");
      setTodoData(response.data.todos);
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

  //Onchange in input fileds
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
      // Optimistically update UI
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

      // Refetch to ensure consistency
      fetchTodos();
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
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-pink-100 to-pink-100 p-4 md:p-8 md:py-24">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Hello {user?.name.split(" ")[0]}, Welcome to Task Manager
          </h1>
          <p className="text-gray-600">
            Organize your work and boost productivity
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Task List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isEditing ? "Edit Task" : "Add New Task"}
              </h2>
              <form onSubmit={onSubmitHandler} className="space-y-4">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 cursor-pointer transition duration-200 flex items-center justify-center"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </button>
              </form>
            </div>
          </div>

          {/* Task Table */}

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {pendingCount} Pending
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {completedCount} Completed
                    </span>
                  </div>
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeTab === "all"
                          ? "bg-white shadow text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeTab === "active"
                          ? "bg-white shadow text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setActiveTab("completed")}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeTab === "completed"
                          ? "bg-white shadow text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>

              {/* Todo Component mounting */}

              <div className="divide-y">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading tasks...</p>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="mt-2 text-gray-600">No tasks found.</p>
                  </div>
                ) : (
                  filteredTodos.map((item, idx) => (
                    <Todo
                      key={item._id}
                      item={item}
                      deleteTodo={deleteTodo}
                      toggleTodoStatus={toggleTodoStatus}
                      startEditing={startEditing}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
