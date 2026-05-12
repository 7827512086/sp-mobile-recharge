import SettingsTypes "../types/settings";

module {
  public func defaultSettings() : SettingsTypes.AppSettings {
    {
      commissionRateBps = 0;
      enableMobileRecharge = true;
      enableDthRecharge = true;
      enableMoneyTransfer = true;
      enableBillPayment = true;
      enableDigitalDeposit = true;
      appDisplayName = "SP Mobile Recharge App";
    };
  };

  public func applyUpdate(
    current : SettingsTypes.AppSettings,
    update : SettingsTypes.AppSettingsUpdate
  ) : SettingsTypes.AppSettings {
    {
      commissionRateBps = switch (update.commissionRateBps) { case (?v) v; case null current.commissionRateBps };
      enableMobileRecharge = switch (update.enableMobileRecharge) { case (?v) v; case null current.enableMobileRecharge };
      enableDthRecharge = switch (update.enableDthRecharge) { case (?v) v; case null current.enableDthRecharge };
      enableMoneyTransfer = switch (update.enableMoneyTransfer) { case (?v) v; case null current.enableMoneyTransfer };
      enableBillPayment = switch (update.enableBillPayment) { case (?v) v; case null current.enableBillPayment };
      enableDigitalDeposit = switch (update.enableDigitalDeposit) { case (?v) v; case null current.enableDigitalDeposit };
      appDisplayName = switch (update.appDisplayName) { case (?v) v; case null current.appDisplayName };
    };
  };

  public func toPublic(settings : SettingsTypes.AppSettings) : SettingsTypes.PublicSettings {
    {
      enableMobileRecharge = settings.enableMobileRecharge;
      enableDthRecharge = settings.enableDthRecharge;
      enableMoneyTransfer = settings.enableMoneyTransfer;
      enableBillPayment = settings.enableBillPayment;
      enableDigitalDeposit = settings.enableDigitalDeposit;
      appDisplayName = settings.appDisplayName;
    };
  };
};
