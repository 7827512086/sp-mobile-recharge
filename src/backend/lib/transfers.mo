import TransferTypes "../types/transfers";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public func newTransfer(
    id : TransferTypes.TransferId,
    sender : TransferTypes.UserId,
    recipient : TransferTypes.UserId,
    amount : Nat,
    note : Text,
    now : TransferTypes.Timestamp
  ) : TransferTypes.TransferRecord {
    { id; senderId = sender; recipientId = recipient; amount; timestamp = now; status = #success; note };
  };

  public func forUser(
    transfers : List.List<TransferTypes.TransferRecord>,
    userId : Principal
  ) : [TransferTypes.TransferRecord] {
    transfers.filter(func(t) {
      Principal.equal(t.senderId, userId) or Principal.equal(t.recipientId, userId)
    }).toArray();
  };
};
