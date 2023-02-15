import baseService from "./_base.service";

class coinsService extends baseService {
    constructor() {
        super('crud/coins');
    }
}

export default new coinsService();