import CustomStore from "devextreme/data/custom_store";
import ForWhomService from "../../services/for-whom.service";

const ForWhomStore = {
    namespaced: true,

    /* State */
    state: {
        content: {},
        contents: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.content = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.contents = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Contents
         * */
        getContents({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return ForWhomService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getContent({ commit }, payload) {
            return ForWhomService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectContents({ commit }, payload = {}) {
            return ForWhomService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setContent({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return ForWhomService.put(payload.id, payload);
            return ForWhomService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionContent({ commit }, payload) {
            return ForWhomService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteContent({ commit }, payload) {
            return ForWhomService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default ForWhomStore;