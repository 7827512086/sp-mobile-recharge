var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _result, _queries, _options, _observers, _combinedResult, _lastCombine, _lastResult, _lastQueryHashes, _observerMatches, _QueriesObserver_instances, trackResult_fn, combineResult_fn, findMatchingObservers_fn, onUpdate_fn, notify_fn, _a;
import { l as Subscribable, n as notifyManager, s as shallowEqualObjects, m as replaceEqualDeep, Q as QueryObserver, f as useQueryClient, o as useIsRestoring, p as useQueryErrorResetBoundary, r as reactExports, q as ensureSuspenseTimers, t as ensurePreventErrorBoundaryRetry, v as useClearResetErrorBoundary, w as noop, x as shouldSuspend, y as fetchOptimistic, z as getHasError, u as useAuth, c as useProfile, a as useBackend, A as useNavigate, T as TransactionStatus, j as jsxRuntimeExports, L as Link, S as Spinner } from "./index-DJqSJyUM.js";
import { E as EmptyState } from "./EmptyState-j5cN7fLp.js";
import { L as Layout, H as History } from "./Layout-cnp0RluJ.js";
import { B as Badge } from "./badge-BXXqpN6p.js";
import { B as Button } from "./button-DFRBYKs0.js";
import { O as OPERATOR_INFO, f as formatTimestamp, a as formatBalance } from "./types-DAsELOtn.js";
import { c as createLucideIcon } from "./createLucideIcon-BDVopTHO.js";
import { P as Plus } from "./plus-BWv_hxTG.js";
import { S as Smartphone, A as ArrowLeftRight } from "./smartphone-C7OPvBHe.js";
import { T as Tv } from "./tv-BzU4w0YV.js";
import { R as ReceiptText } from "./receipt-text-CHfTFugz.js";
import { P as PiggyBank } from "./piggy-bank-Db9zHT3f.js";
import { C as Clock } from "./clock-ufcn7AeJ.js";
import "./useLocation-B-5kwumH.js";
import "./index-DQpP8u8x.js";
function difference(array1, array2) {
  const excludeSet = new Set(array2);
  return array1.filter((x) => !excludeSet.has(x));
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
var QueriesObserver = (_a = class extends Subscribable {
  constructor(client, queries, options) {
    super();
    __privateAdd(this, _QueriesObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _result);
    __privateAdd(this, _queries);
    __privateAdd(this, _options);
    __privateAdd(this, _observers);
    __privateAdd(this, _combinedResult);
    __privateAdd(this, _lastCombine);
    __privateAdd(this, _lastResult);
    __privateAdd(this, _lastQueryHashes);
    __privateAdd(this, _observerMatches, []);
    __privateSet(this, _client, client);
    __privateSet(this, _options, options);
    __privateSet(this, _queries, []);
    __privateSet(this, _observers, []);
    __privateSet(this, _result, []);
    this.setQueries(queries);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _observers).forEach((observer) => {
        observer.subscribe((result) => {
          __privateMethod(this, _QueriesObserver_instances, onUpdate_fn).call(this, observer, result);
        });
      });
    }
  }
  onUnsubscribe() {
    if (!this.listeners.size) {
      this.destroy();
    }
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateGet(this, _observers).forEach((observer) => {
      observer.destroy();
    });
  }
  setQueries(queries, options) {
    __privateSet(this, _queries, queries);
    __privateSet(this, _options, options);
    notifyManager.batch(() => {
      const prevObservers = __privateGet(this, _observers);
      const newObserverMatches = __privateMethod(this, _QueriesObserver_instances, findMatchingObservers_fn).call(this, __privateGet(this, _queries));
      newObserverMatches.forEach(
        (match) => match.observer.setOptions(match.defaultedQueryOptions)
      );
      const newObservers = newObserverMatches.map((match) => match.observer);
      const newResult = newObservers.map(
        (observer) => observer.getCurrentResult()
      );
      const hasLengthChange = prevObservers.length !== newObservers.length;
      const hasIndexChange = newObservers.some(
        (observer, index) => observer !== prevObservers[index]
      );
      const hasStructuralChange = hasLengthChange || hasIndexChange;
      const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
        const prev = __privateGet(this, _result)[index];
        return !prev || !shallowEqualObjects(result, prev);
      });
      if (!hasStructuralChange && !hasResultChange) return;
      if (hasStructuralChange) {
        __privateSet(this, _observerMatches, newObserverMatches);
        __privateSet(this, _observers, newObservers);
      }
      __privateSet(this, _result, newResult);
      if (!this.hasListeners()) return;
      if (hasStructuralChange) {
        difference(prevObservers, newObservers).forEach((observer) => {
          observer.destroy();
        });
        difference(newObservers, prevObservers).forEach((observer) => {
          observer.subscribe((result) => {
            __privateMethod(this, _QueriesObserver_instances, onUpdate_fn).call(this, observer, result);
          });
        });
      }
      __privateMethod(this, _QueriesObserver_instances, notify_fn).call(this);
    });
  }
  getCurrentResult() {
    return __privateGet(this, _result);
  }
  getQueries() {
    return __privateGet(this, _observers).map((observer) => observer.getCurrentQuery());
  }
  getObservers() {
    return __privateGet(this, _observers);
  }
  getOptimisticResult(queries, combine) {
    const matches = __privateMethod(this, _QueriesObserver_instances, findMatchingObservers_fn).call(this, queries);
    const result = matches.map(
      (match) => match.observer.getOptimisticResult(match.defaultedQueryOptions)
    );
    const queryHashes = matches.map(
      (match) => match.defaultedQueryOptions.queryHash
    );
    return [
      result,
      (r) => {
        return __privateMethod(this, _QueriesObserver_instances, combineResult_fn).call(this, r ?? result, combine, queryHashes);
      },
      () => {
        return __privateMethod(this, _QueriesObserver_instances, trackResult_fn).call(this, result, matches);
      }
    ];
  }
}, _client = new WeakMap(), _result = new WeakMap(), _queries = new WeakMap(), _options = new WeakMap(), _observers = new WeakMap(), _combinedResult = new WeakMap(), _lastCombine = new WeakMap(), _lastResult = new WeakMap(), _lastQueryHashes = new WeakMap(), _observerMatches = new WeakMap(), _QueriesObserver_instances = new WeakSet(), trackResult_fn = function(result, matches) {
  return matches.map((match, index) => {
    const observerResult = result[index];
    return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
      matches.forEach((m) => {
        m.observer.trackProp(accessedProp);
      });
    }) : observerResult;
  });
}, combineResult_fn = function(input, combine, queryHashes) {
  if (combine) {
    const lastHashes = __privateGet(this, _lastQueryHashes);
    const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
    if (!__privateGet(this, _combinedResult) || __privateGet(this, _result) !== __privateGet(this, _lastResult) || queryHashesChanged || combine !== __privateGet(this, _lastCombine)) {
      __privateSet(this, _lastCombine, combine);
      __privateSet(this, _lastResult, __privateGet(this, _result));
      if (queryHashes !== void 0) {
        __privateSet(this, _lastQueryHashes, queryHashes);
      }
      __privateSet(this, _combinedResult, replaceEqualDeep(
        __privateGet(this, _combinedResult),
        combine(input)
      ));
    }
    return __privateGet(this, _combinedResult);
  }
  return input;
}, findMatchingObservers_fn = function(queries) {
  const prevObserversMap = /* @__PURE__ */ new Map();
  __privateGet(this, _observers).forEach((observer) => {
    const key = observer.options.queryHash;
    if (!key) return;
    const previousObservers = prevObserversMap.get(key);
    if (previousObservers) {
      previousObservers.push(observer);
    } else {
      prevObserversMap.set(key, [observer]);
    }
  });
  const observers = [];
  queries.forEach((options) => {
    var _a2;
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const match = (_a2 = prevObserversMap.get(defaultedOptions.queryHash)) == null ? void 0 : _a2.shift();
    const observer = match ?? new QueryObserver(__privateGet(this, _client), defaultedOptions);
    observers.push({
      defaultedQueryOptions: defaultedOptions,
      observer
    });
  });
  return observers;
}, onUpdate_fn = function(observer, result) {
  const index = __privateGet(this, _observers).indexOf(observer);
  if (index !== -1) {
    __privateSet(this, _result, replaceAt(__privateGet(this, _result), index, result));
    __privateMethod(this, _QueriesObserver_instances, notify_fn).call(this);
  }
}, notify_fn = function() {
  var _a2;
  if (this.hasListeners()) {
    const previousResult = __privateGet(this, _combinedResult);
    const newTracked = __privateMethod(this, _QueriesObserver_instances, trackResult_fn).call(this, __privateGet(this, _result), __privateGet(this, _observerMatches));
    const newResult = __privateMethod(this, _QueriesObserver_instances, combineResult_fn).call(this, newTracked, (_a2 = __privateGet(this, _options)) == null ? void 0 : _a2.combine);
    if (previousResult !== newResult) {
      notifyManager.batch(() => {
        this.listeners.forEach((listener) => {
          listener(__privateGet(this, _result));
        });
      });
    }
  }
}, _a);
function useQueries({
  queries,
  ...options
}, queryClient) {
  const client = useQueryClient();
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const defaultedQueries = reactExports.useMemo(
    () => queries.map((opts) => {
      const defaultedOptions = client.defaultQueryOptions(
        opts
      );
      defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
      return defaultedOptions;
    }),
    [queries, client, isRestoring]
  );
  defaultedQueries.forEach((queryOptions) => {
    ensureSuspenseTimers(queryOptions);
    const query = client.getQueryCache().get(queryOptions.queryHash);
    ensurePreventErrorBoundaryRetry(queryOptions, errorResetBoundary, query);
  });
  useClearResetErrorBoundary(errorResetBoundary);
  const [observer] = reactExports.useState(
    () => new QueriesObserver(
      client,
      defaultedQueries,
      options
    )
  );
  const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(
    defaultedQueries,
    options.combine
  );
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop,
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setQueries(
      defaultedQueries,
      options
    );
  }, [defaultedQueries, options, observer]);
  const shouldAtLeastOneSuspend = optimisticResult.some(
    (result, index) => shouldSuspend(defaultedQueries[index], result)
  );
  const suspensePromises = shouldAtLeastOneSuspend ? optimisticResult.flatMap((result, index) => {
    const opts = defaultedQueries[index];
    if (opts && shouldSuspend(opts, result)) {
      const queryObserver = new QueryObserver(client, opts);
      return fetchOptimistic(opts, queryObserver, errorResetBoundary);
    }
    return [];
  }) : [];
  if (suspensePromises.length > 0) {
    throw Promise.all(suspensePromises);
  }
  const firstSingleResultWhichShouldThrow = optimisticResult.find(
    (result, index) => {
      const query = defaultedQueries[index];
      return query && getHasError({
        result,
        errorResetBoundary,
        throwOnError: query.throwOnError,
        query: client.getQueryCache().get(query.queryHash),
        suspense: query.suspense
      });
    }
  );
  if (firstSingleResultWhichShouldThrow == null ? void 0 : firstSingleResultWhichShouldThrow.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }
  return getCombinedResult(trackResult());
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const QUICK_ACTIONS = [
  {
    label: "Recharge Mobile",
    icon: Smartphone,
    to: "/recharge",
    ocid: "home.quick_recharge_mobile",
    color: "bg-primary/15",
    iconColor: "text-primary"
  },
  {
    label: "Recharge DTH",
    icon: Tv,
    to: "/recharge",
    ocid: "home.quick_recharge_dth",
    color: "bg-primary/15",
    iconColor: "text-primary"
  },
  {
    label: "Money Transfer",
    icon: ArrowLeftRight,
    to: "/transfer",
    ocid: "home.quick_transfer",
    color: "bg-accent/15",
    iconColor: "text-accent"
  },
  {
    label: "Pay Bills",
    icon: ReceiptText,
    to: "/bills",
    ocid: "home.quick_bills",
    color: "bg-accent/15",
    iconColor: "text-accent"
  },
  {
    label: "Deposits",
    icon: PiggyBank,
    to: "/deposits",
    ocid: "home.quick_deposits",
    color: "bg-accent/15",
    iconColor: "text-accent"
  },
  {
    label: "Top Up Wallet",
    icon: Plus,
    to: "/wallet",
    ocid: "home.quick_topup",
    color: "bg-primary/15",
    iconColor: "text-primary"
  }
];
function StatusBadge({ status }) {
  if (status === TransactionStatus.success)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent", children: "Success" });
  if (status === TransactionStatus.failed)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive", children: "Failed" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground", children: "Pending" });
}
function HomePage() {
  const { principal, isAuthenticated } = useAuth();
  const { walletBalance, isAdmin, isLoading: profileLoading } = useProfile();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const shortPrincipal = principal ? `${principal.slice(0, 8)}...${principal.slice(-6)}` : null;
  const queryEnabled = !!actor && !isFetching && isAuthenticated;
  const results = useQueries({
    queries: [
      {
        queryKey: ["my-transactions-home"],
        queryFn: async () => actor ? actor.getMyTransactions() : [],
        enabled: queryEnabled,
        staleTime: 3e4
      },
      {
        queryKey: ["transfer-history-home"],
        queryFn: async () => actor ? actor.getTransferHistory() : [],
        enabled: queryEnabled,
        staleTime: 3e4
      },
      {
        queryKey: ["bill-payments-home"],
        queryFn: async () => actor ? actor.getMyBillPayments() : [],
        enabled: queryEnabled,
        staleTime: 3e4
      },
      {
        queryKey: ["deposits-home"],
        queryFn: async () => actor ? actor.getMyDeposits() : [],
        enabled: queryEnabled,
        staleTime: 3e4
      }
    ]
  });
  const txLoading = results.some((r) => r.isLoading);
  const allEntries = [
    ...(results[0].data ?? []).map((tx) => {
      var _a2;
      return {
        id: `r-${String(tx.id)}`,
        label: `${((_a2 = OPERATOR_INFO[tx.operator]) == null ? void 0 : _a2.name) ?? String(tx.operator)} Recharge`,
        sublabel: formatTimestamp(tx.timestamp),
        amount: tx.amount,
        timestamp: tx.timestamp,
        status: tx.status,
        iconKey: String(tx.operator)
      };
    }),
    ...(results[1].data ?? []).map((tx) => ({
      id: `t-${String(tx.id)}`,
      label: "Money Transfer",
      sublabel: formatTimestamp(tx.timestamp),
      amount: tx.amount,
      timestamp: tx.timestamp,
      status: TransactionStatus.success,
      iconKey: "transfer"
    })),
    ...(results[2].data ?? []).map((tx) => ({
      id: `b-${String(tx.id)}`,
      label: "Bill Payment",
      sublabel: formatTimestamp(tx.timestamp),
      amount: tx.amount,
      timestamp: tx.timestamp,
      status: TransactionStatus.success,
      iconKey: "bill"
    })),
    ...(results[3].data ?? []).map((tx) => ({
      id: `d-${String(tx.id)}`,
      label: "Digital Deposit",
      sublabel: formatTimestamp(tx.startTime),
      amount: tx.principal,
      timestamp: tx.startTime,
      status: TransactionStatus.success,
      iconKey: "deposit"
    }))
  ];
  allEntries.sort((a, b) => b.timestamp > a.timestamp ? 1 : -1);
  const recentTx = allEntries.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md space-y-6 px-4 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Welcome back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              "data-ocid": "home.greeting",
              className: "font-display text-lg font-bold text-foreground",
              children: shortPrincipal ?? "Loading..."
            }
          ),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "home.admin_badge",
              className: "rounded-md bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent",
              children: "Admin"
            }
          )
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "home.admin_link",
          variant: "outline",
          size: "sm",
          className: "gap-1.5 border-accent/40 text-accent hover:bg-accent/10",
          children: [
            "Admin Panel ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "home.wallet_card",
        className: "relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-card p-6 shadow-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Wallet Balance" }),
          profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "sm" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "home.wallet_balance",
              className: "mt-1 font-mono text-4xl font-bold tracking-tight text-primary",
              children: formatBalance(walletBalance)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/wallet", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "home.add_funds_button",
                variant: "outline",
                className: "w-full gap-2 border-primary/40 text-primary hover:bg-primary/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " Add Funds"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/history", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "home.view_history_button",
                variant: "outline",
                className: "w-full gap-2 border-border text-muted-foreground hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
                  " History"
                ]
              }
            ) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.quick_actions_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: QUICK_ACTIONS.map(
        ({ label, icon: Icon, to, ocid, color, iconColor }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": ocid,
            type: "button",
            onClick: () => navigate({ to }),
            className: "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-smooth hover:border-primary/30 hover:bg-card/80 active:scale-95",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 items-center justify-center rounded-full ${color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 ${iconColor}` })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium leading-tight text-foreground", children: label })
            ]
          },
          ocid
        )
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.recent_transactions_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Recent Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/history",
            "data-ocid": "home.see_all_history_link",
            className: "flex items-center gap-1 text-xs text-primary transition-smooth hover:text-primary/80",
            children: [
              "See all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
            ]
          }
        )
      ] }),
      txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "home.transactions_loading_state",
          className: "flex items-center justify-center py-10",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: "md" })
        }
      ) : recentTx.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: Clock,
          title: "No transactions yet",
          description: "Your transaction history will appear here after your first transaction.",
          action: {
            label: "Recharge Now",
            onClick: () => navigate({ to: "/recharge" })
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card", children: recentTx.map((entry, i) => {
        const opInfo = OPERATOR_INFO[entry.iconKey];
        const initials = opInfo ? opInfo.name.slice(0, 2) : entry.label.slice(0, 2).toUpperCase();
        const bgColor = opInfo ? opInfo.bgColor : "bg-muted";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `home.transaction_item.${i + 1}`,
            className: "flex items-center gap-3 px-4 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bgColor}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground", children: initials })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: entry.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: entry.sublabel })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground", children: [
                  "-",
                  formatBalance(entry.amount)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: entry.status })
              ] })
            ]
          },
          entry.id
        );
      }) })
    ] })
  ] }) });
}
export {
  HomePage as default
};
