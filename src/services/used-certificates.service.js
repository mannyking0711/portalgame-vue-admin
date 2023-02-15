import baseService from "./_base.service";

class usedCertificatesService extends baseService {
    constructor() {
        super('crud/used-certificates');
    }
}

export default new usedCertificatesService();