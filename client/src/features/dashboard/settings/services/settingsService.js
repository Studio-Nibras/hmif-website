import { apiRequest } from "../../../../services/api";

export async function getAdminSettings() {
  const result = await apiRequest("/admin/settings");
  return result.settings;
}

export async function updateAdminSettings(settings) {
  const result = await apiRequest("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify({ settings }),
  });

  return result;
}
