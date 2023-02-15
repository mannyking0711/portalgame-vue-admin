import baseService from "./_base.service";

class DiscountTypeService extends baseService {
    constructor() {
        super('crud/discount-types');
    }
}

export default new DiscountTypeService();
