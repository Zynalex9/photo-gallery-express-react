import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data)
    navigate(`/search/${data.search}`);
    reset()
  };

  return (
    <div className="flex justify-center items-center w-full p-4 bg-gray-100 ">
      <form
        className="flex items-center bg-white shadow-md rounded-lg w-3/4 sm:w-1/2 p-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          className="flex-grow py-2 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 border border-gray-300"
          placeholder="Search anything"
          {...register("search")}
        />
        <button
          type="submit"
          className="py-2 px-6 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Searching" : "Search"}
        </button>
      </form>
    </div>
  );
};

export default Search;
