import CustomStore from "devextreme/data/custom_store";
import usedCertificateService from "../../services/used-certificates.service";

const UsedCertificatesStore = {
    namespaced: true,

    /* State */
    state: {
        certificate: {},
        certificates: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.certificate = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.certificates = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get certificates
         * */
        getCertificates({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return usedCertificateService.get(null, { datatable: true, ...loadOptions })
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
         * Get Certificate
         * */
        getCertificate({ commit }, payload) {
            usedCertificateService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Certificates
         * */
        getSelectCertificates({ commit }, payload = {}) {
            return usedCertificateService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response.original.response);
                })
        },
        /*
         * Set User
         * */
        setCertificate({ commit }, payload) {
            if (payload.id)
                return usedCertificateService.put(payload.id, payload);
            return usedCertificateService.post(null, payload);
        },
        /*
         * Action Certificate
         * */
        actionCertificate({ commit }, payload) {
            return usedCertificateService.post('action', payload);
        },
        /*
         * Delete Certificate
         * */
        deleteCertificate({ commit }, payload) {
            return usedCertificateService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default UsedCertificatesStore;