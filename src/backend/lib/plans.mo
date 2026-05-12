import PlanTypes "../types/plans";
import List "mo:core/List";

module {
  public func toView(plan : PlanTypes.Plan) : PlanTypes.PlanView {
    {
      id = plan.id;
      operator = plan.operator;
      planType = plan.planType;
      name = plan.name;
      price = plan.price;
      validity = plan.validity;
      description = plan.description;
      isActive = plan.isActive;
    };
  };

  public func newPlan(id : PlanTypes.PlanId, args : PlanTypes.CreatePlanArgs) : PlanTypes.Plan {
    {
      id;
      operator = args.operator;
      planType = args.planType;
      name = args.name;
      price = args.price;
      validity = args.validity;
      description = args.description;
      var isActive = true;
    };
  };

  public func findPlan(plans : List.List<PlanTypes.Plan>, id : PlanTypes.PlanId) : ?PlanTypes.Plan {
    plans.find(func(p) { p.id == id });
  };

  public func applyUpdate(plan : PlanTypes.Plan, args : PlanTypes.UpdatePlanArgs) {
    ignore (plan, args); // updates done via mapInPlace in mixin
  };

  public func seedMockPlans(plans : List.List<PlanTypes.Plan>, state : { var nextPlanId : Nat }) {
    let seeds : [PlanTypes.CreatePlanArgs] = [
      { operator = #jio; planType = #mobile; name = "Jio Basic"; price = 23900; validity = 28; description = "1GB/day, unlimited calls, 100 SMS/day" },
      { operator = #jio; planType = #mobile; name = "Jio Popular"; price = 44900; validity = 56; description = "1.5GB/day, unlimited calls, 100 SMS/day" },
      { operator = #jio; planType = #mobile; name = "Jio Annual"; price = 239900; validity = 365; description = "2GB/day, unlimited calls, 100 SMS/day" },
      { operator = #airtel; planType = #mobile; name = "Airtel Smart"; price = 26900; validity = 28; description = "1GB/day, unlimited calls, 100 SMS/day" },
      { operator = #airtel; planType = #mobile; name = "Airtel Value"; price = 47900; validity = 56; description = "1.5GB/day, unlimited calls, 100 SMS/day" },
      { operator = #airtel; planType = #mobile; name = "Airtel Max"; price = 259900; validity = 365; description = "2GB/day, unlimited calls, 100 SMS/day" },
      { operator = #vi; planType = #mobile; name = "Vi Base"; price = 21900; validity = 28; description = "1GB/day, unlimited calls" },
      { operator = #vi; planType = #mobile; name = "Vi Value"; price = 45900; validity = 56; description = "1.5GB/day, unlimited calls" },
      { operator = #bsnl; planType = #mobile; name = "BSNL Budget"; price = 18700; validity = 30; description = "1GB/day, free calls on BSNL" },
      { operator = #bsnl; planType = #mobile; name = "BSNL Smart"; price = 39700; validity = 60; description = "2GB/day, unlimited calls" },
      { operator = #tataSky; planType = #dth; name = "Tata Sky Basic HD"; price = 25000; validity = 30; description = "165+ channels, HD quality" },
      { operator = #tataSky; planType = #dth; name = "Tata Sky Premium HD"; price = 45000; validity = 30; description = "305+ channels, HD & sports packs" },
      { operator = #dishTV; planType = #dth; name = "Dish TV Silver"; price = 22000; validity = 30; description = "150+ channels" },
      { operator = #dishTV; planType = #dth; name = "Dish TV Gold"; price = 38000; validity = 30; description = "260+ channels, HD packs" }
    ];
    for (args in seeds.values()) {
      let id = state.nextPlanId;
      state.nextPlanId += 1;
      plans.add(newPlan(id, args));
    };
  };
};
