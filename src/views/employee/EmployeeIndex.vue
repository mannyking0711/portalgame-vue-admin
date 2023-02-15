<template>
    <page>
        <page-head :title="pageTitle">
            <div class="space-x-2 flex">
                
                
                <app-button v-if="this.user.permission.id !== 6 && this.user.permission.id !== 3 && this.user.permission.id !== 5" @click="filter('deleted')" style="background: #ffecec; border: 1px solid #edd3d3">
                    {{ translate('Çıxmış İşçilər') }}
                </app-button>
                
                <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
                </app-button>
            </div>
            
            
        </page-head>

        <page-body>
            <data-grid
                :data-source="employees"
                :row-prepared="rowPrepared"
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
                        v-if="can(permission + '.delete') && deleted_table !== 'deleted'"
                        :sm="true"
                        @click="deleteModal(list.row.form)"
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

                        <div v-if="this.user.department.id == null">
                            <form-group
                                :label="translate(translateKey + '.Label.Department')"
                                name="department_id"
                            >
                                <form-tree-select :options="select_departments" v-model="form.department_id"/>
                            </form-group>
                        </div>

                        <form-group
                            :label="translate(translateKey + '.Label.EmployeeType')"
                            name="employee_type_id"
                        >
                            <form-tree-select :options="employeeTypes" v-model="form.employee_type_id"/>
                            <!-- <form-tree-select :options="employeeTypes" displayExpr="name" :multiple="true" v-model="form.employee_type_id"/> -->
                        </form-group>

                        <form-group
                            :label="translate('Ad')"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>

                        <form-group
                            :label="translate('Soyad')"
                            name="surname"
                        >
                            <form-text v-model="form.surname"/>
                        </form-group>

                        <form-group
                            :label="translate('Ata adı')"
                            name="father"
                        >
                            <form-text v-model="form.father"/>
                        </form-group>

                        <form-group
                            :label="translate(translateKey + '.Label.Phone')"
                            name="phone"
                        >
                            <form-number v-model="form.phone"/>
                        </form-group>
                        
                        <form-group
                            :label="translate('İş vaxtı')"
                            name="day_of_shift"
                        >
                            <form-tree-select :options="shifts" v-model="form.day_of_shift"/>
                        </form-group>

                        <form-group :label="'Doğum tarixi'" name="birth_date">
                            <input type="date" :value.prop="form.birth_date" v-model="form.birth_date" class="form-element">
                        </form-group>

                        <form-group :label="'İşə Qəbul tarixi'" name="accept_date">
                            <input type="date" :value.prop="form.accept_date" v-model="form.accept_date" class="form-element">
                        </form-group>    

                        <form-group v-if="form.left_reason !== null"
                            :label="translate('İşdən ayrılma səbəbi')"
                            name="left_reason"
                        >
                            <form-text-area style="min-height: 130px" v-model="form.left_reason"/>
                        </form-group>

                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>

        <modal :id="'deleteModal'" size="xs">
            <modal-head>
                <modal-title>{{ 'İşdən azad olma məlumatları' }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="del">
                    <grid>
                        
                        <form-group
                            :label="translate('İşdən ayrılma səbəbi')"
                            name="left_reason"
                        >
                            <form-text-area style="min-height: 130px" v-model="form.left_reason"/>
                        </form-group>


                        <app-button class="justify-center" style=" background-color: rgb(121, 177, 185); color: white;" type="submit">
                            <i class="icon-check mr-2"></i> {{ translate(' Təstiqlə') }}
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
const translateKey = 'crm.Employee';

export default {
    name: "EmployeeIndex",
    data() {
        return {
            translateKey,
            modalId,
            shifts: [
                {id: '12:00-18:00', name: '12:00-18:00'},
                {id: '18:00-23:30', name: '18:00-23:30'},
                {id: '12:00-23:30', name: '12:00-23:30'}
            ],
            deleted_table: null,
            pageTitle: null,
            modelShow: false,
            columns: [
                {
                    caption: 'Ad Soyad Ata adı',
                    dataField: 'fullname',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Department',
                    dataField: 'department.name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: translateKey + '.Label.EmployeeType',
                    dataField: 'employee_type.name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: translateKey + '.Label.Phone',
                    dataField: 'phone',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İşə qəbul tarixi',
                    dataField: 'accept_date',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İş vaxtı',
                    dataField: 'day_of_shift',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'Doğum tarixi',
                    dataField: 'birth_date',
                    show: true,
                    allowFiltering: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('EmployeeStore', ['employees']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('EmployeeTypeStore', ['employeeTypes']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('EmployeeStore', ['getEmployees', 'setEmployee', 'actionEmployee', 'deleteEmployee', 'delEmp', 'getDeletedEmployees']),
        ...mapActions('DepartmentStore', ['getSelectAllDepartments']),
        ...mapActions('EmployeeTypeStore', ['getSelectEmployeeTypes']),
        
        /*
         * Row Prepared
         * */
         rowPrepared(e) {
            if (e.data?.deleted_table === 'deleted') {
                e.rowElement.style.backgroundColor = '#ffecec';
            }
        },
        /*
         * Create Page Title
         * */
         createPageTitle() {
            let title = this.translate('Işçilər')
            if (this.deleted_table === 'deleted') {
                title += ' (' + this.translate('Çıxmış işçilər') + ')';
            }
            this.pageTitle = title;
        },
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                department_id: item.department_id || this.user.department.id,
                employee_type_id: item.employee_type_id || null,
                name: item.name || null,
                surname: item.surname || null,
                father: item.father || null,
                phone: item.phone || null,
                left_reason: item.left_reason || null,
                birth_date: item.birth_date || null,
                accept_date: item.accept_date || null,
                day_of_shift: item.day_of_shift || null
            }
            this.form = form;
            this.modelShow = true;
        },
        /*
         * Delete Form
         * */
         DeleteFormCreate(item) {
            const form = {
                id: item.id,
                left_reason: null,
            };
            this.form = form;
            this.modelShow = true;
        },

        /*
         * Delete modal
         * */
         deleteModal(item) {
            this.modal('deleteModal')
            this.modelShow = false;
            this.resetError();
            this.DeleteFormCreate(item);
        },

        /*
         * Create Modal
         * */
        createModal(item = {}) {
            this.modal(this.modalId)
            this.modelShow = false;
            this.resetError();
            this.getSelectEmployeeTypes();
            this.getSelectAllDepartments();
            this.formCreate(item);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteEmployee(id).then(r => this.getEmployees()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionEmployee({id: item.id, type, action}).then(r => this.getEmployees())
        },
        /*
         * Save
         * */
        save() {
            this.setEmployee(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getEmployees();
                }
            })
        },
        del(){
            this.delEmp(this.form)
            .then(r => {
                if (r) {
                    this.modal('deleteModal');
                    this.getEmployees();
                }
            })
        },
        /*
         * Filter
         * */
         filter(deleted_table = null) {
            if (deleted_table == 'deleted')
                this.getDeletedEmployees()
            else
                this.getEmployees()
            this.deleted_table = deleted_table;
            this.createPageTitle();
        }
    },
    created() {
        this.createPageTitle();
        this.getEmployees();
    }
}
</script>

<style scoped>

</style>
