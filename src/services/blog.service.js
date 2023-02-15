import baseService from "./_base.service";

class BlogService extends baseService {
    constructor() {
        super('crud/blog');
    }
}

export default new BlogService();