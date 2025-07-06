import React, { useState } from "react";

const Todo = ({ item, id, deleteTodo, mongoId, toggleTodoStatus, startEditing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 100;

  const shouldTruncate = item.description && item.description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = shouldTruncate && !isExpanded 
    ? `${item.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : item.description;

  return (
    <div className="p-4 hover:bg-gray-50 transition duration-150 group">
      <div className="flex items-start">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1 mr-3">
          <button
            onClick={() => toggleTodoStatus(mongoId)}
            className={`h-5 w-5 rounded-full border flex items-center justify-center transition ${
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
          <div
            className={`text-sm font-medium ${
              item.isCompleted
                ? "text-gray-500 line-through"
                : "text-gray-800"
            }`}
          >
            {item.title}
          </div>
          
          {item.description && (
            <div className="mt-1">
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
        </div>

        {/* Action buttons */}
        <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
          {/* Edit Button */}
          <button
            onClick={() => startEditing(item)}
            className="text-gray-400 cursor-pointer hover:text-blue-500 transition duration-150 p-1"
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>

          {/* Delete Button */}
          <button
            onClick={() => deleteTodo(mongoId)}
            className="text-gray-400 cursor-pointer hover:text-red-500 transition duration-150 p-1"
            title="Delete task"
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
