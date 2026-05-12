import UnifiedTxTypes "../types/unified-tx";
import TxTypes "../types/transactions";
import TransferTypes "../types/transfers";
import BillTypes "../types/bills";
import DepositTypes "../types/deposits";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import UnifiedTxLib "../lib/unified-tx";
import List "mo:core/List";

mixin (
  transactions : List.List<TxTypes.Transaction>,
  transfers : List.List<TransferTypes.TransferRecord>,
  bills : List.List<BillTypes.BillRecord>,
  deposits : List.List<DepositTypes.DepositRecord>,
  users : List.List<WalletTypes.UserProfile>
) {
  public shared query ({ caller }) func adminGetAllTransactionsV2(filter : UnifiedTxTypes.TxFilter) : async [UnifiedTxTypes.TxRecord] {
    WalletLib.requireAdmin(users, caller);
    UnifiedTxLib.collectAll(transactions, transfers, bills, deposits, filter);
  };
};
