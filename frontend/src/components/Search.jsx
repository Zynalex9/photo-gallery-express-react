import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { queryByTags, queryByTitle } from "../store/search.slice";
import { MdOutlineCancel } from "react-icons/md";
const Search = () => {
  const { searchByTitle, searchByTags } = useSelector(
    (state) => state.searchState
  );
  const dispatch = useDispatch();
  console.log("searchByTags", searchByTags);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    navigate(`/search/${data.search}`);
    reset();
  };

  return (
    <div className="flex justify-center items-center w-full p-4 bg-gray-100 ">
      <form
        className="flex items-center gap-2 bg-white shadow-md rounded-lg w-full sm:w-full p-2"
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
          className="font-custom py-2 px-6  bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Searching" : "Search"}
        </button>
        <button
          type="button"
          className={`font-custom py-2 px-6 ${
            searchByTitle
              ? "bg-red-600 text-white border-black"
              : "bg-blue-500 text-white"
          }  rounded-r-lg border-blue-500 border-2`}
          onClick={() => dispatch(queryByTitle())}
        >
          Search By Title
        </button>
        <button
          type="button"
          className={`font-custom py-2 px-6 ${
            searchByTags
              ? "bg-red-600 text-white border-black"
              : "bg-blue-500 text-white"
          }  rounded-r-lg border-blue-500 border-2`}
          disabled={isSubmitting}
          onClick={() => dispatch(queryByTags())}
        >
          Search By Tags
        </button>
      </form>
    </div>
  );
};

export default Search;
