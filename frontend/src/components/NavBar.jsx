import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUser } from "../store/auth.slice";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className="w-full bg-white text-matte-black shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto py-3 px-4">
        <div className="w-1/3 flex items-center justify-between border-r-2 px-2">
          <Link to="/">
            <h2 className="text-3xl font-bold text-black hover:text-gray-700">
              PGA
            </h2>
          </Link>
          <Link to="/all-photos" className="hover:text-gray-700">
            All Photos
          </Link>
          <Link to="/my-photos" className="hover:text-gray-700">
            My Photos
          </Link>
        </div>

        <div className="flex space-x-4 w-2/3 justify-end">
          {loading ? (
            <p>Loading...</p>
          ) : isLoggedIn ? (
            <>
              <span className="text-black font-semibold">{user?.name}</span>
              <button className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600">
                Login
              </button>
              <button className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
