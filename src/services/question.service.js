import baseService from "./_base.service";

class QuestionService extends baseService {
    constructor() {
        super('crud/squid-questions');
    }
}

export default new QuestionService();