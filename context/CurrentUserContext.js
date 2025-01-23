"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState();
  useEffect(() => {
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
  }, []);
  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, loading }}
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
