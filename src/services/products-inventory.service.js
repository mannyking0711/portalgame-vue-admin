import baseService from "./_base.service";

class ProductsInventoryService extends baseService {
    constructor() {
        super('crud/products-inventory');
    }
}

export default new ProductsInventoryService();