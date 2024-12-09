const API_BASE_URL = "http://localhost:3000/api";

export const userService = {
  getUsers: async (page, search, role, accountStatus) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(role !== "all" && { role }),
      ...(accountStatus !== "all" && { accountStatus }),
    });

    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },

  addUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        personalDetails: {
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          city: userData.city,
          state: userData.state,
          postalCode: userData.postalCode,
        },
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return response.json();
  },

  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    const data = await response.json();

    // Flatten the `personalDetails` structure for the frontend
    return {
      ...data,
      phoneNumber: data.personalDetails?.phoneNumber || "",
      country: data.personalDetails?.country || "",
      city: data.personalDetails?.city || "",
      state: data.personalDetails?.state || "",
      postalCode: data.personalDetails?.postalCode || "",
    };
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        personalDetails: {
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          city: userData.city,
          state: userData.state,
          postalCode: userData.postalCode,
        },
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.json();
  },

  updateUserRoleAndStatus: async (userId, role, accountStatus) => {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/role-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, accountStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user role and status");
    }
    return response.json();
  },
};
