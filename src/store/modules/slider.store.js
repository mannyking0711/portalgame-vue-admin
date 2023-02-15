import CustomStore from "devextreme/data/custom_store";
import sliderService from "../../services/slider.service";

const SliderStore = {
    namespaced: true,

    /* State */
    state: {
        slider: {},
        sliders: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.slider = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.sliders = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Sliders
         * */
        getSliders({commit}, payload = null) {
            const data = new CustomStore({
                load: function (loadOptions) {
                    return sliderService.get(null, {datatable: true, ...loadOptions, ...payload})
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
         * Get Slider
         * */
        getSlider({commit}, payload) {
            return sliderService.get(payload)
            .then(r => {
                commit('SET_DATA', r.data.response);
            })
        },
        /*
         * Get Select Sliders
         * */
        getSelectSliders({commit}, payload = {}) {
            return sliderService.get(null, payload)
            .then(r => {
                commit('SET_LIST', r.data.response);
            })
        },
        /*
         * Set Slider
         * */
        setSlider({commit}, payload) {
            if (payload.id)
                return sliderService.put(payload.id, payload);
            return sliderService.post(null, payload);
        },
        /*
         * Action Slider
         * */
        actionSlider({commit}, payload) {
            return sliderService.post('action', payload);
        },
        /*
         * Delete Slider
         * */
        deleteSlider({commit}, payload) {
            return sliderService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default SliderStore;
