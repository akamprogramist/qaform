"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setCurrentUser(JSON.parse(storedUserData));
      setLoading(false);
    } else {
      const fetchCurrentUser = async () => {
        try {
          const res = await fetch("/api/auth/currentuser");
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const user = await res.json();

          setCurrentUser(user);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
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
