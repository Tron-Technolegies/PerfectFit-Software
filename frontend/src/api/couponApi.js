import api from "./backendApi";

export const getCoupons = () => api.get("coupons/");
export const createCoupon = (data) => api.post("coupons/create/", data);
export const updateCoupon = (id, data) => api.put(`coupons/${id}/update/`, data);
export const deleteCoupon = (id) => api.delete(`coupons/${id}/delete/`);
export const validateCoupon = (code, subtotal) => api.post("coupons/validate/", { code, subtotal });
