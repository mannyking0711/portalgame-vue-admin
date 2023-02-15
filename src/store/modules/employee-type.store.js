import CustomStore from "devextreme/data/custom_store";
import employeeTypeService from "../../services/employeeType.service";

const EmployeeTypeStore = {
    namespaced: true,

    /* State */
    state: {
        employeeType: {},
        employeeTypes: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.employeeType = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.employeeTypes = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get EmployeeTypes
         * */
        getEmployeeTypes({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return employeeTypeService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get EmployeeType
         * */
        getEmployeeType({commit}, payload) {
            return employeeTypeService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select EmployeeTypes
         * */
        getSelectEmployeeTypes({commit}, payload = {}) {
            return employeeTypeService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set EmployeeType
         * */
        setEmployeeType({commit}, payload) {
            if (payload.id)
                return employeeTypeService.put(payload.id, payload);
            return employeeTypeService.post(null, payload);
        },
        /*
         * Action EmployeeType
         * */
        actionEmployeeType({commit}, payload) {
            return employeeTypeService.post('action', payload);
        },
        /*
         * Delete EmployeeType
         * */
        deleteEmployeeType({commit}, payload) {
            return employeeTypeService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default EmployeeTypeStore;
