import CustomStore from "devextreme/data/custom_store";
import BestQuestionsService from "../../services/best-questions.service";

const BestQuestionsStore = {
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
                    return BestQuestionsService.get(null, { datatable: true, ...loadOptions, ...payload })
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
            return BestQuestionsService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectContents({ commit }, payload = {}) {
            return BestQuestionsService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setContent({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return BestQuestionsService.put(payload.id, payload);
            return BestQuestionsService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionContent({ commit }, payload) {
            return BestQuestionsService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteContent({ commit }, payload) {
            return BestQuestionsService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BestQuestionsStore;