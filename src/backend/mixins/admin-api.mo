import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  users : List.List<WalletTypes.UserProfile>
) {
  public shared ({ caller }) func adminSetRole(target : WalletTypes.UserId, isAdmin : Bool) : async Bool {
    WalletLib.requireAdmin(users, caller);
    switch (WalletLib.findProfile(users, target)) {
      case (?p) {
        p.isAdmin := isAdmin;
        true;
      };
      case null { false };
    };
  };

  public shared query ({ caller }) func adminListUsers() : async [WalletTypes.UserProfileView] {
    WalletLib.requireAdmin(users, caller);
    users.map<WalletTypes.UserProfile, WalletTypes.UserProfileView>(func(u) { WalletLib.toView(u) }).toArray();
  };
};
