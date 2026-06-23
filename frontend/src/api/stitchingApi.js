import api from "./backendApi";

export function getStitchingOrders() {
  return api.get("/stitching/");
}

export function getStitchingOrder(orderId) {
  return api.get(`/stitching/${orderId}/`);
}

export function createStitchingOrder(data) {
  return api.post("/stitching/create/", data);
}

export function updateStitchingStatus(orderId, status) {
  return api.put(`/stitching/${orderId}/update-status/`, { status });
}

export function deleteStitchingOrder(orderId) {
  return api.delete(`/stitching/${orderId}/delete/`);
}

export function collectStitchingPayment(orderId, amount) {
  return api.post(`/stitching/${orderId}/collect-payment/`, { amount });
}
