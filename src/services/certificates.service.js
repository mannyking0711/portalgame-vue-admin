import baseService from "./_base.service";

class certificatesService extends baseService {
    constructor() {
        super('crud/certificates');
    }
}

export default new certificatesService();