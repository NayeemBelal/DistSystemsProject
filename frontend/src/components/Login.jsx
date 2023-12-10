import React, { useState, onChange } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login(props) {
  const [loginForm, setLoginform] = useState({
    username: "",
    password: "",
  });

  const onChangeForm = (label, event) => {
    switch (label) {
      case "username":
        setLoginform({ ...loginForm, username: event.target.value });
        break;
      case "password":
        setLoginform({ ...loginForm, password: event.target.value });
        break;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(loginForm);
    await axios
      .post("http://18.220.228.7:8000/auth/login", loginForm)
      .then((response) => {
        console.log(response);

        localStorage.setItem("auth_token", response.data.result.access_token);
        localStorage.setItem(
          "auth_token_type",
          response.data.result.token_type
        );

        toast.success(response.data.detail);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        toast.error(error.response.data.detail);

        console.log(error);
      });
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 ">
          Welcome to my page!
        </h1>
        <p className="w-80 text-center text-lg mb-5 font-semibold text-gray-700 tracking-wide mx-auto">
          Log in!
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("username", event);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("password", event);
            }}
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-2 w-64 text-xl text text-white bg-blue-400 rounded-2xl hover:bg-blue-300 active:bg-blue-500 outline-none"
          >
            Sign in
          </button>
          <p className="mt-4 text-sm">
            Dont have an accout,{" "}
            <Link
              to="/?register"
              onClick={() => {
                props.setPage("register");
              }}
            >
              <span className="underline cursor-pointer">Register</span>
            </Link>{" "}
            or{" "}
            <Link
              to="/?forgot"
              onClick={() => {
                props.setPage("forgot");
              }}
            >
              <span className="underline cursor-pointer">Forgot password</span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default Login;
