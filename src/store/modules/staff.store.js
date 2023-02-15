import CustomStore from "devextreme/data/custom_store";
import staffService from "../../services/staff.service";

const StaffStore = {
    namespaced: true,

    /* State */
    state: {
        staff: {},
        staffs: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.staff = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.staffs = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Staffs
         * */
        getStaffs({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return staffService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Staff
         * */
        getStaff({commit}, payload) {
            return staffService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        getDeletedStaffs({commit}, payload) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return staffService.get('', {deleted_rows: true, ...loadOptions, ...payload,})
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
         * Get Select Staffs
         * */
        getSelectStaffs({commit}, payload = {}) {
            return staffService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Staff
         * */
        setStaff({commit}, payload) {
            if (payload.id)
                return staffService.put(payload.id, payload);
            return staffService.post(null, payload);
        },
        /*
         * Action Staff
         * */
        actionStaff({commit}, payload) {
            return staffService.post('action', payload);
        },
        /*
         * Delete Staff
         * */
        deleteStaff({commit}, payload) {
            return staffService.delete(payload);
        },

        delEmp({commit}, payload) {
            return staffService.post('delete', payload);
        }
    },

    /* Getters */
    getters: {}
}

export default StaffStore;
