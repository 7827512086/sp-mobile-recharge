const OPERATOR_INFO = {
  jio: {
    id: "jio",
    name: "Jio",
    color: "#0056c8",
    bgColor: "bg-blue-600",
    textColor: "text-white"
  },
  airtel: {
    id: "airtel",
    name: "Airtel",
    color: "#e40000",
    bgColor: "bg-red-600",
    textColor: "text-white"
  },
  vi: {
    id: "vi",
    name: "Vi",
    color: "#e60099",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  },
  bsnl: {
    id: "bsnl",
    name: "BSNL",
    color: "#006400",
    bgColor: "bg-green-700",
    textColor: "text-white"
  },
  tataSky: {
    id: "tataSky",
    name: "Tata Sky",
    color: "#003087",
    bgColor: "bg-blue-800",
    textColor: "text-white"
  },
  dishTV: {
    id: "dishTV",
    name: "Dish TV",
    color: "#ff6600",
    bgColor: "bg-orange-500",
    textColor: "text-white"
  }
};
function formatBalance(paisa) {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(rupees);
}
function formatTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(ms));
}
function formatTxType(txType) {
  const labels = {
    topUp: "Wallet Top-Up",
    recharge: "Mobile/DTH Recharge",
    transfer: "Money Transfer",
    bill: "Bill Payment",
    deposit: "Digital Deposit"
  };
  return labels[txType] ?? String(txType);
}
function getBillCategoryIcon(category) {
  const icons = {
    electricity: "⚡",
    water: "💧",
    gas: "🔥",
    internet: "🌐"
  };
  return icons[category] ?? "📄";
}
function getBillCategoryLabel(category) {
  const labels = {
    electricity: "Electricity",
    water: "Water",
    gas: "Gas",
    internet: "Internet / Broadband"
  };
  return labels[category] ?? String(category);
}
function getDepositRateForDuration(durationDays) {
  if (durationDays >= 365) return 1e3;
  if (durationDays >= 90) return 800;
  if (durationDays >= 60) return 600;
  if (durationDays >= 30) return 400;
  return 300;
}
export {
  OPERATOR_INFO as O,
  formatBalance as a,
  getBillCategoryLabel as b,
  getDepositRateForDuration as c,
  formatTxType as d,
  formatTimestamp as f,
  getBillCategoryIcon as g
};
