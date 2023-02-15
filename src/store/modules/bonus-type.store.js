import CustomStore from "devextreme/data/custom_store";
import bonusTypeService from "../../services/bonus-type.service";

const BonusTypeStore = {
    namespaced: true,

    /* State */
    state: {
        bonusType: {},
        bonusTypes: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.bonusType = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.bonusTypes = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get GameLanguages
         * */
        getBonusTypes({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return bonusTypeService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get GameLanguage
         * */
        getBonusType({ commit }, payload) {
            return bonusTypeService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select GameLanguages
         * */
        getSelectBonusTypes({ commit }, payload = {}) {
            return bonusTypeService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set GameLanguage
         * */
        setBonusType({ commit }, payload) {
            if (payload.id)
                return bonusTypeService.put(payload.id, payload);
            return bonusTypeService.post(null, payload);
        },
        /*
         * Action GameLanguage
         * */
        actionBonusType({ commit }, payload) {
            return bonusTypeService.post('action', payload);
        },
        /*
         * Delete GameLanguage
         * */
        deleteBonusType({ commit }, payload) {
            return bonusTypeService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default BonusTypeStore;