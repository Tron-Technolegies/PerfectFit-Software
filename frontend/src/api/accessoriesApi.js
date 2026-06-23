import api from "./backendApi";

export const getAccessories = () => api.get("/accessories/");
export const createAccessory = (data) => api.post("/accessories/create/", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateAccessory = (id, data) => api.post(`/accessories/${id}/update/`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteAccessory = (id) => api.delete(`/accessories/${id}/delete/`);

export const getAccessorySales = () => api.get("/accessories/sales/");
export const recordAccessorySale = (data) => api.post("/accessories/sales/create/", data);
export const updateAccessorySale = (id, data) => api.put(`/accessories/sales/${id}/update/`, data);
export const deleteAccessorySale = (id) => api.delete(`/accessories/sales/${id}/delete/`);
