import TransferTypes "../types/transfers";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import TransferLib "../lib/transfers";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  transfers : List.List<TransferTypes.TransferRecord>,
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextTransferId : Nat }
) {
  public shared ({ caller }) func transferFunds(recipientPrincipal : Principal, amount : Nat, note : Text) : async TransferTypes.TransferResult {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers not allowed") };
    let senderOpt = WalletLib.findProfile(users, caller);
    let sender = switch (senderOpt) {
      case (?p) p;
      case null { return #senderNotFound };
    };
    let recipientOpt = WalletLib.findProfile(users, recipientPrincipal);
    let recipient = switch (recipientOpt) {
      case (?p) p;
      case null { return #recipientNotFound };
    };
    if (sender.walletBalance < amount.toInt()) { return #insufficientBalance };
    sender.walletBalance -= amount.toInt();
    recipient.walletBalance += amount.toInt();
    let id = state.nextTransferId;
    state.nextTransferId += 1;
    let record = TransferLib.newTransfer(id, caller, recipientPrincipal, amount, note, Time.now());
    transfers.add(record);
    #ok(record);
  };

  public shared query ({ caller }) func getTransferHistory() : async [TransferTypes.TransferRecord] {
    TransferLib.forUser(transfers, caller);
  };
};
