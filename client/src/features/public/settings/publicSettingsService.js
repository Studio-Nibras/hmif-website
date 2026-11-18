import { apiRequest } from "../../../services/api";

export async function getPublicSettings() {
  const result = await apiRequest("/settings");
  return result.settings;
}
