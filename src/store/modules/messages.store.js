import CustomStore from "devextreme/data/custom_store";
import MessagesService from "../../services/messages.service";

const MessagesStore = {
    namespaced: true,

    /* State */
    state: {
        conversation: {},
        messages: [],
        conversations: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_CON(state, payload) {
            state.conversation = payload;
        },
        /*
         * SET LIST
         * */
        SET_MSGS(state, payload) {
            state.messages = payload;
        },
        /*
         * SET INFO
         * */
        SET_CONS(state, payload) {
            state.conversations = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Users
         * */
        // getUsers({ commit }, payload = null) {
        //     const data = new CustomStore({
        //         load: function(loadOptions) {
        //             return userService.get(null, { datatable: true, ...loadOptions })
        //                 .then(r => {
        //                     const data = r.data.response;
        //                     return {
        //                         data: data.data,
        //                         totalCount: data.total
        //                     }
        //                 })
        //         }
        //     })
        //     commit('SET_LIST', data);
        // },
        /*
         * Get User
         * */
        getConversations({ commit }, payload) {
            MessagesService.post('cons',payload)
                .then(r => {
                    commit('SET_CONS', r.data.response);
                })
        },
        setMessage({ commit }, payload) {
            console.log(payload);
            return MessagesService.post('set-data', payload);
        },
        /*
         * Get Select Users
         * */
        // getSelectUsers({ commit }, payload = {}) {
        //     return userService.get(null, payload)
        //         .then(r => {
        //             commit('SET_LIST', r.data.response.original.response);
        //         })
        // },
        // /*
        //  * Get Customer Info
        //  * */
        // getUserInfo({ commit }, payload = {}) {
        //     return userService.post('info', payload)
        //         .then(r => {
        //             return r.data.response;
        //         })
        // },
        // /*
        //  * Set User
        //  * */
        // setUser({ commit }, payload) {
        //     if (payload.id)
        //         return userService.put(payload.id, payload);
        //     return userService.post(null, payload);
        // },
        // /*
        //  * Action User
        //  * */
        // actionUser({ commit }, payload) {
        //     return userService.post('action', payload);
        // },
        // /*
        //  * Delete User
        //  * */
        // deleteUser({ commit }, payload) {
        //     return userService.delete(payload);
        // }
    },

    /* Getters */
    getters: {}
}

export default MessagesStore;