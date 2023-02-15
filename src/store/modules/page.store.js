import CustomStore from "devextreme/data/custom_store";
import pageService from "../../services/page.service";

const PageStore = {
    namespaced: true,

    /* State */
    state: {
        page: {},
        pages: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.page = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.pages = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Pages
         * */
        getPages({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return pageService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Page
         * */
        getPage({commit}, payload) {
            return pageService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Pages
         * */
        getSelectPages({commit}, payload = {}) {
            return pageService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Page
         * */
        setPage({commit}, payload) {
            if (payload.id)
                return pageService.put(payload.id, payload);
            return pageService.post(null, payload);
        },
        /*
         * Action Page
         * */
        actionPage({commit}, payload) {
            return pageService.post('action', payload);
        },
        /*
         * Delete Page
         * */
        deletePage({commit}, payload) {
            return pageService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default PageStore;
