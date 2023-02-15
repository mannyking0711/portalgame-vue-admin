import CustomStore from "devextreme/data/custom_store";
import squidGameService from "../../services/squidGame.service";

const SquidGameStore = {
    namespaced: true,

    /* State */
    state: {
        squidGame: {},
        squidGames: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.squidGame = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.squidGames = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get SquidGames
         * */
        getSquidGames({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return squidGameService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get SquidGame
         * */
        getSquidGame({commit}, payload) {
            return squidGameService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select SquidGames
         * */
        getSelectSquidGames({commit}, payload = {}) {
            return squidGameService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set SquidGame
         * */
        setSquidGame({commit}, payload) {
            if (payload.id)
                return squidGameService.put(payload.id, payload);
            return squidGameService.post(null, payload);
        },
        /*
         * Action SquidGame
         * */
        actionSquidGame({commit}, payload) {
            return squidGameService.post('action', payload);
        },
        /*
         * Delete SquidGame
         * */
        deleteSquidGame({commit}, payload) {
            return squidGameService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default SquidGameStore;
