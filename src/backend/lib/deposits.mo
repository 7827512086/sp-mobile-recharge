import DepositTypes "../types/deposits";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  // Returns the interest rate (%) for a given duration in days.
  // Valid durations: 30 → 4, 60 → 6, 90 → 8, 365 → 10. Returns null if invalid.
  public func rateForDuration(durationDays : Nat) : ?Nat {
    if (durationDays == 30) { ?4 }
    else if (durationDays == 60) { ?6 }
    else if (durationDays == 90) { ?8 }
    else if (durationDays == 365) { ?10 }
    else { null };
  };

  public func newDeposit(
    id : DepositTypes.DepositId,
    userId : DepositTypes.UserId,
    amount : Nat,
    durationDays : Nat,
    interestRate : Nat,
    now : DepositTypes.Timestamp
  ) : DepositTypes.DepositRecord {
    let maturityTime : Int = now + (durationDays * 24 * 60 * 60 * 1_000_000_000).toInt();
    let interest = computeInterest(amount, interestRate);
    {
      id;
      userId;
      principal_ = amount;
      durationDays;
      interestRate;
      startTime = now;
      maturityTime;
      interestEarned = interest;
      status = #active;
      maturedAt = null;
    };
  };

  public func forUser(
    deposits : List.List<DepositTypes.DepositRecord>,
    userId : Principal
  ) : [DepositTypes.DepositRecord] {
    deposits.filter(func(d) { Principal.equal(d.userId, userId) }).toArray();
  };

  public func findById(
    deposits : List.List<DepositTypes.DepositRecord>,
    depositId : DepositTypes.DepositId
  ) : ?DepositTypes.DepositRecord {
    deposits.find(func(d) { d.id == depositId });
  };

  // Compute interest earned: principal * rate / 100 (integer paisa)
  public func computeInterest(principal_ : Nat, interestRate : Nat) : Nat {
    principal_ * interestRate / 100;
  };
};
