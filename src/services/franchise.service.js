import baseService from "./_base.service";

class FranchiseService extends baseService {
    constructor() {
        super('crud/franchise');
    }
}

export default new FranchiseService();