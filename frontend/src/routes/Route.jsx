import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PhotoDetail from "../pages/PhotoDetail";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
