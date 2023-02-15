import baseService from "./_base.service";

class BQCategoriesService extends baseService {
    constructor() {
        super('crud/bq-categories');
    }
}

export default new BQCategoriesService();