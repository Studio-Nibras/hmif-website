import { apiRequest } from "../../services/api";

export function loginAdmin(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentAdmin() {
  return apiRequest("/auth/me");
}

export function logoutAdmin() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}
