<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="productscategory"
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
                            :label="'Ləvazımat tipi'"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>
                        
                        <form-group  
                            :label="'Ləvazımatın istismar müddəti'"
                            name="life"
                        >
                            <form-text v-model="form.life"/>
                        </form-group>
                        
                        <form-group  
                            :label="'Ləvazımatın sayı'"
                            name="number"
                        >
                            <form-text v-model="form.number "/>
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
const translateKey = 'crm.ProductsCategory';

export default {
    name: "ProductsCategoryIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Ləvazımat tipi',
                    dataField: 'name',
                    show: true,
                    allowFiltering: true
                },
                {
                    caption: 'Ləvazımatın sayı',
                    dataField: 'number',
                    show: true
                },
                {
                    caption: 'Ləvazımatın istismar müddəti',
                    dataField: 'life',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('ProductsCategoryStore', ['productscategory']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ProductsCategoryStore', ['getProductsCategory', 'setProductCategory', 'actionProductCategory', 'deleteProductCategory']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                name: item.name || null,
                life: item.life || null,
                number: item.life || null 
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
            this.alert().then(r => this.deleteProductCategory(id).then(r => this.getProductCategory()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionProductCategory({id: item.id, type, action}).then(r => this.getProductsCategory())
        },
        /*
         * Save
         * */
        save() {
            this.setProductCategory(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getProductsCategory();
                }
            })
        }
    },
    created() {
        this.getProductsCategory();
        console.log(this.productscategory);
    }
}
</script>

<style scoped>

</style>
