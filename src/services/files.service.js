import baseService from "./_base.service";

class FilesService extends baseService {
    constructor() {
        super('crud/files');
    }
}

export default new FilesService();