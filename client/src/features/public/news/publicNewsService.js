
import { apiRequest } from "../../../services/api";

export function getPublicNews(page = 1, limit = 9) {
  return apiRequest(`/news?page=${page}&limit=${limit}`);
}

export function getPublicNewsBySlug(slug) {
  return apiRequest(`/news/${encodeURIComponent(slug)}`);
}
