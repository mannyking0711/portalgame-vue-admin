import baseService from "./_base.service";

class VacanciesService extends baseService {
    constructor() {
        super('crud/vacancies');
    }
}

export default new VacanciesService();