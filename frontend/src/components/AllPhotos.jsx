import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedPhotos } from "../store/images.slice";
import Photo from "./Photo";

const AllPhotos = () => {
  const [currentPage, SetCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { paginatedPhotos, loading, error } = useSelector(
    (state) => state.photos
  );

  useEffect(() => {
    dispatch(fetchPaginatedPhotos({ page: currentPage }))
      .then((response) =>
        console.log("response from use effect", response.payload)
      )
      .catch((err) => console.log(err));
  }, [dispatch, currentPage]);

  const results = paginatedPhotos?.results || [];
  let totalPages = paginatedPhotos?.totalPages;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex items-start justify-around w-full gap-1 p-2 flex-wrap">
        {results.length > 0 ? (
          results.map((photo) => <Photo photo={photo} key={photo._id} />)
        ) : (
          <p>No Photos to show</p>
        )}
      </div>
      <div className="pagination flex items-center justify-center">
        {Array.from({ length: totalPages }, (_, idx) => {
          return (
            <button
              onClick={() => SetCurrentPage(idx + 1)}
              className="bg-gray-200 py-2 px-3 m-1 rounded-md text-black"
              key={idx}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AllPhotos;
