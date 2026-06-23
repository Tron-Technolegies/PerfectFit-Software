import api from "./backendApi";

export function getCategories() {
  return api.get("/categories/");
}

export function createCategory(data) {
  return api.post("/categories/create/", data);
}

export function updateCategory(categoryId, data) {
  return api.put(`/categories/${categoryId}/update/`, data);
}

export function deleteCategory(categoryId) {
  return api.delete(`/categories/${categoryId}/delete/`);
}
