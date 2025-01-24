"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../../context/CurrentUserContext";
import Link from "next/link";
import { toast } from "react-toastify";

const Login = () => {
  const { currentUser, setCurrentUser, loading, setLoading } = useCurrentUser();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Login failed");
      } else {
        const data = await res.json();
        const userData = data.user;
        if (data.success && userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
          toast.success(data.message);
          setCurrentUser(userData);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      console.error("Failed to login:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full mx-auto max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
      <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
        Login To Your Account
      </div>
      <div className="mt-8">
        <form>
          <div className="flex flex-col mb-2">
            <div className="flex relative ">
              <input
                type="text"
                id="email"
                className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col mb-6">
            <div className="flex relative ">
              <input
                type="password"
                id="password"
                className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full">
            <button
              disabled={loading}
              onClick={handleLogin}
              type="submit"
              className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                loading ? "bg-gray-700 hover:bg-gray-800" : undefined
              }`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center mt-6">
        <Link
          href="/register"
          className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
        >
          <span className="ml-2">You don&#x27;t have an account?</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
