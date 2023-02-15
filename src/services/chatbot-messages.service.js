import baseService from "./_base.service";

class BotMessageService extends baseService {
    constructor() {
        super('crud/bot-messages');
    }
}

export default new BotMessageService();
