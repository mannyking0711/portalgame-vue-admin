import baseService from "./_base.service";

class StaffService extends baseService {
    constructor() {
        super('crud/staff');
    }
}

export default new StaffService();
