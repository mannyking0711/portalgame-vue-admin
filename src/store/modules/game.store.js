import CustomStore from "devextreme/data/custom_store";
import GameService from "../../services/game.service";

const GameStore = {
    namespaced: true,

    /* State */
    state: {
        game: {},
        games: [],
        gameTimes: [],
        arrGames: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.game = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.games = payload;
        },
        /*
         * SET TIMES
         * */
        SET_TIMES(state, payload) {
            state.gameTimes = payload;
        },
        /*
         * SET GAMES ARRAY
         */
        SET_ARR(state, payload) {
            state.arrGames = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Games
         * */
        getGames({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return GameService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Array Games 
         */
        getArrGames({ commit }, payload = null) {
            return GameService.post('arr', payload)
                .then(r => {
                    commit('SET_ARR', r.data.response);
                })
        },
        /*
         * Get Game
         * */
        getGame({ commit }, payload) {
            return GameService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Games
         * */
        getSelectGames({ commit }, payload = {}) {
            return GameService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Get Game Times
         * */
        getGameTimes({ commit }, payload = {}) {
            return GameService.post('time', payload)
                .then(r => {
                    commit('SET_TIMES', r.data.response);
                })
        },
        /*
         * Set Game
         * */
        setGame({ commit }, payload) {
            if (payload.id)
                return GameService.put(payload.id, payload);
            return GameService.post(null, payload);
        },
        /*
         * Action Game
         * */
        actionGame({ commit }, payload) {
            return GameService.post('action', payload);
        },
        /*
         * Delete Game
         * */
        deleteGame({ commit }, payload) {
            return GameService.delete(payload);
        },
        changePosition({ commit }) {
            return GameService.post('change-position');
        },
    },

    /* Getters */
    getters: {}
}

export default GameStore;