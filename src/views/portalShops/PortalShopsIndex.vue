<template>
    <page>
        <page-head>
            <app-button property="primary " @click="setZero" class="mr-2" :class="[dayZero ? 'opacity-50' : '']" :disabled="dayZero">
                {{ translate('Günlük Satış olmadı') }}
            </app-button>

            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="shops"
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
                <form @submit.prevent="save" >
                    <grid>
                        <form-group
                            :label="'Məhsul adı'"
                            name="product_name"
                        >
                        <tree-select
                            :async="true"
                            :normalizer="normalizer"
                            v-model="form.product_id"
                            :load-options="loadOptions"
                        />
                            <!-- <form-text v-model="form.product_name"/> -->
                        </form-group>
                        
                        <form-group
                            :label="'Ümumi qiymət'"
                            name="totalPrice"
                        >
                            <div class="pl-3">{{ calcPrice() }}</div>
                        </form-group>

                        <form-group
                            :label="'Sayı'"
                            name="number"
                        >
                            <form-text v-model="form.number"/>
                        </form-group>

                        <form-group
                            :label="'Nağd'"
                            name="cash"
                        >
                            <form-text v-model="form.cash"/>
                        </form-group>

                        <form-group
                            :label="'Nağdsız'"
                            name="cashless"
                        >
                            <form-text v-model="form.cashless"/>
                        </form-group>
                        
                        <form-group  
                            class="cursor-pointer"
                            :name="'user_id'"
                            :label="'PGC ilə ödəmək üçün müştərini axtar'"
                        >
                            <tree-select
                                :async="true"
                                :normalizer="normalizerUser"
                                v-model="form.user_id"
                                :load-options="loadUsers"
                            />
                        </form-group>   
                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid>
                </form>
            </modal-body>
        </modal>

        <modal :id="'finishMonth'" size="xs">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body v-if="modelShow">
                <form @submit.prevent="save" >
                    <grid>
                        <form-group :label="'Aylıq Satış'" name="paid">
                            <input class="ml-2" type="checkbox" label="addsa" id="paid" value="true" v-model="form.paid">
                            <label class="ml-2" :for="'paid'">{{ (form.paid === true ? 'oldu' : 'Olmadı') }}</label>
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
// import Products from "./Products";
import TreeSelect from '@riophae/vue-treeselect'
import { ASYNC_SEARCH } from '@riophae/vue-treeselect'

const modalId = 'createModal';
const translateKey = 'crm.PortalShops';

export default {
    name: "PortalShopsIndex",
    components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId,
            modelShow: false,
            photoItems: [],
            columns: [
                {
                    caption: 'Məhsul adı',
                    dataField: 'product.name',
                    show: true
                },
                {
                    caption: 'Ümumi məbləğ',
                    dataField: 'total_price',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Nəğd Ödənildi',
                    dataField: 'cash',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'PGC ilə Ödənildi',
                    dataField: 'coin',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Sayı',
                    dataField: 'number',
                    show: true,
                    allowFiltering: false
                },

            ],
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name  + ' ' + ( i.price +' AZN' ) + ' ' + (i.pgc_price ? i.pgc_price + ' PGS' : '')
                }
            },
            normalizerUser(i) {
                return {
                    id: i.id,
                    label: i.name+' '+i.surname + ( i.phone ? ' (' + i.phone + ') ' : '') + (i.coin ? i.coin.balance : '0')+' PGC'
                }
            },
            form: {}
        }
    },
    computed: {
        ...mapState('PortalShopsStore', ['shops', 'dayZero']),
        ...mapState('ProductsStore', ['products']),
        ...mapState('UserStore', ['users']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('ProductsStore', ['getSelectProducts']),
        ...mapActions('PortalShopsStore', ['getVacancies', 'getVacancie', 'actionVacancie', 'deleteVacancie','setVacancie', 'setDayZero', 'isDayZero']),
        ...mapActions('UserStore', ['getSelectUsers']),
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                product_id: item.product_id || null,
                number: item.number || null,
                cash: item.cash || null,
                cashless: item.cashless || null,
                totalPrice: item.totalPrice || null,
                user_id: item.user_id || null
            }
            this.form = form;
            this.modelShow = true;
        },
        /*
         * Calc Price
         * */
        calcPrice() {
            const obj = this.form;
            let totalPrice = 0;
            let totalPGC = 0;

            if (obj) {
                const products = this.products.find(i => i.id === obj.product_id);
                if (products && this.form.number) {
                    totalPrice = products.price * this.form.number;
                    totalPGC = products.pgc_price * this.form.number;
                    obj.totalPrice = totalPrice;
                    obj.totalPGC = totalPGC;
                    return totalPrice + ' AZN '+ ' / ' + totalPGC + ' PGC ';
                }
                obj.totalPrice = totalPrice;
                obj.totalPGC = totalPGC;

                return totalPrice + ' AZN '+ ' / ' + totalPGC + ' PGC ';
            }
            return totalPrice;
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

        setZero() {
            this.alert('Bu gün satış 0 kimi qeyd olunacaq!').then(
                r => this.setDayZero()
                .then(
                r => {
                    if (r) {
                        this.getVacancies();
                        this.isDayZero();
                    }
                })
            )
        },

        /*
         * Remove
         * */
        remove(id) {
            this.alert().then(r => this.deleteVacancie(id).then(r => this.getVacancies()))
        },
        /*
         * Action
         * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionVacancie({id: item.id, type, action}).then(r => this.getVacancies())
        },
        /*
         * Save
         * */
        save() {
            this.setVacancie(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getVacancies();
                }
            })
        },
        loadOptions({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectProducts({search: searchQuery, limit: 40})
                .then(r => {
                    callback(null, this.products)
                })
            }
        },
        loadUsers({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectUsers({search: searchQuery, limit: 40})
                .then(r => {
                    callback(null, this.users)
                })
            }
        },
    },

    created() {
        this.getVacancies();
        this.isDayZero();
    }
    
}
</script>

<style scoped>

</style>
