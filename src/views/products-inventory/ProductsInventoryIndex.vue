<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="products"
                :columns="columns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list">
                    <app-button
                        v-if="can(permission + '.update')"
                        @click="createModal(list.row)"
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

        <!-- <modal :id="modalId" size="md">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save">
                    <grid>

                        <form-group  
                            :label="'Məhsulun Kodu'"
                            name="code"
                        >
                            <form-text v-model="form.code"/>
                        </form-group>
                        
                        <form-group  
                            :label="'Məhsulun adı'"
                            name="product_name"
                        >
                            <form-text v-model="form.product_name"/>
                        </form-group>
                        
                        <form-group
                            :label="'Ləvazımat tipi'"
                            name="product_type"
                        >
                            <form-tree-select :options="productscategory" displayExpr="name" v-model="form.product_type"/>
                        </form-group>

                        <form-group
                            :label="'Filial'"
                            name="department_id"
                        >
                            <form-tree-select :options="select_departments" v-model="form.department_id"/>
                        </form-group>
                        
                        <form-group
                            :label="'Məhsulu təhfil alan işçilər'"
                            name="employees_id"
                        >
                            <form-tree-select :options="employees" displayExpr="fullname" :multiple="true" v-model="form.employees_id"/>
                        </form-group>

                        <form-group      
                            :label="'Məhsulun qoyulduğu otaq'"
                            name="room"
                        >
                            <form-text v-model="form.room"/>
                        </form-group>

                        <form-group
                            :label="'Qeyd'"
                            name="note"
                        >
                            <form-text-area v-model="form.note"/>
                        </form-group>

                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal> -->
        <InventoryForm/>
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';
import InventoryForm from "./InventoryForm";
const modalId = 'createModal';
const translateKey = 'crm.ProductsInventory';

export default {
    name: "ProductsInventoryIndex",
    components: {InventoryForm},
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            employees: [],
            columns: [
                {
                    caption: '.Label.Code',
                    dataField: 'code',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'Ləvazımat tipi',
                    dataField: 'product_category.name',
                    show: true
                },
                {
                    caption: 'Ləvazımat adı',
                    dataField: 'product_name',
                    show: true
                },
                {
                    caption: 'Ləvazımatın Markası',
                    dataField: 'brand',
                    show: true
                },
                {
                    caption: 'Filial',
                    dataField: 'department.name',
                    show: true
                },
            ],
            form: {}
        }
    },
    // watch: {
    //     'form.department_id'(val) {
    //         let department = this.select_departments.find(i => i.id === val);
    //         if(department){
    //             this.getSelectEmployees({department_id: department.id});
    //             // console.log(this.employees);
    //         }
    //     },
    // },
    computed: {
        ...mapState('ProductsInventoryStore', ['products']),
        // ...mapState('ProductsCategoryStore', ['productscategory']),
        // ...mapState('DepartmentStore', ['select_departments']),
        // ...mapState('EmployeeStore', ['employees']),
        // employeess(){
        //     return this.employees;
        // },
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ProductsInventoryStore', ['getProducts', 'setProduct', 'actionProduct', 'deleteProduct']),
        // ...mapActions('DepartmentStore', ['getSelectDepartments']),
        // ...mapActions('EmployeeStore', ['getSelectEmployees']),
        // ...mapActions('ProductsCategoryStore', ['getSelectProductsCategory']),

        /*
         * Form Create
         * */
        // formCreate(item = {}) {
        //     const form = {
        //         id: item.id || null,
        //         code: item.code || null,
        //         product_name: item.product_name || null,
        //         department_id: item.department_id || null,
        //         employees_id: item.employees_id || null,
        //         note: item.note || null,
        //         room: item.room || null,
        //         product_type: item.product_type || null,
        //     }
        //     this.form = form;
        //     this.modelShow = true;
        // },

        // getRandomCode(){
        //     return Math.floor(100000 + Math.random() * 900000);
        //     // return Math.floor(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
        // },
        /*
         * Create Modal
         * */
        // createModal(item = {}) {
        //     this.modal(this.modalId)
        //     this.modelShow = false;
        //     this.resetError();
        //     this.formCreate(item);
        // },
        /*
        * Create Modal
        * */
        createModal(item = {}) {
            this.$eventBus.$emit('InventoryFormModal', item?.id || null);
        },
        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteProduct(id).then(r => this.getProducts()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionProduct({id: item.id, type, action}).then(r => this.getProducts())
        },
        /*
         * Save
         * */
        save() {
            this.setProduct(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getProducts();
                }
            })
        }
    },
    created() {
        this.getProducts();
        // this.getSelectDepartments();
        // this.getSelectProductsCategory();
        // this.getSelectEmployees();
        // console.log(this.employees);
        // console.log(this.select_departments);
    }
}
</script>

<style scoped>

</style>
