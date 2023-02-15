import baseService from "./_base.service";

class DirectorInfoService extends baseService {
    constructor() {
        super('crud/director-info');
    }
}

export default new DirectorInfoService();