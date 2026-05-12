import CommonTypes "common";

module {
  public type TransferId = Nat;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type TransferStatus = {
    #success;
    #failed;
  };

  public type TransferRecord = {
    id : TransferId;
    senderId : UserId;
    recipientId : UserId;
    amount : Nat; // paisa
    timestamp : Timestamp;
    status : TransferStatus;
    note : Text;
  };

  public type TransferResult = {
    #ok : TransferRecord;
    #insufficientBalance;
    #recipientNotFound;
    #senderNotFound;
    #err : Text;
  };
};
