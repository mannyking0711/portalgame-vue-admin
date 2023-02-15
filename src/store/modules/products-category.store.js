import CustomStore from "devextreme/data/custom_store";
import productsCategoryService from "../../services/products-category.service";

const ProductsCategoryStore = {
    namespaced: true,

    /* State */
    state: {
        productcategory: {},
        productscategory: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.productcategory = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.productscategory = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Products
         * */
        getProductsCategory({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return productsCategoryService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getProductCategory({ commit }, payload) {
            return productsCategoryService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectProductsCategory({ commit }, payload = {}) {
            return productsCategoryService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setProductCategory({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return productsCategoryService.put(payload.id, payload);
            return productsCategoryService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionProductCategory({ commit }, payload) {
            return productsCategoryService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteProductCategory({ commit }, payload) {
            return productsCategoryService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default ProductsCategoryStore;