import TxTypes "../types/transactions";
import PlanTypes "../types/plans";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import PlansLib "../lib/plans";
import TxLib "../lib/transactions";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  transactions : List.List<TxTypes.Transaction>,
  plans : List.List<PlanTypes.Plan>,
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextTxId : Nat }
) {
  public shared ({ caller }) func initiateRecharge(args : TxTypes.InitiateRechargeArgs) : async TxTypes.RechargeResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let userProfile = switch (WalletLib.findProfile(users, caller)) {
      case (?p) { p };
      case null { return #err("User not registered") };
    };
    let plan = switch (PlansLib.findPlan(plans, args.planId)) {
      case (?p) { p };
      case null { return #planNotFound };
    };
    if (not plan.isActive) { return #planInactive };
    if (userProfile.walletBalance < plan.price.toInt()) { return #insufficientBalance };
    userProfile.walletBalance -= plan.price.toInt();
    let txId = state.nextTxId;
    state.nextTxId += 1;
    let tx = TxLib.newTransaction(txId, caller, plan, args.targetNumber, Time.now());
    transactions.add(tx);
    #ok(tx);
  };

  public shared query ({ caller }) func getMyTransactions() : async [TxTypes.Transaction] {
    TxLib.forUser(transactions, caller);
  };

  public shared query ({ caller }) func adminGetAllTransactions() : async [TxTypes.Transaction] {
    WalletLib.requireAdmin(users, caller);
    TxLib.allSorted(transactions);
  };

  public shared query ({ caller }) func adminGetAnalytics() : async TxTypes.Analytics {
    WalletLib.requireAdmin(users, caller);
    TxLib.computeAnalytics(transactions);
  };
};
