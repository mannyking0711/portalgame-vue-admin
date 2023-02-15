import CustomStore from "devextreme/data/custom_store";
import paymentTypeService from "../../services/paymentType.service";

const PaymentTypeStore = {
    namespaced: true,

    /* State */
    state: {
        paymentType: {},
        paymentTypes: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.paymentType = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.paymentTypes = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get PaymentTypes
         * */
        getPaymentTypes({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return paymentTypeService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get PaymentType
         * */
        getPaymentType({commit}, payload) {
            return paymentTypeService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select PaymentTypes
         * */
        getSelectPaymentTypes({commit}, payload = {}) {
            return paymentTypeService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set PaymentType
         * */
        setPaymentType({commit}, payload) {
            if (payload.id)
                return paymentTypeService.put(payload.id, payload);
            return paymentTypeService.post(null, payload);
        },
        /*
         * Action PaymentType
         * */
        actionPaymentType({commit}, payload) {
            return paymentTypeService.post('action', payload);
        },
        /*
         * Delete PaymentType
         * */
        deletePaymentType({commit}, payload) {
            return paymentTypeService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default PaymentTypeStore;
