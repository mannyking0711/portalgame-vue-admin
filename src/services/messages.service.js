import baseService from "./_base.service";

class messagesService extends baseService {
    constructor() {
        super('crud/chat');
    }
}

export default new messagesService();
