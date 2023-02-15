import CustomStore from "devextreme/data/custom_store";
import BotMessageTypeService from "../../services/chatbot-message-type.service";

const BotMessagesStore = {
    namespaced: true,

    /* State */
    state: {
        type: {},
        types: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.type = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.types = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Messages
         * */
        getTypes({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return BotMessageTypeService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Message
         * */
        getType({commit}, payload) {
            return BotMessageTypeService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Messages
         * */
        getSelectTypes({commit}, payload = {}) {
            return BotMessageTypeService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Message
         * */
        setType({commit}, payload) {
            if (payload.id)
                return BotMessageTypeService.put(payload.id, payload);
            return BotMessageTypeService.post(null, payload);
        },
        /*
         * Action Message
         * */
        actionType({commit}, payload) {
            return BotMessageTypeService.post('action', payload);
        },
        /*
         * Delete Message
         * */
        deleteType({commit}, payload) {
            return BotMessageTypeService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BotMessagesStore;
