import PlanTypes "../types/plans";
import WalletTypes "../types/wallet";
import WalletLib "../lib/wallet";
import PlansLib "../lib/plans";
import List "mo:core/List";
import Principal "mo:core/Principal";

mixin (
  plans : List.List<PlanTypes.Plan>,
  users : List.List<WalletTypes.UserProfile>,
  state : { var nextPlanId : Nat }
) {
  public query func getActivePlans(planType : ?PlanTypes.PlanType) : async [PlanTypes.PlanView] {
    let active = plans.filter(func(p) { p.isActive });
    let filtered = switch (planType) {
      case null { active };
      case (?pt) { active.filter(func(p) { p.planType == pt }) };
    };
    filtered.map<PlanTypes.Plan, PlanTypes.PlanView>(func(p) { PlansLib.toView(p) }).toArray();
  };

  public query func getPlan(id : PlanTypes.PlanId) : async ?PlanTypes.PlanView {
    switch (PlansLib.findPlan(plans, id)) {
      case (?p) { ?PlansLib.toView(p) };
      case null { null };
    };
  };

  public shared ({ caller }) func adminCreatePlan(args : PlanTypes.CreatePlanArgs) : async PlanTypes.PlanView {
    WalletLib.requireAdmin(users, caller);
    let id = state.nextPlanId;
    state.nextPlanId += 1;
    let plan = PlansLib.newPlan(id, args);
    plans.add(plan);
    PlansLib.toView(plan);
  };

  public shared ({ caller }) func adminUpdatePlan(args : PlanTypes.UpdatePlanArgs) : async ?PlanTypes.PlanView {
    WalletLib.requireAdmin(users, caller);
    var result : ?PlanTypes.PlanView = null;
    plans.mapInPlace(func(p) {
      if (p.id == args.id) {
        let updated = { p with name = args.name; price = args.price; validity = args.validity; description = args.description; var isActive = p.isActive };
        result := ?PlansLib.toView(updated);
        updated;
      } else { p };
    });
    result;
  };

  public shared ({ caller }) func adminTogglePlan(id : PlanTypes.PlanId) : async ?PlanTypes.PlanView {
    WalletLib.requireAdmin(users, caller);
    var result : ?PlanTypes.PlanView = null;
    plans.mapInPlace(func(p) {
      if (p.id == id) {
        p.isActive := not p.isActive;
        result := ?PlansLib.toView(p);
        p;
      } else { p };
    });
    result;
  };
};
