import baseService from "./_base.service";

class commentsService extends baseService {
    constructor() {
        super('crud/comments');
    }
}

export default new commentsService();