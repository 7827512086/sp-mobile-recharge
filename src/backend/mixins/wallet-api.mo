import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextTxId : Nat }
) {
  // Auto-register or get profile for caller
  func getOrRegister(caller : Principal) : WalletTypes.UserProfile {
    switch (WalletLib.findProfile(users, caller)) {
      case (?p) { p };
      case null {
        let profile = WalletLib.newProfile(caller, Time.now());
        // Bootstrap first user as admin
        if (users.size() == 0) { profile.isAdmin := true };
        users.add(profile);
        profile;
      };
    };
  };

  public shared ({ caller }) func register() : async WalletTypes.UserProfileView {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let profile = getOrRegister(caller);
    WalletLib.toView(profile);
  };

  public shared query ({ caller }) func getBalance() : async Int {
    switch (WalletLib.findProfile(users, caller)) {
      case (?p) { p.walletBalance };
      case null { 0 };
    };
  };

  public shared query ({ caller }) func getProfile() : async ?WalletTypes.UserProfileView {
    switch (WalletLib.findProfile(users, caller)) {
      case (?p) { ?WalletLib.toView(p) };
      case null { null };
    };
  };

  public shared ({ caller }) func topUpWallet(amountPaisa : Nat) : async WalletTypes.TopUpResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    if (amountPaisa == 0) { return #err("Amount must be greater than zero") };
    let profile = getOrRegister(caller);
    let newBalance = WalletLib.topUp(profile, amountPaisa);
    #ok(newBalance);
  };
};
