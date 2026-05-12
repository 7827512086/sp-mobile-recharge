module {
  public type PlanId = Nat;

  public type PlanType = {
    #mobile;
    #dth;
  };

  public type Operator = {
    #jio;
    #airtel;
    #vi;
    #bsnl;
    #tataSky;
    #dishTV;
  };

  public type Plan = {
    id : PlanId;
    operator : Operator;
    planType : PlanType;
    name : Text;
    price : Nat;
    validity : Nat;
    description : Text;
    var isActive : Bool;
  };

  public type PlanView = {
    id : PlanId;
    operator : Operator;
    planType : PlanType;
    name : Text;
    price : Nat;
    validity : Nat;
    description : Text;
    isActive : Bool;
  };

  public type CreatePlanArgs = {
    operator : Operator;
    planType : PlanType;
    name : Text;
    price : Nat;
    validity : Nat;
    description : Text;
  };

  public type UpdatePlanArgs = {
    id : PlanId;
    name : Text;
    price : Nat;
    validity : Nat;
    description : Text;
  };
};
