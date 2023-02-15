import baseService from "./_base.service";

class PortalShopsService extends baseService {
    constructor() {
        super('crud/portalshops');
    }
}

export default new PortalShopsService();