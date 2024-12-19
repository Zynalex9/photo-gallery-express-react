import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PhotoDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState({});

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const { data } = await axios.get(`/api/v1/photo/single-photo/${id}`);
        console.log(data.data);
        setImage(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhoto();
  }, [id]);

  const createdAt = new Date(image.createdAt).toLocaleDateString();

  return (
    <div className="h-screen w-full bg-gray-200 flex justify-center items-center py-6 px-6">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 h-96 md:h-auto overflow-hidden">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{image.title}</h1>
          <p className="text-gray-600 mb-4">{image.description}</p>

          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {image.tags && image.tags.length > 0 ? (
                image.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-400 rounded-xl text-white px-4 py-2 text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No tags available</span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500">Uploaded At: {createdAt}</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
