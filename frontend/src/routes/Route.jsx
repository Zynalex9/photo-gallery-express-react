import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import PhotoDetail from "../pages/PhotoDetail";
import SearchPage from "../pages/SearchPage";
import Register from "../pages/Register";

const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/search/:search" element={<SearchPage />} />
        <Route path="/user/register" element={<Register/>}/>
      </Routes>
    </div>
  );
};

export default AllRoutes;
