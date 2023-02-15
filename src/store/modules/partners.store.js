import CustomStore from "devextreme/data/custom_store";
import partnersService from "../../services/partners.service";

const PartnersStore = {
    namespaced: true,

    /* State */
    state: {
        partner: {},
        partners: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.partner = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.partners = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Vacancies
         * */
        getPartners({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return partnersService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getPartner({ commit }, payload) {
            return partnersService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectPartners({ commit }, payload = {}) {
            return partnersService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setPartner({ commit }, payload) {
            if (payload.id)
                return partnersService.put(payload.id, payload);
            return partnersService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionPartner({ commit }, payload) {
            return partnersService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deletePartner({ commit }, payload) {
            return partnersService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default PartnersStore;