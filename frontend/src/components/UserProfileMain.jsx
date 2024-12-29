import React, { useEffect, useState } from "react";
import axios from "axios";
import Photo from "./Photo";

const UserProfileMain = () => {
  const [photos, setPhotos] = useState([]);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get("/api/v1/photo/photos-by-user");
      console.log(response.data.data);
      setPhotos(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="w-[75%] bg-red-400 h-[84.5vh] rounded">
      <div className="top-section bg-lime-500 h-[40%] w-full flex flex-wrap">
        <div className="border-2 border-red-500 w-1/3"></div>
        <div className="border-2 border-red-500 w-1/3"></div>
        <div className="border-2 border-red-500 w-1/3"></div>
      </div>
      <div className="images-box w-full h-[60%] flex items-center justify-center">
        {photos.length > 0 ? (
          photos.map((photo) => {
            return <Photo photo={photo} />;
          })
        ) : (
          <p>No Photos to show</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileMain;
