import CustomStore from "devextreme/data/custom_store";
import CostCategoriesService from "../../services/costCategories.service";

const CostCategoriesStore = {
    namespaced: true,

    /* State */
    state: {
        categorie: {},
        categories: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.categorie = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.categories = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Products
         * */
        getCostCategories({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return CostCategoriesService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getCostCategorie({ commit }, payload) {
            return CostCategoriesService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectCostCategories({ commit }, payload = {}) {
            return CostCategoriesService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setCostCategorie({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return CostCategoriesService.put(payload.id, payload);
            return CostCategoriesService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionCostCategorie({ commit }, payload) {
            return CostCategoriesService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteCostCategorie({ commit }, payload) {
            return CostCategoriesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CostCategoriesStore;