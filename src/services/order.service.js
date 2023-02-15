import baseService from "./_base.service";

class OrderService extends baseService {
    constructor() {
        super('crud/order');
    }
}

export default new OrderService();
