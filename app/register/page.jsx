"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../context/CurrentUserContext";

const Register = () => {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!fullname || !email || !password) {
      setErrorMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: fullname.trim(),
          email: email.trim(),
          password,
        }),
      });

      // First check if the response is ok
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Try to parse the response
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        // Clear form
        setFullname("");
        setEmail("");
        setPassword("");
        // Redirect after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMsg(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMsg(error.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full mx-auto max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
      <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
        Register To Your Account
      </div>

      {errorMsg && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">Error: </span>
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
          role="alert"
        >
          {successMsg}
        </div>
      )}

      <div className="mt-8 w-full">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="fullname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-50"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              loading ? "bg-gray-700 hover:bg-gray-800 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
