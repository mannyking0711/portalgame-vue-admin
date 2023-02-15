<template>
    <page>
        <page-head :title="pageTitle">
            <div class="space-x-2 flex">
                
                <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
                </app-button>
            </div>
        </page-head>

        <page-body>
            <data-grid
                :data-source="staffs"
                :row-prepared="rowPrepared"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list" :row="this">
                    
                    <app-button
                        v-if="can(permission + '.send')"
                        :sm="true"
                        @click="action(list.row, 'send')"
                        :title="!list.row.action.send ? 'işçi göndər' : 'İşçi göndərildi'"
                        :icon="!list.row.action.send ? 'icon-send1' : 'icon-check3'"
                        
                        :property="!list.row.action.send ? 'warning' : 'success'"
                    />

                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row.form)"
                        :sm="true"
                        :title="translate('button.Edit')"
                        icon="icon-edit-2"
                        property="primary"
                    />
                    
                    <app-button
                        v-if="can(permission + '.delete')"
                        :sm="true"
                        @click="remove(list.row.id)"
                        :title="translate('button.Delete')"
                        icon="icon-trash-2"
                        property="danger"
                    />

                    

                    <div slot="staffTemplate" slot-scope="list">
                        <div class="bg-green" style="background:green;">{{ list }}</div>
                    </div>
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
                        </form-group>

                        <form-group
                            :label="'İş vaxtı'"
                            name="employee_type_id"
                        >
                            <form-tree-select :options="shifts" v-model="form.shift"/>
                        </form-group>

                        <form-group :label="'İşçi sayı'" name="count">
                            <input type="text" :value.prop="form.count" v-model="form.count" class="form-element">
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
import { exit } from 'process';
import {mapActions, mapState} from 'vuex';

const modalId = 'createModal';
const translateKey = 'crm.Employee';

export default {
    name: "StaffIndex",
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
            pageTitle: 'Filiallarda açıq vakansiyalar',
            modelShow: false,
            columns: [
                {
                    caption: translateKey + '.Label.Department',
                    dataField: 'department.name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İşçi növü',
                    dataField: 'employee_type.name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İşçi sayı',
                    dataField: 'count',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İş saatı',
                    dataField: 'shift',
                    show: true,
                    allowFiltering: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('StaffStore', ['staffs']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('EmployeeTypeStore', ['employeeTypes']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('StaffStore', ['getStaffs', 'setStaff', 'actionStaff', 'deleteStaff', 'getDeletedStaff']),
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
        userPermission(){
            return this.user.permission.id;
        },
        
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                department_id: item.department_id || this.user.department.id,
                employee_type_id: item.employee_type_id || null,
                shift: item.shift || null,
                count: item.count || null,
            }
            this.form = form;
            this.modelShow = true;
        },
        /*
         * Delete Form
         * */
        //  DeleteFormCreate(item) {
        //     const form = {
        //         id: item.id,
        //         left_reason: null,
        //     };
        //     this.form = form;
        //     this.modelShow = true;
        // },

        /*
         * Delete modal
         * */
        // deleteModal(item) {
        //     this.modal('deleteModal')
        //     this.modelShow = false;
        //     this.resetError();
        //     this.DeleteFormCreate(item);
        // },

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
            console.log(id);
            exit;
            this.alert().then(r => this.deleteStaff(id).then(r => this.getStaffs()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionStaff({id: item.id, type, action}).then(r => this.getStaffs())
        },
        /*
         * Save
         * */
        save() {
            this.setStaff(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getStaffs();
                }
            })
        },
        // del(){
        //     this.delEmp(this.form)
        //     .then(r => {
        //         if (r) {
        //             this.modal('deleteModal');
        //             this.getStaffs();
        //         }
        //     })
        // },
        
    },
    created() {
        this.getStaffs()
        console.log(this.staffs);
    }
}
</script>

<style scoped>

</style>
