import CustomStore from "devextreme/data/custom_store";
import productsService from "../../services/products.service";

const ProductsStore = {
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
                    return productsService.get(null, { datatable: true, ...loadOptions, ...payload })
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
            return productsService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectProducts({ commit }, payload = {}) {
            return productsService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setProduct({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return productsService.put(payload.id, payload);
            return productsService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionProduct({ commit }, payload) {
            return productsService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteProduct({ commit }, payload) {
            return productsService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default ProductsStore;