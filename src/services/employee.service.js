import baseService from "./_base.service";

class EmployeeService extends baseService {
    constructor() {
        super('crud/employee');
    }
}

export default new EmployeeService();
