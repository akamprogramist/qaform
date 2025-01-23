"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

const Header = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: include credentials
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const { success, message } = await response.json();
      if (success) {
        setCurrentUser(null);
        router.push("/");
        toast.success(message);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {currentUser && (
        <header className="sticky top-0 z-50 w-full">
          <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 shadow-md">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
              <Link
                href="/"
                className="flex items-center space-x-3 text-xl font-semibold"
              >
                <span className="dark:text-white">Hello</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <Link
                      href="/"
                      className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  {currentUser && (
                    <li>
                      <Link
                        href="/dashboard"
                        className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-500 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center lg:order-2 space-x-2">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 dark:text-gray-200">
                      {currentUser.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`px-4 py-2 rounded-lg text-white transition-colors
                    ${
                      isLoggingOut
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    }`}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <button className="px-4 py-2 rounded-lg text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                        Log In
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-4 py-2 rounded-lg text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      )}
    </>
  );
};

export default Header;
