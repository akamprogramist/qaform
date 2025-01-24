"use client";

import Link from "next/link";
import { useCurrentUser } from "../context/CurrentUserContext";
const Header = () => {
  const { currentUser, logout, loading } = useCurrentUser();
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
                      onClick={logout}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg text-white transition-colors
                    ${
                      loading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    }`}
                    >
                      {loading ? "Logging out..." : "Logout"}
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
