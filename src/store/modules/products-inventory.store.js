import CustomStore from "devextreme/data/custom_store";
import productsInventoryService from "../../services/products-inventory.service";

const ProductsInventoryStore = {
    namespaced: true,

    /* State */
    state: {
        product: {},
        products: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.product = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.products = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Products
         * */
        getProducts({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return productsInventoryService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Blog
         * */
        getProduct({ commit }, payload) {
            return productsInventoryService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectProducts({ commit }, payload = {}) {
            return productsInventoryService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setProduct({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return productsInventoryService.put(payload.id, payload);
            return productsInventoryService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionProduct({ commit }, payload) {
            return productsInventoryService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteProduct({ commit }, payload) {
            return productsInventoryService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default ProductsInventoryStore;