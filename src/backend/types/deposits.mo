import CommonTypes "common";

module {
  public type DepositId = Nat;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type DepositStatus = {
    #active;
    #matured;
    #withdrawn;
  };

  public type DepositRecord = {
    id : DepositId;
    userId : UserId;
    principal_ : Nat; // paisa (using principal_ to avoid reserved word)
    durationDays : Nat;
    interestRate : Nat; // e.g. 4 = 4%
    startTime : Timestamp;
    maturityTime : Timestamp;
    interestEarned : Nat; // paisa
    status : DepositStatus;
    maturedAt : ?Timestamp;
  };

  public type DepositResult = {
    #ok : DepositRecord;
    #insufficientBalance;
    #invalidDuration;
    #userNotFound;
    #err : Text;
  };

  public type MatureResult = {
    #ok : DepositRecord;
    #depositNotFound;
    #notYetMatured;
    #alreadyProcessed;
    #err : Text;
  };
};
