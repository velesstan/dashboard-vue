import * as appMutations from "./mutation-types";
export default {
  [appMutations.NOTIFY_SHOW](state, { type, message }) {
    state.notifications.push({ color: type, message });
  },
};
