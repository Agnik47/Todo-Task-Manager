import React from "react";

const Loader = () => {
  return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading your tasks...</p>
    </div>
  );
};

export default Loader;
