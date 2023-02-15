import baseService from "./_base.service";

class GameService extends baseService {
    constructor() {
        super('crud/game');
    }
}

export default new GameService();
