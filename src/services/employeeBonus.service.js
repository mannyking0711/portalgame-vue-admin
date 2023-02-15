import baseService from "./_base.service";

class EmployeeBonusService extends baseService {
    constructor() {
        super('crud/employee-bonus');
    }
}

export default new EmployeeBonusService();