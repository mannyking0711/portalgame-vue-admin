import baseService from "./_base.service";

class GameStatusService extends baseService {
    constructor() {
        super('crud/squid-game');
    }
}

export default new GameStatusService();
