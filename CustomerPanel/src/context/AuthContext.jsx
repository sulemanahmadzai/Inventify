import React, { createContext, useState, useEffect } from "react";
import {
  login,
  logout,
  getCurrentUser,
  getTeams,
} from "../appwrite/authService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]); // Update to roles array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { user: currentUser, userTeams } = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Map team IDs to role names
          const roleNames = userTeams.teams.map((team) => team.name);
          setRoles(roleNames);
        }
      } catch (error) {
        console.log(user);
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      const { user: currentUser, userTeams } = await getCurrentUser();
      setUser(currentUser);
      const roleNames = userTeams.teams.map((team) => team.name);
      console.log(roleNames);
      setRoles(roleNames); // Correctly set the roles array

      console.log(roles);
      return currentUser;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setRoles([]);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, roles, loading, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
