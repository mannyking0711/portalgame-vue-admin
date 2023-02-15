import CustomStore from "devextreme/data/custom_store";
import inventoryRoomsService from "../../services/inventory-rooms.service";

const InventoryRoomsStore = {
    namespaced: true,

    /* State */
    state: {
        room: {},
        rooms: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.room = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.rooms = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Products
         * */
        getInventoryRooms({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return inventoryRoomsService.get(null, { datatable: true, ...loadOptions, ...payload })
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
        getInventoryRoom({ commit }, payload) {
            return inventoryRoomsService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectInventoryRooms({ commit }, payload = {}) {
            return inventoryRoomsService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        setInventoryRoom({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
            if (payload.id)
                return inventoryRoomsService.put(payload.id, payload);
            return inventoryRoomsService.post(null, payload);
        },
        /*
         * Action Blog
         * */
        actionInventoryRoom({ commit }, payload) {
            return inventoryRoomsService.post('action', payload);
        },
        /*
         * Delete Blog
         * */
        deleteInventoryRoom({ commit }, payload) {
            return inventoryRoomsService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default InventoryRoomsStore;