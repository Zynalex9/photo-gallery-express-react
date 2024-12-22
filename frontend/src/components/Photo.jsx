import React from "react";
import { Link } from "react-router-dom";

const Photo = ({ photo }) => {
  return (
    <div className="h-[450px] w-[31%] bg-white shadow-md  overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/photos/${photo._id}`}>
        <img
          src={photo.imageUrl}
          alt={photo.title || "Photo"}
          className="h-full w-full object-cover border-2 border-blue-800"
        />
      </Link>
    </div>
  );
};

export default Photo;
