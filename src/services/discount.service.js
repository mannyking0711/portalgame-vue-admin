import baseService from "./_base.service";

class DiscountService extends baseService {
    constructor() {
        super('crud/discount');
    }
}

export default new DiscountService();
