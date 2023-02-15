import CustomStore from "devextreme/data/custom_store";
import coinService from "../../services/coins.service";

const CoinStore = {
    namespaced: true,

    /* State */
    state: {
        coin: {},
        coins: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.coin = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.coins = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get coins
         * */
        getCoins({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return coinService.get(null, { datatable: true, ...loadOptions })
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
         * Get Coin
         * */
        getCoin({ commit }, payload) {
            coinService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Coins
         * */
        getSelectCoins({ commit }, payload = {}) {
            return coinService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response.original.response);
                })
        },
        /*
         * Set User
         * */
        setCoin({ commit }, payload) {
            if (payload.id)
                return coinService.put(payload.id, payload);
            return coinService.post(null, payload);
        },
        /*
         * Action Coin
         * */
        actionCoin({ commit }, payload) {
            return coinService.post('action', payload);
        },
        /*
         * Delete Coin
         * */
        deleteCoin({ commit }, payload) {
            return coinService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CoinStore;