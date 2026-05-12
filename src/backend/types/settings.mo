module {
  public type AppSettings = {
    commissionRateBps : Nat; // 0-1000 = 0-10%
    enableMobileRecharge : Bool;
    enableDthRecharge : Bool;
    enableMoneyTransfer : Bool;
    enableBillPayment : Bool;
    enableDigitalDeposit : Bool;
    appDisplayName : Text;
  };

  public type AppSettingsUpdate = {
    commissionRateBps : ?Nat;
    enableMobileRecharge : ?Bool;
    enableDthRecharge : ?Bool;
    enableMoneyTransfer : ?Bool;
    enableBillPayment : ?Bool;
    enableDigitalDeposit : ?Bool;
    appDisplayName : ?Text;
  };

  public type PublicSettings = {
    enableMobileRecharge : Bool;
    enableDthRecharge : Bool;
    enableMoneyTransfer : Bool;
    enableBillPayment : Bool;
    enableDigitalDeposit : Bool;
    appDisplayName : Text;
  };
};
