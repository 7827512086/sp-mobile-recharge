import WalletTypes "../types/wallet";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  public func newProfile(id : WalletTypes.UserId, now : WalletTypes.Timestamp) : WalletTypes.UserProfile {
    { id; var walletBalance = 0; var isAdmin = false; createdAt = now };
  };

  public func toView(profile : WalletTypes.UserProfile) : WalletTypes.UserProfileView {
    { id = profile.id; walletBalance = profile.walletBalance; isAdmin = profile.isAdmin; createdAt = profile.createdAt };
  };

  public func topUp(profile : WalletTypes.UserProfile, amount : Nat) : Int {
    profile.walletBalance += amount.toInt();
    profile.walletBalance;
  };

  public func deduct(profile : WalletTypes.UserProfile, amount : Nat) : WalletTypes.TopUpResult {
    if (profile.walletBalance < amount.toInt()) {
      #err("Insufficient balance");
    } else {
      profile.walletBalance -= amount.toInt();
      #ok(profile.walletBalance);
    };
  };

  public func findProfile(users : List.List<WalletTypes.UserProfile>, id : WalletTypes.UserId) : ?WalletTypes.UserProfile {
    users.find(func(u) { Principal.equal(u.id, id) });
  };
  public func requireAdmin(users : List.List<WalletTypes.UserProfile>, caller : Principal) {
    switch (findProfile(users, caller)) {
      case (?p) { if (not p.isAdmin) { Runtime.trap("Not authorized") } };
      case null { Runtime.trap("Not authorized") };
    };
  };
};
