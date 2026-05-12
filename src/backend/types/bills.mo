import CommonTypes "common";

module {
  public type BillId = Nat;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type BillCategory = {
    #electricity;
    #water;
    #gas;
    #internet;
  };

  public type BillStatus = {
    #success;
    #failed;
  };

  public type BillRecord = {
    id : BillId;
    userId : UserId;
    category : BillCategory;
    billerId : Text;
    amount : Nat; // paisa
    timestamp : Timestamp;
    status : BillStatus;
  };

  public type BillPayResult = {
    #ok : BillRecord;
    #insufficientBalance;
    #userNotFound;
    #err : Text;
  };
};
