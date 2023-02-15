import CustomStore from "devextreme/data/custom_store";
import discountTypesService from "../../services/discountTypes.service";

const DiscountTypesStore = {
    namespaced: true,

    /* State */
    state: {
        discountType: {},
        discountTypes: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.discountType = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.discountTypes = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get DiscountTypes
         * */
        getDiscountTypes({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return discountTypesService.get(null, {datatable: true, ...loadOptions, ...payload})
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
        getDiscountType({commit}, payload) {
            return discountTypesService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Discounts
         * */
        getSelectDiscountTypes({commit}, payload = {}) {
            return discountTypesService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Discount
         * */
        setDiscountType({commit}, payload) {
            if (payload.id)
                return discountTypesService.put(payload.id, payload);
            return discountTypesService.post(null, payload);
        },
        /*
         * Action Discount
         * */
        actionDiscountType({commit}, payload) {
            return discountTypesService.post('action', payload);
        },
        /*
         * Delete Discount
         * */
        deleteDiscountType({commit}, payload) {
            return discountTypesService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default DiscountTypesStore;
