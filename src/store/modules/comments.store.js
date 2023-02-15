import CustomStore from "devextreme/data/custom_store";
import commentService from "../../services/comments.service";

const CommentsStore = {
    namespaced: true,

    /* State */
    state: {
        comment: {},
        comments: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.comment = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.comments = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get Comments
         * */
        getComments({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return commentService.get(null, { datatable: true, ...loadOptions })
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
         * Get Comment
         * */
        getComment({ commit }, payload) {
            commentService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Comments
         * */
        getSelectComments({ commit }, payload = {}) {
            return commentService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response.original.response);
                })
        },
        /*
         * Set Comment
         * */
        setComment({ commit }, payload) {
            if (payload.id)
                return commentService.put(payload.id, payload);
            return commentService.post(null, payload);
        },
        /*
         * Action Comment
         * */
        actionComment({ commit }, payload) {
            return commentService.post('action', payload);
        },
        /*
         * Delete Comment
         * */
        deleteComment({ commit }, payload) {
            return commentService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CommentsStore;