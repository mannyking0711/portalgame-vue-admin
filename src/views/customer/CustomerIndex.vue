<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="customers"
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

                    <app-button
                        v-if="can(permission + '.action')"
                        :route="{name: 'customer_info', params: {id: list.row.id}}"
                        :sm="true"
                        :title="translate('button.Info')"
                        icon="icon-info"
                        property="success"
                    />

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

        <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <form-group
                            :label="translate(translateKey + '.Label.Email')"
                            name="email"
                        >
                            <form-text v-model="form.email"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.Fullname')"
                            name="fullname"
                        >
                            <form-text v-model="form.fullname"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.Phone')"
                            name="phone"
                        >
                            <form-number v-phone v-model="form.phone" placeholder="99450 XXX XX XX"/>
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
const translateKey = 'crm.Customer';

export default {
    name: "CustomerIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: translateKey + '.Label.Fullname',
                    dataField: 'fullname',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Email',
                    dataField: 'email',
                    show: true,
                },
                {
                    caption: translateKey + '.Label.Phone',
                    dataField: 'phone',
                    show: true,
                },
                {
                    caption: translateKey + '.Label.GameCount',
                    dataField: 'game_count',
                    show: true,
                    allowFiltering: false
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('CustomerStore', ['customers']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('CustomerStore', ['getCustomers', 'setCustomer', 'actionCustomer', 'deleteCustomer']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                email: item.email || null,
                fullname: item.fullname || null,
                phone: item.phone || null,
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
            this.alert().then(r => this.deleteCustomer(id).then(r => this.getCustomers()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionCustomer({id: item.id, type, action}).then(r => this.getCustomers())
        },
        /*
         * Save
         * */
        save() {
            this.setCustomer(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCustomers();
                }
            })
        }
    },
    created() {
        this.getCustomers();
    }
}
</script>

<style scoped>

</style>
