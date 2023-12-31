import { React, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Forgot(props) {
  const [forgotForm, setForgotForm] = useState({
    email: "",
    new_password: "",
  });

  const onChangeForm = (label, event) => {
    switch (label) {
      case "email":
        setForgotForm({ ...forgotForm, email: event.target.value });
        break;
      case "new_password":
        setForgotForm({ ...forgotForm, new_password: event.target.value });
        break;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(forgotForm);
    await axios
      .post("http://18.220.228.7:8000/auth/forgot-password", forgotForm)
      .then((response) => {
        console.log(response);

        toast.success(response.data.detail);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);

        toast.error(error.response.data.detail);
      });
  };
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 ">
          Forgot Password?
        </h1>
        <p className="w-80 text-center text-lg mb-5 font-semibold text-gray-700 tracking-wide mx-auto">
          Update password
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(evnet) => {
              onChangeForm("email", event);
            }}
          />
          <input
            type="password"
            placeholder="New Password"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(evnet) => {
              onChangeForm("new_password", event);
            }}
          />
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="py-2 w-64 text-xl text text-white bg-blue-400 rounded-2xl hover:bg-blue-300 active:bg-blue-500 outline-none"
          >
            Change Password
          </button>
          <p className="mt-4 text-sm">
            Already have an accout,{" "}
            <Link
              to="/?login"
              onClick={() => {
                props.setPage("login");
              }}
            >
              <span className="underline cursor-pointer">Sign in</span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default Forgot;
