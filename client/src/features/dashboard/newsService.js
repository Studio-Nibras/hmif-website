import { apiRequest } from "../../services/api";

export function uploadNewsImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/admin/news/upload-image", {
    method: "POST",
    body: formData,
  });
}

export function getNewsCategories() {
  return apiRequest("/admin/news/categories");
}

export function getNews(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, value);
    }
  });

  return apiRequest(`/admin/news?${query.toString()}`);
}

export function getNewsById(id) {
  return apiRequest(`/admin/news/${id}`);
}

export function createNews(data) {
  return apiRequest("/admin/news", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateNews(id, data) {
  return apiRequest(`/admin/news/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteNews(id) {
  return apiRequest(`/admin/news/${id}`, {
    method: "DELETE",
  });
}
