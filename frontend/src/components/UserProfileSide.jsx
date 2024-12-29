import React from "react";
import { Link } from "react-router-dom";

const UserProfileSide = () => {
  return (
    <div className="w-[25%] h-[84.5vh] bg-white shadow-xl rounded-md">
    <div className=" flex flex-col items-start p-6 space-y-4">
      <Link
        className="text-lg font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
      >
        Personal Data
      </Link>
      <Link
        className="text-lg font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
      >
        All Images
      </Link>
      <Link
        className="text-lg font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md w-full transition"
      >
        Security
      </Link>
    </div>
    </div>
  );
};

export default UserProfileSide;
