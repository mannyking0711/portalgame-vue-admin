import CustomStore from "devextreme/data/custom_store";
import blogService from "../../services/blog.service";

const BlogStore = {
    namespaced: true,

    /* State */
    state: {
        blog: {},
        blogs: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.blog = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.blogs = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Blogs
         * */
        getBlogs({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return blogService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getBlog({ commit }, payload) {
            return blogService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectBlogs({ commit }, payload = {}) {
            return blogService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setBlog({ commit }, payload) {
            if (payload.id)
                return blogService.put(payload.id, payload);
            return blogService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionBlog({ commit }, payload) {
            return blogService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteBlog({ commit }, payload) {
            return blogService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BlogStore;