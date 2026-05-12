import CommonTypes "common";
import PlanTypes "plans";

module {
  public type TransactionId = CommonTypes.TransactionId;
  public type UserId = CommonTypes.UserId;
  public type PlanId = CommonTypes.PlanId;
  public type Timestamp = CommonTypes.Timestamp;

  public type TransactionStatus = {
    #pending;
    #success;
    #failed;
  };

  public type Transaction = {
    id : TransactionId;
    userId : UserId;
    operator : PlanTypes.Operator;
    planId : PlanId;
    amount : Nat;
    targetNumber : Text;
    status : TransactionStatus;
    timestamp : Timestamp;
  };

  public type InitiateRechargeArgs = {
    planId : PlanId;
    targetNumber : Text;
  };

  public type RechargeResult = {
    #ok : Transaction;
    #insufficientBalance;
    #planNotFound;
    #planInactive;
    #err : Text;
  };

  public type OperatorRevenue = {
    operator : PlanTypes.Operator;
    totalRevenue : Nat;
    totalCount : Nat;
  };

  public type Analytics = {
    totalRevenue : Nat;
    totalCount : Nat;
    byOperator : [OperatorRevenue];
  };
};
