import { i as useRouterState } from "./index-DJqSJyUM.js";
function useLocation(opts) {
  return useRouterState({
    select: (state) => state.location
  });
}
export {
  useLocation as u
};
