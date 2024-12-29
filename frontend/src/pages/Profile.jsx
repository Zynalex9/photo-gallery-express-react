import UserProfileMain from "../components/UserProfileMain";
import UserProfileSide from "../components/UserProfileSide";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user)
  return <div className="flex w-full p-2 gap-2">
    <UserProfileSide/>
    <UserProfileMain/>
  </div>;
};

export default Profile;
