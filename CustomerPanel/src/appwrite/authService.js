import { Account, Teams } from "appwrite";
import { client } from "./appwriteConfig";
import { v4 as uuidv4 } from "uuid";
const account = new Account(client);
const teams = new Teams(client);

export const signup = async (email, password) => {
  try {
    // Create the user with a unique ID, email, and password
    const user = await account.create("o328u4o23u", email, password);

    // Add the user to the 'User' team using their user ID, not email
    await teams.createMembership(
      import.meta.env.VITE_APPWRITE_TEAM_USER_ID, // Team ID from environment variable
      ["member"], // Role as 'member'
      email, // Pass user email instead of user ID
      "http://localhost:3000/verification"
    );

    return user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

export const getTeams = async () => {
  const teams = await appwrite.teams.list();
  return teams;
};

export const login = async (email, password) => {
  // Now proceed with login
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    const userTeams = await teams.list();

    return { user, userTeams };
  } catch (error) {
    return null;
  }
};
