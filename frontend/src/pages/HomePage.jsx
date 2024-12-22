import React from "react";
import { AllPhotos } from "../components";
import Filters from "../components/Filters";

const HomePage = () => {
  return (
    <main className="bg-gray-200">
      <Filters/>
      <AllPhotos />
    </main>
  );
};

export default HomePage;
