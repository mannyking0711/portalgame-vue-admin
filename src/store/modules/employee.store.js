import CustomStore from "devextreme/data/custom_store";
import employeeService from "../../services/employee.service";

const EmployeeStore = {
    namespaced: true,

    /* State */
    state: {
        employee: {},
        employees: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.employee = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.employees = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Employees
         * */
        getEmployees({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return employeeService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Employee
         * */
        getEmployee({commit}, payload) {
            return employeeService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        getDeletedEmployees({commit}, payload) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return employeeService.get('', {deleted_rows: true, ...loadOptions, ...payload,})
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
         * Get Select Employees
         * */
        getSelectEmployees({commit}, payload = {}) {
            return employeeService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Employee
         * */
        setEmployee({commit}, payload) {
            if (payload.id)
                return employeeService.put(payload.id, payload);
            return employeeService.post(null, payload);
        },
        /*
         * Action Employee
         * */
        actionEmployee({commit}, payload) {
            return employeeService.post('action', payload);
        },
        /*
         * Delete Employee
         * */
        deleteEmployee({commit}, payload) {
            return employeeService.delete(payload);
        },

        delEmp({commit}, payload) {
            return employeeService.post('delete', payload);
        }
    },

    /* Getters */
    getters: {}
}

export default EmployeeStore;
