import CustomStore from "devextreme/data/custom_store";
import FranchiseService from "../../services/franchise.service";

const FranchiseStore = {
    namespaced: true,

    /* State */
    state: {
        franchise: {},
        franchises: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.franchise = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.franchises = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get Franchises
         * */
        getFranchises({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return FranchiseService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Franchise
         * */
        getFranchise({ commit }, payload) {
            return FranchiseService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Franchises
         * */
        getSelectFranchises({ commit }, payload = {}) {
            return FranchiseService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Franchise
         * */
        setFranchise({ commit }, payload) {
            if (payload.id)
                return FranchiseService.put(payload.id, payload);
            return FranchiseService.post(null, payload);
        },
        /*
         * Action Franchise
         * */
        actionFranchise({ commit }, payload) {
            return FranchiseService.post('action', payload);
        },
        /*
         * Delete Franchise
         * */
        deleteFranchise({ commit }, payload) {
            return FranchiseService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default FranchiseStore;