import baseService from "./_base.service";

class HolidayService extends baseService {
    constructor() {
        super('crud/holidays');
    }
}

export default new HolidayService();
