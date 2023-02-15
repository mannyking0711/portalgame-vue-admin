import CustomStore from "devextreme/data/custom_store";
import HolidayService from "../../services/holiday.service";

const HolidayStore = {
    namespaced: true,

    /* State */
    state: {
        holiday: {},
        holidays: [],
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.holiday = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.holidays = payload;
        },
    },

    /* Actions */
    actions: {
        /*
         * Get Holidays
         * */
        getHolidays({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return HolidayService.get(null, {datatable: true, ...loadOptions})
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
         * Get Translates
         * */
        getTranslates({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return HolidayService.post('translate', '',{datatable: true, ...loadOptions, ...payload})
                    .then(r => {
                        const data = r.data.response;
                        return {
                            data: data.data,
                            totalCount: data.total
                        }
                    })
                }
            })
            commit('SET_TRANSLATES', data);
        },
        /*
         * Get Translate Keys
         * */
        getTranslateKeys({commit}) {
            HolidayService.post('translate-keys')
            .then(r => {
                commit('SET_TRANSLATES_KEYS', r.data.response);
            })
        },
        /*
         * Get Holiday
         * */
        getHoliday({commit}, payload) {
            HolidayService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Holidays
         * */
        getSelectHolidays({commit}, payload = {}) {
            return HolidayService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Holiday
         * */
        setHoliday({commit}, payload) {
            if (payload.id)
                return HolidayService.put(payload.id, payload);
            return HolidayService.post(null, payload);
        },
        /*
         * Set Translate
         * */
        setTranslate({commit}, payload) {
            return HolidayService.post('translate-change', payload);
        },
        /*
         * Action Holiday
         * */
        actionHoliday({commit}, payload) {
            return HolidayService.post('action', payload);
        },
        /*
         * Delete Holiday
         * */
        deleteHoliday({commit}, payload) {
            return HolidayService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default HolidayStore;
