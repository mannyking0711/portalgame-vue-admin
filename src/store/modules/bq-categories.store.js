import CustomStore from "devextreme/data/custom_store";
import BQCategoriesService from "../../services/bq-categories.service";

const BQCategoriesStore = {
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
        getBQCategories({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return BQCategoriesService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getBQCategorie({ commit }, payload) {
            return BQCategoriesService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectBQCategories({ commit }, payload = {}) {
            return BQCategoriesService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setBQCategorie({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return BQCategoriesService.put(payload.id, payload);
            return BQCategoriesService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionBQCategorie({ commit }, payload) {
            return BQCategoriesService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteBQCategorie({ commit }, payload) {
            return BQCategoriesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BQCategoriesStore;