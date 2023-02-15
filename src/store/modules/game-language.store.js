import CustomStore from "devextreme/data/custom_store";
import gameLanguageService from "../../services/gameLanguage.service";

const GameLanguageStore = {
    namespaced: true,

    /* State */
    state: {
        gameLanguage: {},
        gameLanguages: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.gameLanguage = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.gameLanguages = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get GameLanguages
         * */
        getGameLanguages({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return gameLanguageService.get(null, {datatable: true, ...loadOptions, ...payload})
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
        getGameLanguage({commit}, payload) {
            return gameLanguageService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select GameLanguages
         * */
        getSelectGameLanguages({commit}, payload = {}) {
            return gameLanguageService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set GameLanguage
         * */
        setGameLanguage({commit}, payload) {
            if (payload.id)
                return gameLanguageService.put(payload.id, payload);
            return gameLanguageService.post(null, payload);
        },
        /*
         * Action GameLanguage
         * */
        actionGameLanguage({commit}, payload) {
            return gameLanguageService.post('action', payload);
        },
        /*
         * Delete GameLanguage
         * */
        deleteGameLanguage({commit}, payload) {
            return gameLanguageService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default GameLanguageStore;
