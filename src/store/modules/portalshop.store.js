import CustomStore from "devextreme/data/custom_store";
import portalshopsService from "../../services/portalshops.service";

const PortalShopsStore = {
    namespaced: true,

    /* State */
    state: {
        shop: {},
        shops: [],
        dayZero: false
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.shop = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.shops = payload;
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
                    return portalshopsService.get(null, { datatable: true, ...loadOptions, ...payload })
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
            return portalshopsService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectVacancies({ commit }, payload = {}) {
            return portalshopsService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setVacancie({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return portalshopsService.put(payload.id, payload);
            return portalshopsService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionVacancie({ commit }, payload) {
            return portalshopsService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteVacancie({ commit }, payload) {
            return portalshopsService.delete(payload);
        },
        setDayZero(){
            return portalshopsService.post('set-zero');
        },
        isDayZero({ commit }, payload){
            return portalshopsService.post('is-zero').
            then(r => {
                commit('SET_DAY_ZERO', r.data.response[0]);
            });
        }
    },

    /* Getters */
    getters: {}
}

export default PortalShopsStore;