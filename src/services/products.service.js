import baseService from "./_base.service";

class ProductsService extends baseService {
    constructor() {
        super('crud/products');
    }
}

export default new ProductsService();