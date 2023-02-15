import baseService from "./_base.service";

class EmployeeTypeService extends baseService {
    constructor() {
        super('crud/employee-type');
    }
}

export default new EmployeeTypeService();
