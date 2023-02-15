import CustomStore from "devextreme/data/custom_store";
import qrService from "../../services/qr-codes.service";

const QrStore = {
    namespaced: true,

    /* State */
    state: {
        rows: [],
        row: null,
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.row = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.rows = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get Qrs
         * */
        getQrs({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return qrService.get(null, { datatable: true, ...loadOptions })
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
         * Get Qr
         * */
        getQr({ commit }, payload) {
            qrService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },

        /*
         * Set Qr
         * */
        setQr({ commit }, payload) {
            if (payload.id)
                return qrService.put(payload.id, payload);
            return qrService.post(null, payload);
        },
        /*
         * Delete Qr
         * */
        deleteQr({ commit }, payload) {
            return qrService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default QrStore;