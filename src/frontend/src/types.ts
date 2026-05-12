import type {
  Analytics,
  AppSettings,
  AppSettingsUpdate,
  BillCategory,
  BillRecord,
  BillStatus,
  CreatePlanArgs,
  DepositRecord,
  DepositStatus,
  InitiateRechargeArgs,
  Operator,
  OperatorRevenue,
  PlanId,
  PlanType,
  PlanView,
  PublicSettings,
  RechargeResult,
  Timestamp,
  TopUpResult,
  Transaction,
  TransactionId,
  TransactionStatus,
  TransferRecord,
  TxFilter,
  TxRecord,
  TxType,
  UpdatePlanArgs,
  UserId,
  UserProfileView,
} from "./backend";

export type {
  Operator,
  PlanType,
  PlanView,
  Transaction,
  TransactionStatus,
  UserProfileView,
  Analytics,
  OperatorRevenue,
  RechargeResult,
  TransactionId,
  PlanId,
  UserId,
  Timestamp,
  CreatePlanArgs,
  UpdatePlanArgs,
  InitiateRechargeArgs,
  TopUpResult,
  TransferRecord,
  BillRecord,
  BillCategory,
  BillStatus,
  DepositRecord,
  DepositStatus,
  AppSettings,
  AppSettingsUpdate,
  PublicSettings,
  TxRecord,
  TxFilter,
  TxType,
};

export interface MockTransaction {
  id: string;
  date: string;
  label: string;
  amount: number;
  status: "success" | "pending" | "failed";
  operator: Operator;
}

export interface OperatorInfo {
  id: Operator;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const OPERATOR_INFO: Record<Operator, OperatorInfo> = {
  jio: {
    id: "jio" as Operator,
    name: "Jio",
    color: "#0056c8",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  airtel: {
    id: "airtel" as Operator,
    name: "Airtel",
    color: "#e40000",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
  vi: {
    id: "vi" as Operator,
    name: "Vi",
    color: "#e60099",
    bgColor: "bg-purple-600",
    textColor: "text-white",
  },
  bsnl: {
    id: "bsnl" as Operator,
    name: "BSNL",
    color: "#006400",
    bgColor: "bg-green-700",
    textColor: "text-white",
  },
  tataSky: {
    id: "tataSky" as Operator,
    name: "Tata Sky",
    color: "#003087",
    bgColor: "bg-blue-800",
    textColor: "text-white",
  },
  dishTV: {
    id: "dishTV" as Operator,
    name: "Dish TV",
    color: "#ff6600",
    bgColor: "bg-orange-500",
    textColor: "text-white",
  },
};

export function formatBalance(paisa: bigint): string {
  const rupees = Number(paisa) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

export function formatTxType(txType: TxType): string {
  const labels: Record<string, string> = {
    topUp: "Wallet Top-Up",
    recharge: "Mobile/DTH Recharge",
    transfer: "Money Transfer",
    bill: "Bill Payment",
    deposit: "Digital Deposit",
  };
  return labels[txType as string] ?? String(txType);
}

export function getBillCategoryIcon(category: BillCategory): string {
  const icons: Record<string, string> = {
    electricity: "⚡",
    water: "💧",
    gas: "🔥",
    internet: "🌐",
  };
  return icons[category as string] ?? "📄";
}

export function getBillCategoryLabel(category: BillCategory): string {
  const labels: Record<string, string> = {
    electricity: "Electricity",
    water: "Water",
    gas: "Gas",
    internet: "Internet / Broadband",
  };
  return labels[category as string] ?? String(category);
}

/** Returns annual interest rate (in basis points) for a deposit duration */
/** Returns annual interest rate (in basis points) for a deposit duration */
export function getDepositRateForDuration(durationDays: number): number {
  if (durationDays >= 365) return 1000; // 10.00%
  if (durationDays >= 90) return 800; // 8.00%
  if (durationDays >= 60) return 600; // 6.00%
  if (durationDays >= 30) return 400; // 4.00%
  return 300; // 3.00%
}
