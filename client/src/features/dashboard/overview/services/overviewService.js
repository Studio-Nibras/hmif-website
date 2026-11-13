import { apiRequest } from "../../../../services/api";

export function getOverviewStats() {
  return apiRequest("/admin/overview/stats");
}

export function getPublicationActivity() {
  return apiRequest("/admin/overview/publication-activity");
}
