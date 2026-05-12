import List "mo:core/List";
import TransferTypes "types/transfers";
import BillTypes "types/bills";
import DepositTypes "types/deposits";

module {
  // Old state shape (from previous canister version)
  type OldState = { var nextPlanId : Nat; var nextTxId : Nat };

  // Old List internal structure used in the .most snapshot
  type OldList<T> = { var blockIndex : Nat; var blocks : [var [var ?T]]; var elementIndex : Nat };

  type OldActor = {
    state : OldState;
    plans : OldList<{
      description : Text;
      id : Nat;
      var isActive : Bool;
      name : Text;
      operator : { #airtel; #bsnl; #dishTV; #jio; #tataSky; #vi };
      planType : { #dth; #mobile };
      price : Nat;
      validity : Nat;
    }>;
    transactions : OldList<{
      amount : Nat;
      id : Nat;
      operator : { #airtel; #bsnl; #dishTV; #jio; #tataSky; #vi };
      planId : Nat;
      status : { #failed; #pending; #success };
      targetNumber : Text;
      timestamp : Int;
      userId : Principal;
    }>;
    users : OldList<{
      createdAt : Int;
      id : Principal;
      var isAdmin : Bool;
      var walletBalance : Int;
    }>;
  };

  type NewState = {
    var nextPlanId : Nat;
    var nextTxId : Nat;
    var nextTransferId : Nat;
    var nextBillId : Nat;
    var nextDepositId : Nat;
  };

  type NewList<T> = List.List<T>;

  type NewActor = {
    state : NewState;
    plans : OldList<{
      description : Text;
      id : Nat;
      var isActive : Bool;
      name : Text;
      operator : { #airtel; #bsnl; #dishTV; #jio; #tataSky; #vi };
      planType : { #dth; #mobile };
      price : Nat;
      validity : Nat;
    }>;
    transactions : OldList<{
      amount : Nat;
      id : Nat;
      operator : { #airtel; #bsnl; #dishTV; #jio; #tataSky; #vi };
      planId : Nat;
      status : { #failed; #pending; #success };
      targetNumber : Text;
      timestamp : Int;
      userId : Principal;
    }>;
    users : OldList<{
      createdAt : Int;
      id : Principal;
      var isAdmin : Bool;
      var walletBalance : Int;
    }>;
    transfers : NewList<TransferTypes.TransferRecord>;
    bills : NewList<BillTypes.BillRecord>;
    deposits : NewList<DepositTypes.DepositRecord>;
  };

  public func run(old : OldActor) : NewActor {
    {
      state = {
        var nextPlanId = old.state.nextPlanId;
        var nextTxId = old.state.nextTxId;
        var nextTransferId = 1;
        var nextBillId = 1;
        var nextDepositId = 1;
      };
      plans = old.plans;
      transactions = old.transactions;
      users = old.users;
      transfers = List.empty<TransferTypes.TransferRecord>();
      bills = List.empty<BillTypes.BillRecord>();
      deposits = List.empty<DepositTypes.DepositRecord>();
    };
  };
};
