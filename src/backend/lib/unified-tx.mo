import UnifiedTxTypes "../types/unified-tx";
import TxTypes "../types/transactions";
import TransferTypes "../types/transfers";
import BillTypes "../types/bills";
import DepositTypes "../types/deposits";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // Convert a recharge Transaction to TxRecord
  public func fromRecharge(tx : TxTypes.Transaction) : UnifiedTxTypes.TxRecord {
    {
      id = tx.id;
      userId = tx.userId;
      txType = #recharge;
      amount = tx.amount;
      timestamp = tx.timestamp;
      status = switch (tx.status) {
        case (#pending) #pending;
        case (#success) #success;
        case (#failed) #failed;
      };
      extra = #recharge { operator = tx.operator; targetNumber = tx.targetNumber; planId = tx.planId };
    };
  };

  // Convert a TransferRecord to TxRecord
  public func fromTransfer(tx : TransferTypes.TransferRecord, userId : Principal) : UnifiedTxTypes.TxRecord {
    {
      id = tx.id;
      userId;
      txType = #transfer;
      amount = tx.amount;
      timestamp = tx.timestamp;
      status = switch (tx.status) {
        case (#success) #success;
        case (#failed) #failed;
      };
      extra = #transfer { recipientId = tx.recipientId; note = tx.note };
    };
  };

  // Convert a BillRecord to TxRecord
  public func fromBill(tx : BillTypes.BillRecord) : UnifiedTxTypes.TxRecord {
    {
      id = tx.id;
      userId = tx.userId;
      txType = #bill;
      amount = tx.amount;
      timestamp = tx.timestamp;
      status = switch (tx.status) {
        case (#success) #success;
        case (#failed) #failed;
      };
      extra = #bill { category = tx.category; billerId = tx.billerId };
    };
  };

  // Convert a DepositRecord to TxRecord
  public func fromDeposit(tx : DepositTypes.DepositRecord) : UnifiedTxTypes.TxRecord {
    {
      id = tx.id;
      userId = tx.userId;
      txType = #deposit;
      amount = tx.principal_;
      timestamp = tx.startTime;
      status = switch (tx.status) {
        case (#active) #pending;
        case (#matured) #success;
        case (#withdrawn) #success;
      };
      extra = #deposit { durationDays = tx.durationDays; interestRate = tx.interestRate };
    };
  };

  // Collect and filter all tx records across all collections
  public func collectAll(
    recharges : List.List<TxTypes.Transaction>,
    transfers : List.List<TransferTypes.TransferRecord>,
    bills : List.List<BillTypes.BillRecord>,
    deposits : List.List<DepositTypes.DepositRecord>,
    filter : UnifiedTxTypes.TxFilter
  ) : [UnifiedTxTypes.TxRecord] {
    let allRecords = List.empty<UnifiedTxTypes.TxRecord>();

    // Recharges
    for (r in recharges.values()) {
      allRecords.add(fromRecharge(r));
    };

    // Transfers (each transfer appears once per participant; for admin we add once)
    for (t in transfers.values()) {
      allRecords.add(fromTransfer(t, t.senderId));
    };

    // Bills
    for (b in bills.values()) {
      allRecords.add(fromBill(b));
    };

    // Deposits
    for (d in deposits.values()) {
      allRecords.add(fromDeposit(d));
    };

    // Apply filters
    let filtered = allRecords.filter(func(tx) {
      let passDateFrom = switch (filter.dateFrom) {
        case (?from) tx.timestamp >= from;
        case null true;
      };
      let passDateTo = switch (filter.dateTo) {
        case (?to) tx.timestamp <= to;
        case null true;
      };
      let passOperator = switch (filter.operator) {
        case (?op) {
          switch (tx.extra) {
            case (#recharge r) r.operator == op;
            case _ true;
          };
        };
        case null true;
      };
      let passTxType = switch (filter.txType) {
        case (?t) tx.txType == t;
        case null true;
      };
      let passStatus = switch (filter.status) {
        case (?s) tx.status == s;
        case null true;
      };
      passDateFrom and passDateTo and passTxType and passStatus and passOperator;
    });

    // Sort descending by timestamp
    filtered.sort(func(a, b) {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    }).toArray();
  };
};
