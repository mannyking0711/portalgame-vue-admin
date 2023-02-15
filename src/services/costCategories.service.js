import baseService from "./_base.service";

class CostCategoriesService extends baseService {
    constructor() {
        super('crud/cost-categories');
    }
}

export default new CostCategoriesService();