import baseService from "./_base.service";

class AnalyticsService extends baseService {
    constructor() {
        super('crud/analytics');
    }
}

export default new AnalyticsService();