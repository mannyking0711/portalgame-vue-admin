import baseService from "./_base.service";

class GameLevelService extends baseService {
    constructor() {
        super('crud/game-level');
    }
}

export default new GameLevelService();
