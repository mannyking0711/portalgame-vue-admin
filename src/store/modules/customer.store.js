import CustomStore from "devextreme/data/custom_store";
import customerService from "../../services/customer.service";

const CustomerStore = {
    namespaced: true,

    /* State */
    state: {
        customer: {},
        customers: [],
        customer_info: {},
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.customer = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.customers = payload;
        },
        /*
         * SET INFO
         * */
        SET_INFO(state, payload) {
            state.customer_info = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Customers
         * */
        getCustomers({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return customerService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Customer
         * */
        getCustomer({commit}, payload) {
            return customerService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Customers
         * */
        getSelectCustomers({commit}, payload = {}) {
            return customerService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Get Customer Info
         * */
        getCustomerInfo({commit}, payload = {}) {
            return customerService.post('info', payload)
            .then(r => {
                return r.data.response;
            })
        },
        /*
         * Set Customer
         * */
        setCustomer({commit}, payload) {
            if (payload.id)
                return customerService.put(payload.id, payload);
            return customerService.post(null, payload);
        },
        /*
         * Action Customer
         * */
        actionCustomer({commit}, payload) {
            return customerService.post('action', payload);
        },
        /*
         * Delete Customer
         * */
        deleteCustomer({commit}, payload) {
            return customerService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default CustomerStore;
