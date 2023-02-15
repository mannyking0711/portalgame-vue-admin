import CustomStore from "devextreme/data/custom_store";
import filesService from "../../services/files.service";

const FilesStore = {
    namespaced: true,

    /* State */
    state: {
        file: {},
        files: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.file = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.files = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Vacancies
         * */
        getFiles({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return filesService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getFile({ commit }, payload) {
            return filesService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectFiles({ commit }, payload = {}) {
            return filesService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setFile({ commit }, payload) {
            if (payload.id)
                return filesService.put(payload.id, payload);
            return filesService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionFile({ commit }, payload) {
            return filesService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteFile({ commit }, payload) {
            return filesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default FilesStore;