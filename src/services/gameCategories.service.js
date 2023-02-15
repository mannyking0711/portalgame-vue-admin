import baseService from "./_base.service";

class GameCategoriesService extends baseService {
    constructor() {
        super('crud/game-categories');
    }
}

export default new GameCategoriesService();