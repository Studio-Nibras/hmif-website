import { apiRequest } from "../../../../services/api";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, value);
    }
  });

  return query.toString();
}

export function getPrograms(params = {}) {
  return apiRequest(`/admin/programs?${buildQuery(params)}`);
}

export function getProgramById(id) {
  return apiRequest(`/admin/programs/${id}`);
}

export function getProgramDivisions() {
  return apiRequest("/admin/programs/divisions");
}

export function uploadProgramImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/admin/programs/upload-image", {
    method: "POST",
    body: formData,
  });
}

export function createProgram(data) {
  return apiRequest("/admin/programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProgram(id, data) {
  return apiRequest(`/admin/programs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProgram(id) {
  return apiRequest(`/admin/programs/${id}`, {
    method: "DELETE",
  });
}
