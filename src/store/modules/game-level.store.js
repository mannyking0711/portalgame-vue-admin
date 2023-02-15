import CustomStore from "devextreme/data/custom_store";
import gameLevelService from "../../services/gameLevel.service";

const GameLevelStore = {
    namespaced: true,

    /* State */
    state: {
        gameLevel: {},
        gameLevels: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.gameLevel = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.gameLevels = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get GameLevels
         * */
        getGameLevels({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return gameLevelService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get GameLevel
         * */
        getGameLevel({commit}, payload) {
            return gameLevelService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select GameLevels
         * */
        getSelectGameLevels({commit}, payload = {}) {
            return gameLevelService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set GameLevel
         * */
        setGameLevel({commit}, payload) {
            if (payload.id)
                return gameLevelService.put(payload.id, payload);
            return gameLevelService.post(null, payload);
        },
        /*
         * Action GameLevel
         * */
        actionGameLevel({commit}, payload) {
            return gameLevelService.post('action', payload);
        },
        /*
         * Delete GameLevel
         * */
        deleteGameLevel({commit}, payload) {
            return gameLevelService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default GameLevelStore;
