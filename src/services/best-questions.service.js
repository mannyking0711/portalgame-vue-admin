import baseService from "./_base.service";

class BestQuestionsService extends baseService {
    constructor() {
        super('crud/best-questions');
    }
}

export default new BestQuestionsService();