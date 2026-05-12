import CommonTypes "common";
import PlanTypes "plans";
import BillTypes "bills";

module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type TxType = {
    #recharge;
    #transfer;
    #bill;
    #deposit;
    #topUp;
  };

  public type TxStatus = {
    #pending;
    #success;
    #failed;
  };

  // Extra metadata attached to each tx type
  public type TxExtra = {
    #recharge : { operator : PlanTypes.Operator; targetNumber : Text; planId : Nat };
    #transfer : { recipientId : UserId; note : Text };
    #bill : { category : BillTypes.BillCategory; billerId : Text };
    #deposit : { durationDays : Nat; interestRate : Nat };
    #topUp : {};
  };

  public type TxRecord = {
    id : Nat;
    userId : UserId;
    txType : TxType;
    amount : Nat; // paisa
    timestamp : Timestamp;
    status : TxStatus;
    extra : TxExtra;
  };

  public type TxFilter = {
    dateFrom : ?Timestamp;
    dateTo : ?Timestamp;
    txType : ?TxType;
    operator : ?PlanTypes.Operator;
    status : ?TxStatus;
  };
};
