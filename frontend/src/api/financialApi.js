import api from "./backendApi";

export function getProfit() {
  return api.get("/get-profit/");
}

export function addExpense(data) {
  return api.post("/add-expense/", data);
}

export function getDashboardData(range = "6m") {
  return api.get(`/get-dashboard-data/?range=${range}`);
}

