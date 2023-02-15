import baseService from "./_base.service";

class CostsService extends baseService {
    constructor() {
        super('crud/costs');
    }
}

export default new CostsService();