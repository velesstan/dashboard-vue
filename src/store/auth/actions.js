import * as authActions from "./action-types";
import * as authMutations from "./mutation-types";

import { api, router } from "@/plugins";
import { setToken, removeToken } from "@/utils/auth";

export default {
  async [authActions.USER_LOGIN]({ commit }, credentials) {
    const response = await api.post(`/api/auth/sign-in`, credentials);
    const token = response.data.access_token;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setToken(token);
    setTimeout(() => {
      window.location.reload();
    }, 100);

  },
  async [authActions.USER_LOGOUT]({ commit }) {
    removeToken();
    router.push("/sign-in");
  },
  async [authActions.CREATE_USER]({ commit }, userData) {
    const response = await api.post(`/api/users`, userData);
    console.log(response);
    commit(authMutations.USER_CREATED, response.data);
  },
  async [authActions.GET_USERS]({ commit }) {
    const response = await api.get(`/api/users`);
    commit(authMutations.SET_USERS, response.data);
  },
  async [authActions.UPDATE_USER]({ commit }, userData) {
    const { _id, ...user } = userData;
    const response = await api.put(`/api/users/${_id}`, user);
    commit(authMutations.USER_UPDATED, response.data);
  },
  async [authActions.REMOVE_USER]({ commit }, id) {
    await api.delete(`/api/users/${id}`);
    commit(authMutations.USER_REMOVED, id);
  },
};
