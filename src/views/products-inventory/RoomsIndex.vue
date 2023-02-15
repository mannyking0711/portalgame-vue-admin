<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="rooms"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />

                    <!-- <app-button
                        v-if="can(permission + '.action')"
                        :sm="true"
                        @click="action(list.row, 'active')"
                        :title="list.row.action.active ? translate('button.DeActivate') : translate('button.Activate')"
                        :icon="!list.row.action.active ? 'icon-eye-off' : 'icon-eye'"
                        property="success"
                    /> -->

                    <app-button
                        v-if="can(permission + '.delete')"
                        :sm="true"
                        @click="remove(list.row.id)"
                        :title="translate('button.Delete')"
                        icon="icon-trash-2"
                        property="danger"
                    />

                </div>
            </data-grid>
        </page-body>

        <modal :id="modalId" size="md">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>

                        <form-group  
                            :label="'Otaq adı'"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>
                        

                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';

const modalId = 'createModal';
const translateKey = 'crm.InventoryRooms';

export default {
    name: "RoomsIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Otaq adı',
                    dataField: 'name',
                    show: true,
                    allowFiltering: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('InventoryRoomsStore', ['rooms']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('InventoryRoomsStore', ['getInventoryRooms', 'setInventoryRoom', 'actionInventoryRoom', 'deleteInventoryRoom']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                name: item.name || null,
            }
            this.form = form;
            this.modelShow = true;
        },

        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.modelShow = false;
            this.resetError();
            this.formCreate(item);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteInventoryRoom(id).then(r => this.getInventoryRoom()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionInventoryRoom({id: item.id, type, action}).then(r => this.getInventoryRooms())
        },
        /*
         * Save
         * */
        save() {
            this.setInventoryRoom(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getInventoryRooms();
                }
            })
        }
    },
    created() {
        this.getInventoryRooms();
        // console.log(this.rooms);
    }
}
</script>

<style scoped>

</style>
