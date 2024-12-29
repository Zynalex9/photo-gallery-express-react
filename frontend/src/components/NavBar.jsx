import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUser, logout } from "../store/auth.slice";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const NavBar = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, loading, error } = useSelector(
    (state) => state.auth
  );
  console.log("user", user);
  useEffect(() => {
    dispatch(fetchUser());
  }, [isLoggedIn, dispatch]);
  const handleLogOut = async () => {
    try {
      await axios.post("/api/v1/user/logout");
      dispatch(logout());
      toast.success("Logged out", {
        position: "bottom-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    } catch (error) {
      console.log(error);
    }
  };
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
              <button
                className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600"
                onClick={handleLogOut}
              >
                Logout
              </button>
              {user?.data?.username ? (
                <>
                  <Link to={`/user/profile/${user.data._id}`}>
                    <img
                      src={user.data.profilePicture}
                      alt=""
                      className="h-[50px] w-[50px] rounded-full object-cover"
                    />
                  </Link>
                </>
              ) : null}
            </>
          ) : (
            <>
              <Link to={"/user/login"}>
                {" "}
                <button className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600">
                  Login
                </button>
              </Link>
              <button className="py-2 px-4 bg-blue-500 text-black font-semibold rounded-md hover:bg-blue-600">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NavBar;
