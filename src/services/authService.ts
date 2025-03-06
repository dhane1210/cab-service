import api from "./api";

export const login = async (username: string, password: string) => {
  const response = await api.post("/user/login", { username, password });
  const { token, id, username: loggedInUsername, role } = response.data;
  localStorage.setItem("token", token); // Store the JWT token
  localStorage.setItem("user", JSON.stringify({ id, username: loggedInUsername, role })); // Store user details
  return { token, id, username: loggedInUsername, role };
};
export const logout = async () => {
  localStorage.removeItem("token"); // Clear the token
  window.location.href = "/login"; // Replace with your login route
};

export const checkSession = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const response = await api.get("/user/check-session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.status === 200;
  } catch {
    return false;
  }
};
export const register = async (username: string, password: string, address: string, phone: string, nic: string) => {
  const response = await api.post("/user/add-user", { username, password, address, phone, nic });
  const { token, id, username: registeredUsername, role } = response.data;
  localStorage.setItem("token", token); // Store the JWT token
  localStorage.setItem("user", JSON.stringify({ id, username: registeredUsername, role })); // Store user details
  return { token, id, username: registeredUsername, role };
};