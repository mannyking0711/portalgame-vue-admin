import baseService from "./_base.service";

class SaleService extends baseService {
    constructor() {
        super('crud/sale');
    }
}

export default new SaleService();
