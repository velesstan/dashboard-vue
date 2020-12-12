import actions from './actions';
import mutations from './mutations';

import { getToken, parseJwt } from '@/utils/auth';

export default {
  state: {
    user: getToken() ? parseJwt(getToken()) : null,
    users: [],
  },
  actions,
  mutations,
};
