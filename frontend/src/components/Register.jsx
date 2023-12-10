import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";

function Register(props) {
  const genderOptions = [
    { value: "", label: "Select your gender" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  const navigate = useNavigate();

  const [formRegister, setFormRegister] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    birth: "",
    sex: "",
    profile: "",
  });

  const [birthDate, setBirthdate] = useState(null);

  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = "" + d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [month, day, year].join("-");
  };

  const onChangeForm = (label, event) => {
    switch (label) {
      case "name":
        setFormRegister({ ...formRegister, name: event.target.value });
        break;
      case "username":
        setFormRegister({ ...formRegister, username: event.target.value });
        break;
      case "email":
        setFormRegister({ ...formRegister, email: event.target.value });
        break;
      case "phone_number":
        setFormRegister({ ...formRegister, phone_number: event.target.value });
        break;
      case "password":
        setFormRegister({ ...formRegister, password: event.target.value });
        break;
      case "sex":
        setFormRegister({ ...formRegister, sex: event.target.value });
        break;
      case "birth":
        setBirthdate(event);
        setFormRegister({ ...formRegister, birth: formatDate(event) });
        break;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formRegister);
    // Post to register API
    await axios
      .post("http://18.220.228.7:8000/auth/register", formRegister)
      .then((response) => {
        navigate("/?signin");

        toast.success(response.data.detail);

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        console.log(response);
      })
      .catch((error) => {
        console.log(error);

        toast.error(error);
      });
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center mb-4 ">
          Create an account
        </h1>
        <p className="w-80 text-center text-lg mb-5 font-semibold text-gray-700 tracking-wide mx-auto">
          Welcome to my page!
        </p>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("name", event);
            }}
          />
          <DatePicker
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            dateFormat="MM-dd-yyyy"
            placeholderText="Birth date"
            selected={birthDate}
            onChange={(event) => {
              onChangeForm("birth", event);
            }}
          />
          <select
            value={formRegister.sex}
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("sex", event);
            }}
          >
            {genderOptions.map((data) => {
              if (data.value === "") {
                return (
                  <option key={data.label} value={data.value} disabled>
                    {data.label}
                  </option>
                );
              } else {
                return (
                  <option key={data.label} value={data.value}>
                    {data.label}
                  </option>
                );
              }
            })}
          </select>

          <input
            type="text"
            placeholder="Username"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("username", event);
            }}
          />
          <input
            type="number"
            placeholder="Phone number"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("phone_number", event);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            className="block text-sm py-3 px-4 rounded-lg w-full border outline-none focus:ring focus:outline-none focus:ring-blue-400"
            onChange={(event) => {
              onChangeForm("email", event);
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
            Create Account
          </button>
          <p className="mt-4 text-sm">
            Already have an account,{" "}
            <Link
              to="/?login"
              onClick={() => {
                props.setPage("login");
              }}
            >
              <span className="underline cursor-pointer">Log in</span>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default Register;
