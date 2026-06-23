import api from "./backendApi";

export function getInventoryItems() {
  return api.get("/items/");
}

export function getInventoryItem(itemId) {
  return api.get(`/items/${itemId}/`);
}

export function createInventoryItem(data) {
  if (data instanceof FormData) {
    return api.post("/items/create/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.post("/items/create/", data);
}

export function updateInventoryItem(itemId, data) {
  if (data instanceof FormData) {
    return api.put(`/items/${itemId}/update/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/items/${itemId}/update/`, data);
}

export function deleteInventoryItem(itemId) {
  return api.delete(`/items/${itemId}/delete/`);
}

export function getInventoryCategories() {
  return api.get("/categories/");
}
