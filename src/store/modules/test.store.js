import CustomStore from "devextreme/data/custom_store";
import testService from "../../services/test.service";

const TestStore = {
    namespaced: true,

    /* State */
    state: {
        vacancie: {},
        vacancies: [] // bunun içinə yığır
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.vacancie = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.vacancies = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Vacancies
         * */
        getVacancies({ commit }, payload = null) {


            const data = new CustomStore({
                load: function(loadOptions) {
                    return testService.get(null, { datatable: true, ...loadOptions, ...payload })
                        .then(r => {
                            const data = r.data.response;
                            return {
                                data: data.test,
                                totalCount: data.total
                            }
                        })
                }
            })

            commit('SET_LIST', data); // birdə bura var
        },
        /*
         * Get Blog
         * */
        getVacancie({ commit }, payload) {
            return testService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Blogs
         * */
        getSelectVacancies({ commit }, payload = {}) {
            return testService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Blog
         * */
        // setVacancie({ commit }, payload) { // burdakı commitlər işlədilmir hərdəfə buna görə xəta alıram neyniyim?
        //     if (payload.id)
        //         return vacanciesService.put(payload.id, payload);
        //     return vacanciesService.post(null, payload);
        // },
        // /*
        //  * Action Blog
        //  * */
        // actionVacancie({ commit }, payload) {
        //     return vacanciesService.post('action', payload);
        // },
        // /*
        //  * Delete Blog
        //  * */
        // deleteVacancie({ commit }, payload) {
        //     return vacanciesService.delete(payload);
        // }
    },

    /* Getters */
    getters: {}
}

export default TestStore;