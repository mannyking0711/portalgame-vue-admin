import baseService from "./_base.service";

class GameStatusService extends baseService {
    constructor() {
        super('crud/game-status');
    }
}

export default new GameStatusService();
