import baseService from "./_base.service";

class CustomerService extends baseService {
    constructor() {
        super('crud/customer');
    }
}

export default new CustomerService();
