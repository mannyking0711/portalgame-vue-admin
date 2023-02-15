import baseService from "./_base.service";

class ProductsCategoryService extends baseService {
    constructor() {
        super('crud/products-category');
    }
}

export default new ProductsCategoryService();