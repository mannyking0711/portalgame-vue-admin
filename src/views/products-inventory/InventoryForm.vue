<template>
    <modal :id="modalId" size="md">
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
                            :label="'Marka'"
                            name="brand"
                        >
                            <form-text v-model="form.brand"/>
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
                            <form-tree-select :options="employeess" displayExpr="fullname" :multiple="true" v-model="form.employees_id"/>
                        </form-group>

                        <!-- <form-group      
                            :label="''"
                            name="room"
                        >
                            <form-text v-model="form.room"/>
                        </form-group> -->

                        <form-group
                            :label="'Məhsulun qoyulduğu otaq'"
                            name="room"
                        >
                            <form-tree-select :options="rooms" v-model="form.room"/>
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
        </modal>
</template>

<script>
/*
 * Import Components
 * */

import {mapActions, mapState} from "vuex";

const translateKey = 'crm.Inventory';

export default {
    name: "InventoryForm",
    data() {
        return {
            translateKey,
            modalId: 'InventoryFormModal',
            modelShow: false,
            ages: [],
            categories: [],
            photoItems: [],
            cover_url: null,
            form: {}
        }
    },
    watch: {
        'form.department_id'(val) {
            let department = this.select_departments.find(i => i.id === val);
            if(department){
                this.getSelectEmployees({department_id: department.id});
                // console.log(this.employees);
            }
        },
    },
    created() {
        
        this.$eventBus.$off('InventoryFormModal');
        this.$eventBus.$on('InventoryFormModal', item => {
            this.modalShow = true;
            this.modal(this.modalId);
            this.formCreate();
            this.getSelectAllDepartments();
            this.getSelectInventoryRooms();
            this.getSelectProductsCategory();
            this.getSelectEmployees();
            if (item) {
                this.getProduct(item)
                .then(r => {
                    this.formCreate(this.product)
                })
            }
        });
    },
    computed: {
        ...mapState('ProductsInventoryStore', ['products','product']),
        ...mapState('ProductsCategoryStore', ['productscategory']),
        ...mapState('DepartmentStore', ['select_departments']),
        ...mapState('InventoryRoomsStore', ['rooms']),
        ...mapState('EmployeeStore', ['employees']),
        employeess(){
            return this.employees;
        },
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ProductsInventoryStore', ['getProducts', 'setProduct', 'getProduct', 'actionProduct', 'deleteProduct']),
        ...mapActions('DepartmentStore', ['getSelectAllDepartments']),
        ...mapActions('InventoryRoomsStore', ['getSelectInventoryRooms']),
        ...mapActions('EmployeeStore', ['getSelectEmployees']),
        ...mapActions('ProductsCategoryStore', ['getSelectProductsCategory']),

        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                code: item.code || null,
                product_name: item.product_name || null,
                brand: item.brand || null,
                department_id: item.department_id || null,
                employees_id: item.employees_id || [],
                note: item.note || null,
                room: item.room || null,
                product_type: item.product_type || null,
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
}
</script>

<style scoped>

</style>
