import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loggedIn} from "../store/auth.slice"
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const onSubmit = async (formData) => {
    console.log(formData);
    try {
      const { data } = await axios.post("/api/v1/user/login", formData);
      toast.success(`Logged in. Redirecting to home page`, {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      console.log(data);
      setTimeout(() => {
        dispatch(loggedIn())
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <label htmlFor="login" className="text-sm text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              id="login"
              {...register("login", {
                required: "Please enter your email or username",
              })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email or username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.login.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Please enter your password",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${isSubmitting? "cursor-not-allowed":"cursor-pointer"}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loggin in..." : "Login"}
          </button>
        </form>
        <p className="text-md my-2">Not a user? <Link to={"/user/register"} className="text-blue-600">Register here</Link> </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
