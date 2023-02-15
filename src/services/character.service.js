import baseService from "./_base.service";

class CharacterService extends baseService {
    constructor() {
        super('crud/squid-characters');
    }
}

export default new CharacterService();