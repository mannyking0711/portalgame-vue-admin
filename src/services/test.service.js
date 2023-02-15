import baseService from "./_base.service";

class TestService extends baseService {
    constructor() {
        super('crud/test');
    }
}

export default new TestService();