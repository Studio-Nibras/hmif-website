import { apiRequest } from "../../../services/api";

export function getPublicPrograms(page = 1, limit = 9) {
  return apiRequest(`/programs?page=${page}&limit=${limit}`);
}

export function getPublicProgramBySlug(slug) {
  return apiRequest(`/programs/${encodeURIComponent(slug)}`);
}
