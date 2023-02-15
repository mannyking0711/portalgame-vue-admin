import baseService from "./_base.service";

class PaymentTypeService extends baseService {
    constructor() {
        super('crud/payment-type');
    }
}

export default new PaymentTypeService();
