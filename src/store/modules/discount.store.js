import CustomStore from "devextreme/data/custom_store";
import discountService from "../../services/discount.service";

const DiscountStore = {
    namespaced: true,

    /* State */
    state: {
        discount: {},
        discounts: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.discount = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.discounts = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Discounts
         * */
        getDiscounts({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return discountService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Discount
         * */
        getDiscount({commit}, payload) {
            return discountService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Discounts
         * */
        getSelectDiscounts({commit}, payload = {}) {
            return discountService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Discount
         * */
        setDiscount({commit}, payload) {
            if (payload.id)
                return discountService.put(payload.id, payload);
            return discountService.post(null, payload);
        },
        /*
         * Action Discount
         * */
        actionDiscount({commit}, payload) {
            return discountService.post('action', payload);
        },
        /*
         * Delete Discount
         * */
        deleteDiscount({commit}, payload) {
            return discountService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default DiscountStore;
