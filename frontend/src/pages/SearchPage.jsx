import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../components/Search";
import axios from "axios";
import Photo from "../components/Photo";

const SearchPage = () => {
  const { search } = useParams();
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function fetchSearchResult() {
      try {
        const { data } = await axios.get(
          `/api/v1/photo/allFilter?query=${search}`
        );
        console.log(data.data);
        setSearchResult(data.data); 
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
    fetchSearchResult();
  }, [search]);

  return (
    <div>
      <Search />
      <div className="flex items-start justify-around w-full gap-1 p-2 flex-wrap">
        {searchResult.length > 0 ? (
          searchResult.map((result) => (
            <Photo photo={result} key={result._id} />
          ))
        ) : (
          <p className="text-gray-500">{`No Photos for "${search}"`}</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
