import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface BillRecord {
    id: BillId;
    status: BillStatus;
    userId: UserId;
    billerId: string;
    timestamp: Timestamp;
    category: BillCategory;
    amount: bigint;
}
export type BillPayResult = {
    __kind__: "ok";
    ok: BillRecord;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "insufficientBalance";
    insufficientBalance: null;
} | {
    __kind__: "userNotFound";
    userNotFound: null;
};
export interface PlanView {
    id: PlanId;
    validity: bigint;
    operator: Operator;
    name: string;
    description: string;
    isActive: boolean;
    price: bigint;
    planType: PlanType;
}
export interface OperatorRevenue {
    operator: Operator;
    totalCount: bigint;
    totalRevenue: bigint;
}
export type DepositResult = {
    __kind__: "ok";
    ok: DepositRecord;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "insufficientBalance";
    insufficientBalance: null;
} | {
    __kind__: "userNotFound";
    userNotFound: null;
} | {
    __kind__: "invalidDuration";
    invalidDuration: null;
};
export interface TransferRecord {
    id: TransferId;
    status: TransferStatus;
    note: string;
    timestamp: Timestamp;
    amount: bigint;
    recipientId: UserId;
    senderId: UserId;
}
export type BillId = bigint;
export interface Transaction {
    id: TransactionId;
    status: TransactionStatus;
    planId: PlanId;
    userId: UserId;
    operator: Operator;
    targetNumber: string;
    timestamp: Timestamp;
    amount: bigint;
}
export type RechargeResult = {
    __kind__: "ok";
    ok: Transaction;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "insufficientBalance";
    insufficientBalance: null;
} | {
    __kind__: "planNotFound";
    planNotFound: null;
} | {
    __kind__: "planInactive";
    planInactive: null;
};
export type TopUpResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type TransactionId = bigint;
export interface InitiateRechargeArgs {
    planId: PlanId;
    targetNumber: string;
}
export interface DepositRecord {
    id: DepositId;
    durationDays: bigint;
    maturedAt?: Timestamp;
    startTime: Timestamp;
    status: DepositStatus;
    principal: bigint;
    maturityTime: Timestamp;
    userId: UserId;
    interestRate: bigint;
    interestEarned: bigint;
}
export type TransferResult = {
    __kind__: "ok";
    ok: TransferRecord;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "insufficientBalance";
    insufficientBalance: null;
} | {
    __kind__: "recipientNotFound";
    recipientNotFound: null;
} | {
    __kind__: "senderNotFound";
    senderNotFound: null;
};
export interface Analytics {
    totalCount: bigint;
    byOperator: Array<OperatorRevenue>;
    totalRevenue: bigint;
}
export type PlanId = bigint;
export interface CreatePlanArgs {
    validity: bigint;
    operator: Operator;
    name: string;
    description: string;
    price: bigint;
    planType: PlanType;
}
export interface PublicSettings {
    enableMobileRecharge: boolean;
    enableDthRecharge: boolean;
    appDisplayName: string;
    enableDigitalDeposit: boolean;
    enableBillPayment: boolean;
    enableMoneyTransfer: boolean;
}
export interface UpdatePlanArgs {
    id: PlanId;
    validity: bigint;
    name: string;
    description: string;
    price: bigint;
}
export type TxExtra = {
    __kind__: "topUp";
    topUp: {
    };
} | {
    __kind__: "bill";
    bill: {
        billerId: string;
        category: BillCategory;
    };
} | {
    __kind__: "deposit";
    deposit: {
        durationDays: bigint;
        interestRate: bigint;
    };
} | {
    __kind__: "recharge";
    recharge: {
        planId: bigint;
        operator: Operator;
        targetNumber: string;
    };
} | {
    __kind__: "transfer";
    transfer: {
        note: string;
        recipientId: UserId;
    };
};
export interface AppSettingsUpdate {
    enableMobileRecharge?: boolean;
    enableDthRecharge?: boolean;
    appDisplayName?: string;
    commissionRateBps?: bigint;
    enableDigitalDeposit?: boolean;
    enableBillPayment?: boolean;
    enableMoneyTransfer?: boolean;
}
export interface AppSettings {
    enableMobileRecharge: boolean;
    enableDthRecharge: boolean;
    appDisplayName: string;
    commissionRateBps: bigint;
    enableDigitalDeposit: boolean;
    enableBillPayment: boolean;
    enableMoneyTransfer: boolean;
}
export type UserId = Principal;
export type TransferId = bigint;
export interface UserProfileView {
    id: UserId;
    createdAt: Timestamp;
    isAdmin: boolean;
    walletBalance: bigint;
}
export interface TxRecord {
    id: bigint;
    status: TxStatus;
    userId: UserId;
    extra: TxExtra;
    timestamp: Timestamp;
    txType: TxType;
    amount: bigint;
}
export interface TxFilter {
    status?: TxStatus;
    dateTo?: Timestamp;
    operator?: Operator;
    txType?: TxType;
    dateFrom?: Timestamp;
}
export type DepositId = bigint;
export type MatureResult = {
    __kind__: "ok";
    ok: DepositRecord;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "alreadyProcessed";
    alreadyProcessed: null;
} | {
    __kind__: "notYetMatured";
    notYetMatured: null;
} | {
    __kind__: "depositNotFound";
    depositNotFound: null;
};
export enum BillCategory {
    gas = "gas",
    internet = "internet",
    electricity = "electricity",
    water = "water"
}
export enum BillStatus {
    success = "success",
    failed = "failed"
}
export enum DepositStatus {
    active = "active",
    matured = "matured",
    withdrawn = "withdrawn"
}
export enum Operator {
    vi = "vi",
    jio = "jio",
    bsnl = "bsnl",
    airtel = "airtel",
    tataSky = "tataSky",
    dishTV = "dishTV"
}
export enum PlanType {
    dth = "dth",
    mobile = "mobile"
}
export enum TransactionStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
}
export enum TxType {
    topUp = "topUp",
    bill = "bill",
    deposit = "deposit",
    recharge = "recharge",
    transfer = "transfer"
}
export interface backendInterface {
    adminCreatePlan(args: CreatePlanArgs): Promise<PlanView>;
    adminGetAllTransactions(): Promise<Array<Transaction>>;
    adminGetAllTransactionsV2(filter: TxFilter): Promise<Array<TxRecord>>;
    adminGetAnalytics(): Promise<Analytics>;
    adminGetSettings(): Promise<AppSettings>;
    adminListUsers(): Promise<Array<UserProfileView>>;
    adminSetRole(target: UserId, isAdmin: boolean): Promise<boolean>;
    adminTogglePlan(id: PlanId): Promise<PlanView | null>;
    adminUpdatePlan(args: UpdatePlanArgs): Promise<PlanView | null>;
    adminUpdateSettings(update: AppSettingsUpdate): Promise<void>;
    createDeposit(amount: bigint, durationDays: bigint): Promise<DepositResult>;
    getActivePlans(planType: PlanType | null): Promise<Array<PlanView>>;
    getBalance(): Promise<bigint>;
    getMyBillPayments(): Promise<Array<BillRecord>>;
    getMyDeposits(): Promise<Array<DepositRecord>>;
    getMyTransactions(): Promise<Array<Transaction>>;
    getPlan(id: PlanId): Promise<PlanView | null>;
    getProfile(): Promise<UserProfileView | null>;
    getPublicSettings(): Promise<PublicSettings>;
    getTransferHistory(): Promise<Array<TransferRecord>>;
    initiateRecharge(args: InitiateRechargeArgs): Promise<RechargeResult>;
    matureDeposit(depositId: bigint): Promise<MatureResult>;
    payBill(category: BillCategory, billerId: string, amount: bigint): Promise<BillPayResult>;
    register(): Promise<UserProfileView>;
    topUpWallet(amountPaisa: bigint): Promise<TopUpResult>;
    transferFunds(recipientPrincipal: Principal, amount: bigint, note: string): Promise<TransferResult>;
}
