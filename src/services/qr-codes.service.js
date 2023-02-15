import baseService from "./_base.service";

class qrService extends baseService {
    constructor() {
        super('crud/qr-codes');
    }
}

export default new qrService();
