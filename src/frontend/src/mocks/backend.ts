import type { backendInterface } from "../backend";
import {
  BillCategory,
  BillStatus,
  DepositStatus,
  Operator,
  PlanType,
  TransactionStatus,
  TxType,
} from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const mockPrincipal = {
  toText: () => "aaaaa-aa",
  toString: () => "aaaaa-aa",
  compareTo: () => 0,
  isAnonymous: () => false,
  toUint8Array: () => new Uint8Array(0),
  toHex: () => "00000000",
  __principal__: "aaaaa-aa",
} as unknown as Principal;

const now = BigInt(Date.now()) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  adminCreatePlan: async (args) => ({
    id: BigInt(99),
    validity: args.validity,
    operator: args.operator,
    name: args.name,
    description: args.description,
    isActive: true,
    price: args.price,
    planType: args.planType,
  }),

  adminGetAllTransactions: async () => [
    {
      id: BigInt(1),
      status: TransactionStatus.success,
      planId: BigInt(1),
      userId: mockPrincipal,
      operator: Operator.jio,
      targetNumber: "9876543210",
      timestamp: now,
      amount: BigInt(23900),
    },
    {
      id: BigInt(2),
      status: TransactionStatus.success,
      planId: BigInt(2),
      userId: mockPrincipal,
      operator: Operator.airtel,
      targetNumber: "9123456780",
      timestamp: now,
      amount: BigInt(39900),
    },
  ],

  adminGetAllTransactionsV2: async (_filter) => [
    {
      id: BigInt(1),
      status: "success" as any,
      userId: mockPrincipal,
      extra: {
        __kind__: "recharge",
        recharge: {
          planId: BigInt(1),
          operator: Operator.jio,
          targetNumber: "9876543210",
        },
      },
      timestamp: now,
      txType: TxType.recharge,
      amount: BigInt(23900),
    },
    {
      id: BigInt(2),
      status: "success" as any,
      userId: mockPrincipal,
      extra: {
        __kind__: "topUp",
        topUp: {},
      },
      timestamp: now - BigInt(86_400_000_000_000),
      txType: TxType.topUp,
      amount: BigInt(50000),
    },
    {
      id: BigInt(3),
      status: "success" as any,
      userId: mockPrincipal,
      extra: {
        __kind__: "bill",
        bill: {
          billerId: "BEST-Electricity",
          category: BillCategory.electricity,
        },
      },
      timestamp: now - BigInt(172_800_000_000_000),
      txType: TxType.bill,
      amount: BigInt(85000),
    },
  ],

  adminGetAnalytics: async () => ({
    totalCount: BigInt(248),
    totalRevenue: BigInt(12_45_600),
    byOperator: [
      { operator: Operator.jio, totalCount: BigInt(98), totalRevenue: BigInt(5_23_400) },
      { operator: Operator.airtel, totalCount: BigInt(72), totalRevenue: BigInt(3_98_800) },
      { operator: Operator.vi, totalCount: BigInt(45), totalRevenue: BigInt(1_89_000) },
      { operator: Operator.bsnl, totalCount: BigInt(33), totalRevenue: BigInt(1_34_400) },
    ],
  }),

  adminGetSettings: async () => ({
    enableMobileRecharge: true,
    enableDthRecharge: true,
    appDisplayName: "SP Mobile Recharge App",
    commissionRateBps: BigInt(150),
    enableDigitalDeposit: true,
    enableBillPayment: true,
    enableMoneyTransfer: true,
  }),

  adminListUsers: async () => [
    { id: mockPrincipal, createdAt: now, isAdmin: true, walletBalance: BigInt(50000) },
    { id: mockPrincipal, createdAt: now, isAdmin: false, walletBalance: BigInt(23000) },
    { id: mockPrincipal, createdAt: now, isAdmin: false, walletBalance: BigInt(8500) },
  ],

  adminSetRole: async () => true,

  adminTogglePlan: async (id) => ({
    id,
    validity: BigInt(28),
    operator: Operator.jio,
    name: "Jio 239 Plan",
    description: "2GB/day, unlimited calls",
    isActive: false,
    price: BigInt(23900),
    planType: PlanType.mobile,
  }),

  adminUpdatePlan: async (args) => ({
    id: args.id,
    validity: args.validity,
    operator: Operator.jio,
    name: args.name,
    description: args.description,
    isActive: true,
    price: args.price,
    planType: PlanType.mobile,
  }),

  adminUpdateSettings: async () => undefined as any,

  createDeposit: async (amount, durationDays) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(1),
      durationDays,
      startTime: now,
      maturityTime: now + durationDays * BigInt(86_400_000_000_000),
      status: DepositStatus.active,
      principal: amount,
      userId: mockPrincipal,
      interestRate: BigInt(800),
      interestEarned: BigInt(0),
    },
  }),

  getActivePlans: async (planType) => {
    const plans = [
      {
        id: BigInt(1),
        validity: BigInt(28),
        operator: Operator.jio,
        name: "Jio 239",
        description: "2GB/day • Unlimited calls • 28 days",
        isActive: true,
        price: BigInt(23900),
        planType: PlanType.mobile,
      },
      {
        id: BigInt(2),
        validity: BigInt(56),
        operator: Operator.airtel,
        name: "Airtel 399",
        description: "2.5GB/day • Unlimited calls • 56 days",
        isActive: true,
        price: BigInt(39900),
        planType: PlanType.mobile,
      },
      {
        id: BigInt(3),
        validity: BigInt(28),
        operator: Operator.vi,
        name: "Vi 219",
        description: "1.5GB/day • Unlimited calls • 28 days",
        isActive: true,
        price: BigInt(21900),
        planType: PlanType.mobile,
      },
      {
        id: BigInt(4),
        validity: BigInt(30),
        operator: Operator.tataSky,
        name: "Tata Sky SD Basic",
        description: "150+ channels • SD pack • 30 days",
        isActive: true,
        price: BigInt(29900),
        planType: PlanType.dth,
      },
      {
        id: BigInt(5),
        validity: BigInt(30),
        operator: Operator.dishTV,
        name: "Dish TV Gold",
        description: "200+ channels • HD channels included",
        isActive: true,
        price: BigInt(34900),
        planType: PlanType.dth,
      },
    ];
    if (planType === null) return plans;
    return plans.filter((p) => p.planType === planType);
  },

  getBalance: async () => BigInt(12500),

  getMyBillPayments: async () => [
    {
      id: BigInt(1),
      status: BillStatus.success,
      userId: mockPrincipal,
      billerId: "BEST-Mumbai",
      timestamp: now,
      category: BillCategory.electricity,
      amount: BigInt(85000),
    },
    {
      id: BigInt(2),
      status: BillStatus.success,
      userId: mockPrincipal,
      billerId: "Mahanagar-Gas",
      timestamp: now - BigInt(86_400_000_000_000),
      category: BillCategory.gas,
      amount: BigInt(47000),
    },
  ],

  getMyDeposits: async () => [
    {
      id: BigInt(1),
      durationDays: BigInt(90),
      startTime: now - BigInt(30) * BigInt(86_400_000_000_000),
      maturityTime: now + BigInt(60) * BigInt(86_400_000_000_000),
      status: DepositStatus.active,
      principal: BigInt(100000),
      userId: mockPrincipal,
      interestRate: BigInt(800),
      interestEarned: BigInt(2466),
    },
  ],

  getMyTransactions: async () => [
    {
      id: BigInt(1),
      status: TransactionStatus.success,
      planId: BigInt(1),
      userId: mockPrincipal,
      operator: Operator.jio,
      targetNumber: "9876543210",
      timestamp: now,
      amount: BigInt(23900),
    },
  ],

  getPlan: async (id) => ({
    id,
    validity: BigInt(28),
    operator: Operator.jio,
    name: "Jio 239",
    description: "2GB/day • Unlimited calls • 28 days",
    isActive: true,
    price: BigInt(23900),
    planType: PlanType.mobile,
  }),

  getProfile: async () => ({
    id: mockPrincipal,
    createdAt: now,
    isAdmin: false,
    walletBalance: BigInt(12500),
  }),

  getPublicSettings: async () => ({
    enableMobileRecharge: true,
    enableDthRecharge: true,
    appDisplayName: "SP Mobile Recharge App",
    enableDigitalDeposit: true,
    enableBillPayment: true,
    enableMoneyTransfer: true,
  }),

  getTransferHistory: async () => [
    {
      id: BigInt(1),
      status: "success" as any,
      note: "Rent payment",
      timestamp: now,
      amount: BigInt(50000),
      recipientId: mockPrincipal,
      senderId: mockPrincipal,
    },
  ],

  initiateRecharge: async (args) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(99),
      status: TransactionStatus.success,
      planId: args.planId,
      userId: mockPrincipal,
      operator: Operator.jio,
      targetNumber: args.targetNumber,
      timestamp: now,
      amount: BigInt(23900),
    },
  }),

  matureDeposit: async (depositId) => ({
    __kind__: "ok",
    ok: {
      id: depositId,
      durationDays: BigInt(90),
      maturedAt: now,
      startTime: now - BigInt(90) * BigInt(86_400_000_000_000),
      maturityTime: now,
      status: DepositStatus.matured,
      principal: BigInt(100000),
      userId: mockPrincipal,
      interestRate: BigInt(800),
      interestEarned: BigInt(19726),
    },
  }),

  payBill: async (category, billerId, amount) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(99),
      status: BillStatus.success,
      userId: mockPrincipal,
      billerId,
      timestamp: now,
      category,
      amount,
    },
  }),

  register: async () => ({
    id: mockPrincipal,
    createdAt: now,
    isAdmin: false,
    walletBalance: BigInt(0),
  }),

  topUpWallet: async (amountPaisa) => ({
    __kind__: "ok",
    ok: amountPaisa,
  }),

  transferFunds: async (recipientPrincipal, amount, note) => ({
    __kind__: "ok",
    ok: {
      id: BigInt(99),
      status: "success" as any,
      note,
      timestamp: now,
      amount,
      recipientId: recipientPrincipal,
      senderId: mockPrincipal,
    },
  }),
};
