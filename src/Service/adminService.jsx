const API_BASE =
  "https://trid-dtgpbjcyecekdea8.uaenorth-01.azurewebsites.net/api/v1/admin";

export const adminService = {
  searchUsers: async (email, page = 0, size = 10) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${API_BASE}/users/search?email=${encodeURIComponent(
        email
      )}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMsg =
        response.status === 403
          ? "Access denied. Admin privileges required."
          : response.status === 400
          ? "Invalid email pattern."
          : `Error: ${response.status}`;
      throw new Error(errorMsg);
    }

    return await response.json();
  },

  updateUserRoles: async (userId, roles) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_BASE}/users/${userId}/roles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roles),
    });

    if (!response.ok) {
      const errorMsg =
        response.status === 403
          ? "Access denied. Admin privileges required."
          : response.status === 404
          ? "User not found."
          : response.status === 400
          ? "Invalid roles format."
          : `Error: ${response.status}`;
      throw new Error(errorMsg);
    }

    return await response.json();
  },
};
