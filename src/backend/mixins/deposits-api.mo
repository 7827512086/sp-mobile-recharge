import DepositTypes "../types/deposits";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import DepositLib "../lib/deposits";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

mixin (
  deposits : List.List<DepositTypes.DepositRecord>,
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextDepositId : Nat }
) {
  public shared ({ caller }) func createDeposit(amount : Nat, durationDays : Nat) : async DepositTypes.DepositResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let rateOpt = DepositLib.rateForDuration(durationDays);
    let interestRate = switch (rateOpt) {
      case (?r) r;
      case null { return #invalidDuration };
    };
    let userOpt = WalletLib.findProfile(users, caller);
    let user = switch (userOpt) {
      case (?p) p;
      case null { return #userNotFound };
    };
    if (user.walletBalance < amount.toInt()) { return #insufficientBalance };
    user.walletBalance -= amount.toInt();
    let id = state.nextDepositId;
    state.nextDepositId += 1;
    let record = DepositLib.newDeposit(id, caller, amount, durationDays, interestRate, Time.now());
    deposits.add(record);
    #ok(record);
  };

  public shared query ({ caller }) func getMyDeposits() : async [DepositTypes.DepositRecord] {
    DepositLib.forUser(deposits, caller);
  };

  // Any authenticated user can mature their own deposit when it's due
  public shared ({ caller }) func matureDeposit(depositId : Nat) : async DepositTypes.MatureResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let depositOpt = DepositLib.findById(deposits, depositId);
    let deposit = switch (depositOpt) {
      case (?d) d;
      case null { return #depositNotFound };
    };
    if (deposit.status != #active) { return #alreadyProcessed };
    let now = Time.now();
    if (now < deposit.maturityTime) { return #notYetMatured };
    let payout = deposit.principal_ + deposit.interestEarned;
    let userOpt = WalletLib.findProfile(users, deposit.userId);
    switch (userOpt) {
      case (?user) { user.walletBalance += payout.toInt() };
      case null {};
    };
    // Update deposit in-place to #matured
    deposits.mapInPlace(func(d) {
      if (d.id == depositId) {
        { d with status = #matured; maturedAt = ?now }
      } else { d }
    });
    let updatedOpt = DepositLib.findById(deposits, depositId);
    switch (updatedOpt) {
      case (?d) #ok(d);
      case null #depositNotFound;
    };
  };
};
