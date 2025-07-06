// Todo Component
import React, { useState } from "react";
import { motion } from "framer-motion";

const Todo = ({ item, deleteTodo, mongoId, toggleTodoStatus, startEditing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 100;

  const shouldTruncate = item.description && item.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = shouldTruncate && !isExpanded 
    ? `${item.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : item.description;

  return (
    <motion.div 
      className="p-5 hover:bg-gray-50 transition-colors duration-200"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1 mr-4">
          <button
            onClick={() => toggleTodoStatus(mongoId, !item.isCompleted)}
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              item.isCompleted
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-blue-500"
            }`}
            aria-label={item.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {item.isCompleted && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`text-base font-medium ${
                item.isCompleted
                  ? "text-gray-500 line-through"
                  : "text-gray-800"
              }`}
            >
              {item.title}
            </div>
            <div className="flex-shrink-0 flex gap-2 ml-2">
              {/* Edit Button */}
              <button
                onClick={() => startEditing(item)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                title="Edit task"
                aria-label="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(mongoId)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete task"
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {item.description && (
            <div className="mt-2">
              <p
                className={`text-sm ${
                  item.isCompleted ? "text-gray-400" : "text-gray-600"
                } whitespace-pre-wrap break-words`}
              >
                {displayDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 focus:outline-none"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
          
          <div className="mt-2 flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              item.isCompleted ? "bg-green-500" : "bg-blue-500"
            }`}></span>
            <span className="text-xs text-gray-500">
              {item.isCompleted ? "Completed" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Todo;