// import axios from "axios";
import CustomStore from "devextreme/data/custom_store";
import analyticsService from "../../services/analytics.service";

const AnalyticsStore = {
    namespaced: true,

    /* State */
    state: {
        totalUsers: null,
        analytic: {},
        analytics: [],
        visitors: [],
        sevenDay: [],
        all: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.analytic = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.analytics = payload;
        },
        /*
         * SET USERS
         * */
        SET_TOTAL(state, payload) {
            state.totalUsers = payload;
        },
        SET_SEVENDAY(state, payload){
            state.sevenDay = payload;
        },
        SET_VISITORS(state, payload){
            state.visitors = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Blogs
         * */
        getAnalytics({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return analyticsService.get(null, { datatable: true, ...loadOptions, ...payload })
                        .then(r => {
                            const data = r.data.response;
                            return {
                                data: data.data
                            }
                        })
                }
            })
            commit('SET_LIST', data);
        },
        
        /*
         * Get Select Blogs
         * */
        getUsers({ commit }, payload = {}) {
            return analyticsService.post('active-users', payload)
                .then(r => {
                    commit('SET_TOTAL', r.data.response);
                })
        },
        /*
         * Get last Seven Day
         * */
        getSevenDay({ commit }, payload = {}) {
            return analyticsService.post('seven-day', payload)
                .then(r => {
                    commit('SET_SEVENDAY', r.data.response);
                })
        },

        /*
         * Get Visitors
         * */
        getVisitors({ commit }, payload = {}) {
            return analyticsService.post('visitors', payload)
                .then(r => {
                    commit('SET_VISITORS', r.data.response);
                })
        },

        /*
         * Get Visitors
         * */
        setFilter({ commit }, payload = {}) {
            return analyticsService.post('filter', payload)
        },

        /*
         * Get Visitors
         * */
        getAll({ commit }, payload = {}) {
            return analyticsService.post('all', payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                    // console.log(analytics);   
                })
            
        },

    },

    /* Getters */
    getters: {}
}

export default AnalyticsStore;