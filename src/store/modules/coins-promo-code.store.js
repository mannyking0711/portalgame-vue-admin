import CustomStore from "devextreme/data/custom_store";
import coinPromoCodeService from "../../services/coinsPromoCode.service";

const CoinsPromoCodeStore = {
    namespaced: true,

    /* State */
    state: {
        code: {},
        codes: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.code = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.codes = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get coins
         * */
        getCodes({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return coinPromoCodeService.get(null, { datatable: true, ...loadOptions })
                        .then(r => {
                            const data = r.data.response;
                            return {
                                data: data.data,
                                totalCount: data.total
                            }
                        })
                }
            })
            commit('SET_LIST', data);
        },
        /*
         * Get Code
         * */
        getCode({ commit }, payload) {
            coinPromoCodeService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Codes
         * */
        getSelectCodes({ commit }, payload = {}) {
            return coinPromoCodeService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response.original.response);
                })
        },
        /*
         * Set User
         * */
        setCode({ commit }, payload) {
            if (payload.id)
                return coinPromoCodeService.put(payload.id, payload);
            return coinPromoCodeService.post(null, payload);
        },
        /*
         * Action Code
         * */
        actionCode({ commit }, payload) {
            return coinPromoCodeService.post('action', payload);
        },
        /*
         * Delete Code
         * */
        deleteCode({ commit }, payload) {
            return coinPromoCodeService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CoinsPromoCodeStore;