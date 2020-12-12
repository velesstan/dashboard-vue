import * as authMutations from './mutation-types';

export default {
  [authMutations](state) {},
  [authMutations.SET_USERS](state, users) {
    state.users = users;
  },
  [authMutations.USER_CREATED](state, user) {
    state.users.push(user);
  },
  [authMutations.USER_REMOVED](state, id) {
    const index = state.users.findIndex((u) => u._id === id);
    state.users.splice(index, 1);
  },
  [authMutations.USER_UPDATED](state, user) {
    const foundIndex = state.users.findIndex((u) => u._id === user._id);
    Object.assign(state.users[foundIndex], user);
  },
};
