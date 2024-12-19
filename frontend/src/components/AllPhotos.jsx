import React, { useEffect, useState } from "react";
import axios from "axios";
import Photo from "./Photo";
import { Link } from "react-router-dom";
const AllPhotos = () => {
  const [allPhotos, setAllPhotos] = useState([]);
  async function fetchPhotos() {
    try {
      const { data } = await axios.get("/api/v1/photo/all-photos");
      console.log(data);
      setAllPhotos(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchPhotos();
  }, []);
  return (
    <div className="w-full flex flex-wrap gap-4 items-center justify-center p-2 bg-gray-100">
      {allPhotos.map((photo) => (
          <Photo photo={photo} />
      ))}
    </div>
  );
};

export default AllPhotos;
