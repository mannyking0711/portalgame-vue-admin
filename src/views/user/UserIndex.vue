<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="users"
                :columns="columns"
                :action-column-width="150"
                :action-column-text="translate(translateKey + '.Table.Action')"
            >
                <div slot="statusTemplate" slot-scope="list">
                    <badge property="success" v-if="list.row.action.active">{{ translate(translateKey + '.Table.StatusActive') }}</badge>
                    <badge property="danger" v-else>{{ translate(translateKey + '.Table.StatusDeActive') }}</badge>
                </div>
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update') && list.row.id !== 1"
                        @click="createModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />

                    <app-button
                        v-if="can(permission + '.action') && list.row.id !== 1"
                        :sm="true"
                        @click="action(list.row, 'active')"
                        :title="list.row.action.active ? translate('button.DeActivate') : translate('button.Activate')"
                        :icon="!list.row.action.active ? 'icon-eye-off' : 'icon-eye'"
                        property="success"
                    />

                    <app-button
                        v-if="can(permission + '.action') && list.row.id !== 1"
                        :sm="true"
                        @click="action(list.row, 'block')"
                        :title="list.row.action.block ? translate('button.UserUnBlock') : translate('button.UserBlock')"
                        :icon="!list.row.action.block ? 'icon-unlock2' : 'icon-lock3'"
                        property="gray"
                    />

                    <app-button
                        v-if="can(permission + '.delete') && list.row.id !== 1"
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
            <modal-body>
                <form @submit.prevent="save">
                    <grid>
                        <form-group :label="translateKey + '.Label.Email'" name="email">
                            <form-text v-model="form.email"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Password'" name="password">
                            <form-text v-model="form.password"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Name'" name="name">
                            <form-text v-model="form.name"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Surname'" name="surname">
                            <form-text v-model="form.surname"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Tel'" name="tel">
                            <form-text v-model="form.phone_number"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Department'" name="permission">
                            <form-tree-select v-model="form.department_id" :options="select_departments"/>
                        </form-group>

                        <form-group :label="translateKey + '.Label.Permission'" name="permission">
                            <form-tree-select v-model="form.permission_id" :options="permissionsOp"/>
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

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        email: item.email || null,
        phone_number: item.phone_number || null,
        password: null,
        permission_id: item.permission_id || null,
        department_id: item.department_id || null,
        name: item.name || null,
        surname: item.surname || null,
    }
}

const modalId = 'createModal';
const translateKey = 'crm.User';

export default {
    name: "UserIndex",
    data() {
        return {
            translateKey,
            modalId,
            permission: 'user',
            columns: [
                {
                    caption: translateKey + '.Table.FullName',
                    dataField: 'fullname',
                    show: true
                },
                {
                    caption: translateKey + '.Table.Email',
                    dataField: 'email',
                    show: true
                },
                {
                    caption: translateKey + '.Table.Tel',
                    dataField: 'phone_number',
                    show: true
                },
                {
                    caption: translateKey + '.Table.Permission',
                    dataField: 'permission.name',
                    show: true,
                },
                {
                    caption: translateKey + '.Table.Provider',
                    dataField: 'provider',
                    show: true,
                },
                {
                    caption: translateKey + '.Table.Status',
                    dataField: 'status',
                    slot: 'statusTemplate',
                    show: true,
                    width: 150,
                    alignment: 'center'
                },
                {
                    caption: 'Qeydiyyat Tarixi',
                    dataField: 'created_at',
                    show: true,
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('UserStore', ['users']),
        ...mapState('PermissionStore', ['permissions']),
        ...mapState('DepartmentStore', ['select_departments']),

        permissionsOp(){
            if(this.user.permission.id !== 2){
                return this.permissions.filter(i => parseFloat(i.id) === 1);             
            }else{
                return this.permissions;
            }
        }
    },
    methods: {
        ...mapActions('UserStore', ['getUsers', 'setUser', 'actionUser', 'deleteUser']),
        ...mapActions('PermissionStore', ['getSelectPermissions']),
        ...mapActions('DepartmentStore', ['getSelectDepartments']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const self = this;
            self.form = formObject(item);
        },
        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.resetError();
            this.formCreate(item);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteUser(id).then(r => this.getUsers()))
        },
        /*
        * Action
        * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            if (type === 'block') {
                let text = this.translate('notification.UserBlock.Description');
                if (!action) text = this.translate('notification.UserUnBlock.Description')
                this.alert(text)
                .then(r => this.actionUser({id: item.id, type, action}).then(r => this.getUsers()))
            }
            else {
                this.actionUser({id: item.id, type, action}).then(r => this.getUsers())
            }
        },
        /*
         * Save
         * */
        save() {
            this.setUser(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getUsers();
                }
            })
        }
    },
    created() {
        this.getSelectPermissions();
        this.getSelectDepartments();
        this.getUsers();
    }
}
</script>

<style scoped>

</style>
