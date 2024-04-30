import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormData {
  username: string;
  password: string;
  email: string;
  is_admin: boolean;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    email: string;
    is_admin: boolean;
  }>({
    username: "",
    password: "",
    email: "",
    is_admin: false,
  });
  const [errors, seterrors] = useState();
  const [sucess, setsuccess] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "is_admin" ? value === "true" : value, // Convert value to boolean for is_admin field
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        formData.email === "" ||
        formData.password === "" ||
        formData.username === "" ||
        formData.email === ""
      ) {
        seterrors("please fill all feilds");
        return;
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup successful:", response.data, response.status);
      if (response.status !== 201) {
        seterrors(response.data);
      } else {
        const { token } = response.data;
        if (formData.is_admin) {
          sessionStorage.setItem("admintoken", token);
        } else {
          sessionStorage.setItem("usertoken", token);
        }
        setsuccess(true);
      }
    } catch (error) {
      console.error("Signup failed:", error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 font-bold mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 font-bold mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="is_admin"
          className="block text-gray-700 font-bold mb-2"
        >
          Is Admin?
        </label>
        <select
          id="is_admin"
          name="is_admin"
          value={formData.is_admin.toString()}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
      <div className="text-red-500">{JSON.stringify(errors)}</div>
      {sucess && <div className="text-green-700">user created succesfully</div>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
