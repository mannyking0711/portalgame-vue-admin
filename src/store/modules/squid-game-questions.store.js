import CustomStore from "devextreme/data/custom_store";
import QuestionService from "../../services/question.service";

const QuestionStore = {
    namespaced: true,

    /* State */
    state: {
        question: {},
        questions: []
    },

    /* Mutation */
    mutations: {
        /*
         * SET DATA
         * */
        SET_DATA(state, payload) {
            state.question = payload;
        },
        /*
         * SET LIST
         * */
        SET_LIST(state, payload) {
            state.questions = payload;
        }
    },

    /* Actions */
    actions: {
        /*
         * Get Questions
         * */
        getQuestions({ commit }, payload = null) {
            const data = new CustomStore({
                load: function(loadOptions) {
                    return QuestionService.get(null, { datatable: true, ...loadOptions, ...payload })
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
         * Get Question
         * */
        getQuestion({ commit }, payload) {
            return QuestionService.get(payload)
                .then(r => {
                    commit('SET_DATA', r.data.response);
                })
        },
        /*
         * Get Select Questions
         * */
        getSelectQuestions({ commit }, payload = {}) {
            return QuestionService.get(null, payload)
                .then(r => {
                    commit('SET_LIST', r.data.response);
                })
        },
        /*
         * Set Question
         * */
        setQuestion({ commit }, payload) {
            if (payload.id)
                return QuestionService.put(payload.id, payload);
            return QuestionService.post(null, payload);
        },
        /*
         * Action Question
         * */
        actionQuestion({ commit }, payload) {
            return QuestionService.post('action', payload);
        },
        /*
         * Delete Question
         * */
        deleteQuestion({ commit }, payload) {
            return QuestionService.delete(payload);
        }
    },

    /* Getters */
    getters: {}
}

export default QuestionStore;