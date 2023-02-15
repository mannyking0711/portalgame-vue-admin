import CustomStore from "devextreme/data/custom_store";
import gameStatusService from "../../services/gameStatus.service";

const GameStatusStore = {
    namespaced: true,

    /* State */
    state: {
        gameStatus: {},
        gameStatuses: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.gameStatus = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.gameStatuses = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get GameStatuses
         * */
        getGameStatuses({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return gameStatusService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get GameStatus
         * */
        getGameStatus({commit}, payload) {
            return gameStatusService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select GameStatuses
         * */
        getSelectGameStatuses({commit}, payload = {}) {
            return gameStatusService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set GameStatus
         * */
        setGameStatus({commit}, payload) {
            if (payload.id)
                return gameStatusService.put(payload.id, payload);
            return gameStatusService.post(null, payload);
        },
        /*
         * Action GameStatus
         * */
        actionGameStatus({commit}, payload) {
            return gameStatusService.post('action', payload);
        },
        /*
         * Delete GameStatus
         * */
        deleteGameStatus({commit}, payload) {
            return gameStatusService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default GameStatusStore;
