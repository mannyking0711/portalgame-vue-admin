import CustomStore from "devextreme/data/custom_store";
import saleService from "../../services/sale.service";

const SaleStore = {
    namespaced: true,

    /* State */
    state: {
        sale: {},
        sales: [],
        reports: {},
        reportsAll: {},
        dayZero: false
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.sale = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.sales = payload;
        },
        /*
         * SET REPORT
         * */
        SET_REPORT(state, payload) {
            state.reports = payload;
        },
        /*
         * SET REPORT ALL
         * */
        SET_REPORT_ALL(state, payload) {
            state.reportsAll = payload;
        },
        SET_DAY_ZERO(state, payload){
            state.dayZero = payload
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Sales
         * */
        getSales({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return saleService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Set Sale Finished
         * */
        updateSale({commit}, payload) {
            return saleService.post('update', payload);
        },
        /*
         * Get Sale
         * */
        getSale({commit}, payload) {
            return saleService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Reports
         * */
        getReports({commit}, payload) {
            return saleService.post('report', payload)
            .then(r => {
                commit('SET_REPORT', r.data.response);
            })
        },
        /*
         * Get All Reports
         * */
        getAllReports({commit}, payload) {
            return saleService.post('report-all', payload)
            .then(r => {
                commit('SET_REPORT_ALL', r.data.response);
            })
        },
        /*
         * Get Select Sales
         * */
        getSelectSales({commit}, payload = {}) {
            return saleService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Sale
         * */
        setSale({commit}, payload) {
            if (payload.id)
                return saleService.put(payload.id, payload);
            return saleService.post(null, payload);
        },
        /*
         * Set Sale Finished
         * */
        setSaleFinished({commit}, payload) {
            return saleService.post('finished', payload);
        },
        /*
         * Sale FinishedDay
         * */
        saleFinishedDay({commit}, payload) {
            return saleService.post('finished-day', payload);
        },
        /*
         * Delete Sale
         * */
        deleteSale({commit}, payload) {
            return saleService.delete(payload);
        },
        setDayZero(){
            return saleService.post('set-zero');
        },
        isDayZero({ commit }, payload){
            return saleService.post('is-zero')
            .then(r => {
                commit('SET_DAY_ZERO', r.data.response[0]);
            });
        }
    },

    /* Getters */
    getters: {}
}

export default SaleStore;
