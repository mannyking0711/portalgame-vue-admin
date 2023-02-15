import CustomStore from "devextreme/data/custom_store";
import costsService from "../../services/costs.service";

const CostsStore = {
    namespaced: true,

    /* State */
    state: {
        cost: {},
        costs: [],
        dayZero: false
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.cost = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.costs = payload;
        },
        SET_DAY_ZERO(state, payload){
            state.dayZero = payload
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Vacancies
         * */
        getVacancies({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return costsService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Blog
         * */
        getVacancie({ commit }, payload) {
            return costsService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectVacancies({ commit }, payload = {}) {
            return costsService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setVacancie({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return costsService.put(payload.id, payload);
            return costsService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionVacancie({ commit }, payload) {
            return costsService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteVacancie({ commit }, payload) {
            return costsService.delete(payload);
        },
        setDayZero(){
            return costsService.post('set-zero');
        },
        isDayZero({ commit }, payload){
            return costsService.post('is-zero')
            .then(r => {
                commit('SET_DAY_ZERO', r.data.response[0]);
            });
        }
    },

    /* Getters */
    getters: {}
}

export default CostsStore;