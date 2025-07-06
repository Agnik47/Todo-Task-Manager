"use client";

import Todo from "@/components/Todo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);

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

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning("Title is required");
      return;
    }

    try {
      const response = await axios.post("/api", formData);
      toast.success(response.data.msg);
      setFormData({ title: "", description: "" });
      await fetchTodos();
    } catch (error) {
      toast.error("Error creating todo");
    }
  };

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

  const toggleTodoStatus = async (id) => {
    try {
      const response = await axios.put(
        "/api",
        {},
        {
          params: { mongoId: id },
        }
      );
      toast.success(response.data.msg);
      fetchTodos();
    } catch (error) {
      toast.error("Error updating todo");
    }
  };

  const filteredTodos = todoData.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return !item.isCompleted;
    if (activeTab === "completed") return item.isCompleted;
    return true;
  });

  const pendingCount = todoData.filter((item) => !item.isCompleted).length;
  const completedCount = todoData.filter((item) => item.isCompleted).length;

  return (
    <div className="min-h-screen  bg-gradient-to-r from-orange-100 via-pink-100 to-pink-100 p-4 md:p-8 md:py-24">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Hello {user?.name.split(' ')[0]},  Welcome to Task Manager
          </h1>
          <p className="text-gray-600">
            Organize your work and boost productivity
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add New Task
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
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* Todo List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Stats and Tabs */}
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

              {/* Todo List */}
              <div className="divide-y">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading tasks...</p>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="mt-2 text-gray-600">
                      {activeTab === "all"
                        ? "No tasks found. Add one to get started!"
                        : activeTab === "active"
                        ? "No active tasks. Great job!"
                        : "No completed tasks yet."}
                    </p>
                  </div>
                ) : (
                  filteredTodos.map((item, idx) => (
                    <Todo
                      key={item._id}
                      id={idx}
                      deleteTodo={deleteTodo}
                      toggleTodoStatus={toggleTodoStatus}
                      mongoId={item._id}
                      item={item}
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
