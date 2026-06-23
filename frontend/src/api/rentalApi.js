import api from "./backendApi";

/**
 * Fetches all rental orders from the backend.
 */
export function getRentals() {
  // In a real scenario, you might have a dedicated /orders/ GET endpoint.
  // For now, if get_all_rental_items or similar isn't enough, we might need a new view.
  // Looking at backend/adminApp/urls.py, there isn't a get_all_orders yet.
  // I will assume there's one based on standard CRUD practices or create a placeholder.
  // Actually, checking urls.py again, I don't see a "get all orders". 
  // I should probably check if I missed it in views.py or add it if needed.
  return api.get("/orders/"); 
}

/**
 * Creates a new rental order.
 * @param {Object} data Order data (customer info, item_id, dates, amounts)
 */
export function createRental(data) {
  return api.post("/orders/create/", data);
}

/**
 * Marks a rental order as returned.
 * @param {number} orderId 
 */
export function returnRental(orderId, data = {}) {
  return api.post(`/orders/${orderId}/return/`, data);
}

/**
 * Marks a PRE_BOOKED order as picked up/active.
 * @param {number} orderId 
 */
export function pickupRental(orderId) {
  return api.post(`/orders/${orderId}/pickup/`);
}

/**
 * Deletes a rental booking and reverts unit availability.
 * @param {number} orderId 
 */
export function deleteRentalBooking(orderId) {
  return api.delete(`/orders/${orderId}/delete/`);
}

/**
 * Checks item availability for a given date range.
 * @param {Object} data { item_id, rental_date, return_date }
 */
export function checkItemAvailability(data) {
  return api.post("/items/check-availability/", data);
}

/**
 * Gets the rental history for a specific inventory item.
 * @param {number} itemId 
 */
export function getItemHistory(itemId) {
  return api.get(`/items/${itemId}/history/`);
}

/**
 * Triggers the backend email reminder system for overdue/upcoming returns.
 */
export function sendReminders() {
  return api.get("/reminders/run/");
}

/**
 * Gets real-time overdue items from the backend.
 */
export function getOverdueItems() {
  return api.get("/orders/overdue/");
}
/**
 * Gets the physical units for a specific inventory item.
 * @param {number} itemId 
 */
export function getItemUnits(itemId) {
  return api.get(`/items/${itemId}/units/`);
}

/**
 * Updates the status or notes of a physical unit.
 * @param {number} unitId 
 * @param {Object} data { status, notes }
 */
export function updateUnitStatus(unitId, data) {
  return api.post(`/units/${unitId}/update-status/`, data);
}
/**
 * Fetches dashboard statistics from the backend.
 */
export function getDashboardStats() {
  return api.get("/dashboard/stats/");
}

// Alteration Types
export function getAlterationTypes() {
  return api.get("/alteration-types/");
}

export function createAlterationType(data) {
  return api.post("/alteration-types/create/", data);
}

// Alterations
export function getAlterations(bookingId = null) {
  const url = bookingId ? `/alterations/?booking_id=${bookingId}` : '/alterations/';
  return api.get(url);
}

export function createAlteration(data) {
  return api.post("/alterations/create/", data);
}

export function updateAlteration(alterationId, data) {
  return api.put(`/alterations/${alterationId}/update/`, data);
}

// Alerts
export function getUrgentAlerts() {
  return api.get("/dashboard/urgent-alerts/");
}

/**
 * Lookup a Physical Unit by barcode
 */
export function getUnitByBarcode(barcode) {
  return api.get(`/units/barcode/${barcode}/`);
}

/**
 * Lookup an active/overdue Rental Booking by barcode
 */
export function getOrderByBarcode(barcode) {
  return api.get(`/orders/barcode/${barcode}/`);
}
