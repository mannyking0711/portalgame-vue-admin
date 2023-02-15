import baseService from "./_base.service";

class PartnersService extends baseService {
    constructor() {
        super('crud/partners');
    }
}

export default new PartnersService();