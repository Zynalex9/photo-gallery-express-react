import React from "react";
import { AllPhotos } from "../components";
import Filters from "../components/Filters";

const HomePage = () => {
  return (
    <>
      <Filters />
      <AllPhotos />
    </>
  );
};

export default HomePage;
