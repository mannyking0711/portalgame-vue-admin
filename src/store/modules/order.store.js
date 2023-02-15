import CustomStore from "devextreme/data/custom_store";
import orderService from "../../services/order.service";

const OrderStore = {
    namespaced: true,

    /* State */
    state: {
        order: {},
        orderTotal: {},
        orders: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.order = payload;
        },
        /*
         * SET TOTAL
         * */
        SET_TOTAL(state, payload) {
            state.orderTotal = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.orders = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Orders
         * */
        getOrders({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return orderService.get(null, {datatable: true, ...loadOptions, ...payload})
                    .then(r => {
                        const data = r.data.response;
                        commit('SET_TOTAL', data.summary);
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
         * Get Order
         * */
        getOrder({commit}, payload) {
            return orderService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Orders
         * */
        getSelectOrders({commit}, payload = {}) {
            return orderService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Order
         * */
        setOrder({commit}, payload) {
            if (payload.id)
                return orderService.put(payload.id, payload);
            return orderService.post(null, payload);
        },
        /*
         * Reset Order
         * */
        resetOrder({commit}) {
            commit('SET_DATA', {});
        },
        /*
         * Action Order
         * */
        actionOrder({commit}, payload) {
            return orderService.post('action', payload);
        },
        /*
         * Delete Order
         * */
        deleteOrder({commit}, payload) {
            return orderService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default OrderStore;
