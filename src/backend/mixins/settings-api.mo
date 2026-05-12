import SettingsTypes "../types/settings";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import SettingsLib "../lib/settings";
import List "mo:core/List";

mixin (
  users : List.List<WalletTypes.UserProfile>,
  appSettings : { var settings : SettingsTypes.AppSettings }
) {
  public shared query ({ caller }) func adminGetSettings() : async SettingsTypes.AppSettings {
    WalletLib.requireAdmin(users, caller);
    appSettings.settings;
  };

  public shared ({ caller }) func adminUpdateSettings(update : SettingsTypes.AppSettingsUpdate) : async () {
    WalletLib.requireAdmin(users, caller);
    appSettings.settings := SettingsLib.applyUpdate(appSettings.settings, update);
  };

  public shared query ({ caller }) func getPublicSettings() : async SettingsTypes.PublicSettings {
    SettingsLib.toPublic(appSettings.settings);
  };
};
