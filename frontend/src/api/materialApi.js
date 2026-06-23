import api from "./backendApi";

export function getMaterials() {
  return api.get("/materials/");
}

export function getMaterial(materialId) {
  return api.get(`/materials/${materialId}/`);
}

export function createMaterial(data) {
  return api.post("/materials/create/", data);
}

export function updateMaterial(materialId, data) {
  return api.put(`/materials/${materialId}/update/`, data);
}

export function deleteMaterial(materialId) {
  return api.delete(`/materials/${materialId}/delete/`);
}

export function recordMaterialPurchase(data) {
  return api.post("/purchases/create/", data);
}

export function getMaterialPurchases() {
  return api.get("/purchases/");
}
