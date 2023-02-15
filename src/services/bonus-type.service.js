import baseService from "./_base.service";

class bonusTypeService extends baseService {
    constructor() {
        super('crud/bonus-type');
    }
}

export default new bonusTypeService();