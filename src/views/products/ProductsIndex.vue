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
                            :label="'Məhsulun adı'"
                            name="name"
                        >
                            <form-text v-model="form.name"/>
                        </form-group>
                        
                        <form-group  
                            :label="'Qiymət'"
                            name="price"
                        >
                            <form-text v-model="form.price"/>
                        </form-group>
                        
                        <form-group  
                            :label="'PGC Qiyməti'"
                            name="pgc_price"
                        >
                            <form-text v-model="form.pgc_price"/>
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
const translateKey = 'crm.Products';

export default {
    name: "ProductsIndex",
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: translateKey + '.Label.Name',
                    dataField: 'name',
                    show: true
                },
                {
                    caption: 'Qiymət',
                    dataField: 'price',
                    show: true
                },
                {
                    caption: 'PGC Qiyməti',
                    dataField: 'pgc_price',
                    show: true
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('ProductsStore', ['products']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ProductsStore', ['getProducts', 'setProduct', 'actionProduct', 'deleteProduct']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                name: item.name || null,
                price: item.price || null,
                pgc_price: item.pgc_price || null,
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
    }
}
</script>

<style scoped>

</style>
