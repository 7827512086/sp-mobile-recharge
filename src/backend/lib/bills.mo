import BillTypes "../types/bills";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func newBillRecord(
    id : BillTypes.BillId,
    userId : BillTypes.UserId,
    category : BillTypes.BillCategory,
    billerId : Text,
    amount : Nat,
    now : BillTypes.Timestamp
  ) : BillTypes.BillRecord {
    { id; userId; category; billerId; amount; timestamp = now; status = #success };
  };

  public func forUser(
    bills : List.List<BillTypes.BillRecord>,
    userId : Principal
  ) : [BillTypes.BillRecord] {
    bills.filter(func(b) { Principal.equal(b.userId, userId) }).toArray();
  };
};
