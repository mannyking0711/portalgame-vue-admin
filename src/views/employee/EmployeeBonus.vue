<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="employeeBonuses"
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

        <modal :id="modalId" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>
                        <form-group
                            :label="translate(translateKey + '.Label.Department')"
                            name="department_id"
                        >
                            <form-tree-select :options="select_departments" v-model="form.department_id"/>
                        </form-group>

                        <form-group
                            :label="'Games'"
                            name="games"
                        >
                            <form-tree-select :options="customGames" :multiple="true" displayExpr="name" v-model="form.games"/>
                        </form-group>


                        <form-group
                            :label="translate(translateKey + '.Label.EmployeeType')"
                            name="employee_type_id"
                        >
                            <form-tree-select :options="employeeTypes" v-model="form.employee_type_id"/>
                            <!-- <form-tree-select :options="employeeTypes" displayExpr="name" :multiple="true" v-model="form.employee_type_id"/> -->
                        </form-group>

                        <form-group
                            :label="'Bonus tipi'"
                            name="bonus_type"
                        >
                            <form-tree-select :options="bonusTypes" :multiple="false" displayExpr="name" v-model="form.bonus_type"/>
                        </form-group>

                        <form-group
                            :label="'Məbləğ'"
                            name="price"
                        >
                            <form-number v-model="form.price"/>
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
const translateKey = 'crm.EmployeeBonus';

export default {
    name: "EmployeeBonusIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            columns: [
                {
                    caption: 'crm.Employee.Label.Department',
                    dataField: 'department_name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'İşçi tipi',
                    dataField: 'employeeType.name',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Bonus tipi',
                    dataField: 'bonusType.name',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Qiymət',
                    dataField: 'price',
                    show: true,
                    allowFiltering: false
                },
            ],
            form: {}
        }
    },
    
    computed: {
        ...mapState('EmployeeBonusStore', ['employeeBonuses']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('EmployeeTypeStore', ['employeeTypes']),
        ...mapState('BonusTypeStore', ['bonusTypes']),
        ...mapState('GameStore', ['games']),

        customGames() {
            if (this.form.department_id) {
                return this.games.filter(i => i.department.id === this.form.department_id);
            }
            return this.games;
        },
        permission() {
            return this.currentPage.permission;
        }
    },
    watch: {
        'form.department_id'(val) {
            let department = this.select_departments.find(i => i.id === val);
            if(department){
                this.getSelectGames({department_id: department.id});
                this.customGames();
                // console.log(this.employees);
            }
        },
    },
    methods: {
        ...mapActions('EmployeeBonusStore', ['getEmployeeBonuses', 'setEmployeeBonus', 'actionEmployeeBonus', 'deleteEmployeeBonus']),
        ...mapActions('DepartmentStore', ['getSelectAllDepartments']),
        ...mapActions('EmployeeTypeStore', ['getSelectEmployeeTypes']),
        ...mapActions('BonusTypeStore', ['getSelectBonusTypes']),
        ...mapActions('GameStore', ['getSelectGames']),

        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                department_id: item.department_id || null,
                games: item.games || null,
                employee_type_id: item.employee_type_id || null,
                price: item.price || null,
                bonus_type: item.bonus_type || null,
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
            this.getSelectEmployeeTypes();
            this.getSelectAllDepartments();
            this.getSelectBonusTypes();        
            this.formCreate(item);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteEmployeeBonus(id).then(r => this.getEmployeeBonuses()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionEmployeeBonus({id: item.id, type, action}).then(r => this.getEmployeeBonuses())
        },
        /*
         * Save
         * */
        save() {
            this.setEmployeeBonus(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getEmployeeBonuses();
                }
            })
        }
    },
    created() {
        this.getEmployeeBonuses();
    }
}
</script>

<style scoped>

</style>
