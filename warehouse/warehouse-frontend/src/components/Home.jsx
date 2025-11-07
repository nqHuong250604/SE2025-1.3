import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();

  const handleClickLogin = () => {
    nav("/login");
  };
  return (
    <div>
      <button onClick={handleClickLogin}>Login</button>
      <h1 className="text-4xl text-blue-500 font-bold text-center mt-10">
        Welcom to Logistic
      </h1>
    </div>
  );
};

export default Home;
