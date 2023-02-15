import CustomStore from "devextreme/data/custom_store";
import directorInfoService from "../../services/director-info.service";

const VacanciesStore = {
    namespaced: true,

    /* State */
    state: {
        director: {},
        directors: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.director = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.directors = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Vacancies
         * */
        getDirectors({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return directorInfoService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getDirector({ commit }, payload) {
            return directorInfoService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectDirectors({ commit }, payload = {}) {
            return directorInfoService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setDirector({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return directorInfoService.put(payload.id, payload);
            return directorInfoService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionDirector({ commit }, payload) {
            return directorInfoService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteDirector({ commit }, payload) {
            return directorInfoService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default VacanciesStore;