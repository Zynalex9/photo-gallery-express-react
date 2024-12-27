import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Search from "../components/Search";
import axios from "axios";
import Photo from "../components/Photo";
import { useSelector } from "react-redux";

const SearchPage = () => {
  const { search } = useParams();
  const [searchResult, setSearchResult] = useState([]);
  const { searchByTitle, searchByTags } = useSelector(
    (state) => state.searchState
  );
  useEffect(() => {
    async function fetchSearchResult() {
      try {
        if (!search.trim()) return;
        if (!searchByTags && !searchByTitle) {
          const { data } = await axios.get(
            `/api/v1/photo/allFilter?query=${search}`
          );
          setSearchResult(data.data);
          console.log("overall condition", data.data)
        }
        else if(searchByTitle){
          const {data}=await axios.get(`/api/v1/photo/searchbytitle?title=${search}`)
          setSearchResult(data.data);
          console.log("by title", data.data)
          
          
        }
        else if(searchByTags){
          const {data}=await axios.get(`/api/v1/photo/searchbytags?tags=${search}`)
          setSearchResult(data.data);
          console.log("by tags", data.data)

        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
    fetchSearchResult();
  }, [search,searchByTags,searchByTitle]);

  return (
    <div>
      <Search />
      {(!search || !search.trim()) ? (
        <p className="text-red-500 text-center mt-4">You did not enter any query</p>
      ) : (
        <div className="flex items-start justify-around w-full gap-1 p-2 flex-wrap">
          {searchResult.length > 0 ? (
            searchResult.map((result) => (
              <Photo photo={result} key={result._id} />
            ))
          ) : (
            <p className="text-gray-500">{`No Photos for "${search}"`}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
