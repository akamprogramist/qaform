"use client";
import Image from "next/image";
import { deleteCookie, getCookie } from "cookies-next/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            hello
          </Link>
          <div className="flex items-center lg:order-2 space-x-2">
            {currentUser ? (
              <div
                onClick={() => {
                  deleteCookie("token");

                  window.location.reload();
                }}
                className="p-1 bg-gray-300 shadow rounded-full cursor-pointer"
              >
                hell
              </div>
            ) : (
              <Link href="/register">
                <button className="ml-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                  Sign In
                </button>
              </Link>
            )}
          </div>
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <Link href="/" className="navbar-link" aria-current="page">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
