import CustomStore from "devextreme/data/custom_store";
import CharacterService from "../../services/character.service";

const CharacterStore = {
    namespaced: true,

    /* State */
    state: {
        character: {},
        characters: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.character = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.characters = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Characters
         * */
        getCharacters({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return CharacterService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Character
         * */
        getCharacter({ commit }, payload) {
            return CharacterService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Characters
         * */
        getSelectCharacters({ commit }, payload = {}) {
            return CharacterService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Character
         * */
        setCharacter({ commit }, payload) {
            if (payload.id)
                return CharacterService.put(payload.id, payload);
            return CharacterService.post(null, payload);
        },
        /*
         * Action Character
         * */
        actionCharacter({ commit }, payload) {
            return CharacterService.post('action', payload);
        },
        /*
         * Delete Character
         * */
        deleteCharacter({ commit }, payload) {
            return CharacterService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CharacterStore;