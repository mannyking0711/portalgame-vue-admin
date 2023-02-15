import CustomStore from "devextreme/data/custom_store";
import chatBotMessagesService from "../../services/chatbot-messages.service";

const BotMessagesStore = {
    namespaced: true,

    /* State */
    state: {
        message: {},
        messages: [],
        btn_values: []

    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.message = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.messages = payload;
        },
        /*
         * SET LIST
         * */
        SET_BTN_VALUES(state, payload) {
            state.btn_values = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Messages
         * */
        getMessages({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return chatBotMessagesService.get(null, {datatable: true, ...loadOptions, ...payload})
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
        getMessage({commit}, payload) {
            return chatBotMessagesService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Messages
         * */
        getSelectMessages({commit}, payload = {}) {
            return chatBotMessagesService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Get Select Button Values
         * */
        getSelectBtnValues({commit}, payload = {}) {
            return chatBotMessagesService.post('get-btn-values', payload)
            .then(r => {
                commit('SET_BTN_VALUES', r.data.response);
            })
        },
        /*
         * Set Message
         * */
        setMessage({commit}, payload) {
            if (payload.id)
                return chatBotMessagesService.put(payload.id, payload);
            return chatBotMessagesService.post(null, payload);
        },
        /*
         * Action Message
         * */
        actionMessage({commit}, payload) {
            return chatBotMessagesService.post('action', payload);
        },
        /*
         * Delete Message
         * */
        deleteMessage({commit}, payload) {
            return chatBotMessagesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BotMessagesStore;
