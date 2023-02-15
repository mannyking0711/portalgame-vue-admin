import CustomStore from "devextreme/data/custom_store";
import gameCategoriesService from "../../services/gameCategories.service";

const GameCategoriesStore = {
    namespaced: true,

    /* State */
    state: {
        gameCategorie: {},
        gameCategories: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.gameCategorie = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.gameCategories = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get GameLanguages
         * */
        getGameCategories({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return gameCategoriesService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get GameLanguage
         * */
        getGameCategorie({ commit }, payload) {
            return gameCategoriesService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select GameLanguages
         * */
        getSelectGameCategories({ commit }, payload = {}) {
            return gameCategoriesService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set GameLanguage
         * */
        setGameCategorie({ commit }, payload) {
            if (payload.id)
                return gameCategoriesService.put(payload.id, payload);
            return gameCategoriesService.post(null, payload);
        },
        /*
         * Action GameLanguage
         * */
        actionGameCategorie({ commit }, payload) {
            return gameCategoriesService.post('action', payload);
        },
        /*
         * Delete GameLanguage
         * */
        deleteGameCategorie({ commit }, payload) {
            return gameCategoriesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default GameCategoriesStore;