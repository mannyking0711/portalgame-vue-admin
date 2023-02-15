import CustomStore from "devextreme/data/custom_store";
import employeeBonusService from "../../services/employeeBonus.service";

const EmployeeBonusStore = {
    namespaced: true,

    /* State */
    state: {
        employeeBonus: {},
        employeeBonuses: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.employeeBonus = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.employeeBonuses = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get EmployeeBonuses
         * */
        getEmployeeBonuses({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return employeeBonusService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get EmployeeBonus
         * */
        getEmployeeBonus({ commit }, payload) {
            return employeeBonusService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select EmployeeBonuses
         * */
        getSelectEmployeeBonuses({ commit }, payload = {}) {
            return employeeBonusService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set EmployeeBonus
         * */
        setEmployeeBonus({ commit }, payload) {
            if (payload.id)
                return employeeBonusService.put(payload.id, payload);
            return employeeBonusService.post(null, payload);
        },
        /*
         * Action EmployeeBonus
         * */
        actionEmployeeBonus({ commit }, payload) {
            return employeeBonusService.post('action', payload);
        },
        /*
         * Delete EmployeeBonus
         * */
        deleteEmployeeBonus({ commit }, payload) {
            return employeeBonusService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default EmployeeBonusStore;