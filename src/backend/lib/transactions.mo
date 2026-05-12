import TxTypes "../types/transactions";
import PlanTypes "../types/plans";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

module {
  public func newTransaction(
    id : TxTypes.TransactionId,
    userId : TxTypes.UserId,
    plan : PlanTypes.Plan,
    targetNumber : Text,
    now : TxTypes.Timestamp
  ) : TxTypes.Transaction {
    { id; userId; operator = plan.operator; planId = plan.id; amount = plan.price; targetNumber; status = #success; timestamp = now };
  };

  public func forUser(txns : List.List<TxTypes.Transaction>, userId : TxTypes.UserId) : [TxTypes.Transaction] {
    let filtered = txns.filter(func(t) { Principal.equal(t.userId, userId) });
    filtered.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) }).toArray();
  };

  public func allSorted(txns : List.List<TxTypes.Transaction>) : [TxTypes.Transaction] {
    txns.sort(func(a, b) { Int.compare(b.timestamp, a.timestamp) }).toArray();
  };

  public func computeAnalytics(txns : List.List<TxTypes.Transaction>) : TxTypes.Analytics {
    let allTxns = txns.toArray();
    let totalRevenue = allTxns.foldLeft(0, func(acc, t) { acc + t.amount });
    let totalCount = allTxns.size();
    let operators : [PlanTypes.Operator] = [#jio, #airtel, #vi, #bsnl, #tataSky, #dishTV];
    let byOperator = operators.map(func(op) {
      let opTxns = allTxns.filter(func(t) { t.operator == op });
      let rev = opTxns.foldLeft(0, func(acc, t) { acc + t.amount });
      { operator = op; totalRevenue = rev; totalCount = opTxns.size() };
    });
    { totalRevenue; totalCount; byOperator };
  };
};
