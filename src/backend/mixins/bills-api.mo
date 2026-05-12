import BillTypes "../types/bills";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import BillLib "../lib/bills";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

mixin (
  bills : List.List<BillTypes.BillRecord>,
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextBillId : Nat }
) {
  public shared ({ caller }) func payBill(
    category : BillTypes.BillCategory,
    billerId : Text,
    amount : Nat
  ) : async BillTypes.BillPayResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let userOpt = WalletLib.findProfile(users, caller);
    let user = switch (userOpt) {
      case (?p) p;
      case null { return #userNotFound };
    };
    if (user.walletBalance < amount.toInt()) { return #insufficientBalance };
    user.walletBalance -= amount.toInt();
    let id = state.nextBillId;
    state.nextBillId += 1;
    let record = BillLib.newBillRecord(id, caller, category, billerId, amount, Time.now());
    bills.add(record);
    #ok(record);
  };

  public shared query ({ caller }) func getMyBillPayments() : async [BillTypes.BillRecord] {
    BillLib.forUser(bills, caller);
  };
};
