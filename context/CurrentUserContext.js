"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedUserToken = localStorage.getItem("token");
    if (storedUserData) {
      const tokenInCookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (!tokenInCookies) {
        // Set the token into cookies
        document.cookie = `token=${storedUserToken}; path=/; secure; samesite=strict`;
      }
      setCurrentUser({ ...JSON.parse(storedUserData), token: storedUserToken });
      setLoading(false);
    } else {
      const fetchCurrentUser = async () => {
        try {
          const res = await fetch("/api/auth/currentuser");
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const { user, token } = await res.json();

          setCurrentUser({ user, token });
        } catch {
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      };
      fetchCurrentUser();
    }
  }, []);
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });

      localStorage.removeItem("userData");

      toast.success("Logged Out Successfully");

      setCurrentUser(null);
    } catch (error) {
      console.error("Logout Request Error: ", error);
    }
  };
  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, loading, setLoading, logout }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
};
