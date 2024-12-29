import React from "react";
import { Link } from "react-router-dom";

const Photo = ({ photo }) => {
  console.log(photo);
  return (
    <div className="py-2 bg-white px-2 overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/photos/${photo._id}`}>
        <img
          src={photo.imageUrl}
          alt={photo.title || "Photo"}
          className="object-cover h-[350px] w-[400px]"
        />
      </Link>
      <div className="flex justify-between items-center text-xl font-bold py-2">
        <h1>{photo.title}</h1>
        <div className="flex gap-1">
          {photo.tags&&photo.tags.map((tag, index) => (
            <h1 className="bg-gray-300 p-1 rounded-full" key={index}>{tag}</h1>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photo;
