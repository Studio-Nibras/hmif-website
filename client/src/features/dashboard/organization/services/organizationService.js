import { apiRequest } from "../../../../services/api";

export async function getDivisions() {
  return apiRequest("/admin/organization/divisions");
}

export async function createDivision(data) {
  return apiRequest("/admin/organization/divisions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDivision(id, data) {
  return apiRequest(`/admin/organization/divisions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDivision(id) {
  return apiRequest(`/admin/organization/divisions/${id}`, {
    method: "DELETE",
  });
}

export async function getMembers(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();

  return apiRequest(
    `/admin/organization/members${query ? `?${query}` : ""}`,
  );
}

export async function getMemberById(id) {
  return apiRequest(`/admin/organization/members/${id}`);
}

export async function createMember(data) {
  return apiRequest("/admin/organization/members", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMember(id, data) {
  return apiRequest(`/admin/organization/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMember(id) {
  return apiRequest(`/admin/organization/members/${id}`, {
    method: "DELETE",
  });
}

export async function uploadMemberPhoto(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/admin/organization/upload-photo", {
    method: "POST",
    body: formData,
  });
}
