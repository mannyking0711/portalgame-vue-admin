import baseService from "./_base.service";

class InventoryRoomsService extends baseService {
    constructor() {
        super('crud/inventory-rooms');
    }
}

export default new InventoryRoomsService();