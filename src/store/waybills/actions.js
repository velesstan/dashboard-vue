import qs from 'querystring';
import api from "@/plugins/api";

import * as waybillsActions from "./action-types";
import * as waybillsMutations from "./mutation-types";

export default {
    async [waybillsActions.READ_WAYBILLS]({ commit }, params) {
        const query = qs.stringify({
            stock: params.stock,
            start: params.dateRange[0],
            end: params.dateRange[1] || params.dateRange[0],
            // waybillAction: params.action,
            // waybillType: params.type
        });
        commit(waybillsMutations.READ_WAYBILLS_REQUEST);
        const response = await api.get(`/api/waybills?${query}`);
        commit(waybillsMutations.READ_WAYBILLS_SUCCESS, response.data);
    },
};
