import List "mo:core/List";
import WalletTypes "types/wallet";
import PlanTypes "types/plans";
import TxTypes "types/transactions";
import TransferTypes "types/transfers";
import BillTypes "types/bills";
import DepositTypes "types/deposits";
import SettingsTypes "types/settings";
import PlansLib "lib/plans";
import SettingsLib "lib/settings";

import WalletApi "mixins/wallet-api";
import PlansApi "mixins/plans-api";
import TransactionsApi "mixins/transactions-api";
import AdminApi "mixins/admin-api";
import TransfersApi "mixins/transfers-api";
import BillsApi "mixins/bills-api";
import DepositsApi "mixins/deposits-api";
import SettingsApi "mixins/settings-api";
import UnifiedTxApi "mixins/unified-tx-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let users = List.empty<WalletTypes.UserProfile>();
  let plans = List.empty<PlanTypes.Plan>();
  let transactions = List.empty<TxTypes.Transaction>();
  let transfers = List.empty<TransferTypes.TransferRecord>();
  let bills = List.empty<BillTypes.BillRecord>();
  let deposits = List.empty<DepositTypes.DepositRecord>();
  let state = {
    var nextPlanId : Nat = 1;
    var nextTxId : Nat = 1;
    var nextTransferId : Nat = 1;
    var nextBillId : Nat = 1;
    var nextDepositId : Nat = 1;
  };
  let appSettings = { var settings : SettingsTypes.AppSettings = SettingsLib.defaultSettings() };

  // Seed mock plans on first deploy (idempotent — only runs when list is empty)
  if (plans.size() == 0) {
    PlansLib.seedMockPlans(plans, state);
  };

  include WalletApi(users, state);
  include PlansApi(plans, users, state);
  include TransactionsApi(transactions, plans, users, state);
  include AdminApi(users);
  include TransfersApi(transfers, users, state);
  include BillsApi(bills, users, state);
  include DepositsApi(deposits, users, state);
  include SettingsApi(users, appSettings);
  include UnifiedTxApi(transactions, transfers, bills, deposits, users);
};
