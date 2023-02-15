<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="certificates"
                :columns="columns"
                :action-column-width="150"
                :action-column-text="translate('crm.User.Table.Action')"
            >

                <div slot="statusTemplate" slot-scope="list">
                    <badge property="warning" v-if="list.row.status === 0">
                        {{ 'Etibarsızdır' }}
                    </badge>
                    <badge property="success" v-else-if="list.row.status === 1">
                        {{ 'Etibarlıdır' }}
                    </badge>
                </div>


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
                        :sm="true"
                        @click="action(list.row, 'status')"
                        :title="list.row.status ? translate('button.DeActivate') : translate('button.Activate')"
                        :icon="!list.row.status ? 'icon-eye-off' : 'icon-eye'"
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

        <modal :id="modalId" size="sm">
            <modal-head>
                <modal-title>{{ currentPage.title }}</modal-title>
            </modal-head>
            <modal-body>
                <form @submit.prevent="save">
                    <grid cols="12">
                        <grid-col col="6">
                            <grid>
                                <form-group :label="'Kod'" name="code">
                                    <form-number v-model="form.code"/>
                                </form-group>

                                <form-group :label="'Endirim tipi'" name="sale_type">
                                    <form-tree-select :options="saleTypes" v-model="form.sale_type"/>
                                </form-group>

                                <form-group :label="'İstifadəçi sayı'" name="player_count">
                                    <form-number v-model="form.player_count"/>
                                </form-group>
                                
                                <form-group v-if="form.sale_type === 2" :label="'Qiymət'" name="price">
                                    <form-number v-model="form.price"/>
                                </form-group>

                                <form-group v-if="form.sale_type === 2" :label="'Ümumi qiymət'" name="total_price">
                                    <form-read v-model="form.total_price">{{calcPrice(form.player_count,form.price)}}</form-read>
                                </form-group>
                                
                                <form-group :label="'Endirim faizi'" name="percent_of_price">
                                    <input class="move-percent form-group pl-2" id="changePercent" v-model="form.percent_of_price" type="number">                                    
                                </form-group>
                                    <input style="margin-top:-20px" type="range" min="0" max="100" step="5" v-model="form.percent_of_price"> 
                                
                                <form-group v-if="form.sale_type === 2" :label="'Müştərinin ödəyəcəyi qiymət'" name="final_price">
                                    <form-read v-model="form.final_price">{{calcPrice(form.player_count,form.price) - ((form.percent_of_price * calcPrice(form.player_count,form.price)) / 100)}}</form-read>
                                </form-group>
                                
                                <form-group :label="'Başlanğıc tarixi'" name="start_date">
                                    <input type="date" :value.prop="form.start_date" v-model="form.start_date" class="form-element">
                                </form-group>
                                
                                <form-group :label="'Son istifadə tarixi'" name="finish_date">
                                    <input type="date" :value.prop="form.finish_date" v-model="form.finish_date" class="form-element">
                                </form-group>
                            </grid>
                        </grid-col>

                        <grid-col col="6">
                            <grid>
                            
                                <form-group :label="'İstifadəçi adı'" name="user_name">
                                    <form-text v-model="form.user_name"/>
                                </form-group>
                                
                                <form-group :label="'Əlaqə nömrə'" name="phone">
                                    <form-number v-model="form.phone"/>
                                </form-group>
                                
                                <form-group :label="'Status'" name="status">
                                    <input type="checkbox" label="addsa" id="status" value="active" v-model="form.status">
                                    <label class="ml-2" :for="'status'">Active</label>
                                </form-group>

                                <form-group :label="'Ofisə ödəniş (ödənilib/ödənilməyib)'" name="paid">
                                    <input type="checkbox" label="addsa" id="paid" value="true" v-model="form.paid">
                                    <label class="ml-2" :for="'paid'">{{ (form.paid === true ? 'Ödənilib' : 'Ödənilməyib') }}</label>
                                </form-group>

                                <form-group :label="'Qeyd'" name="description">
                                    <form-text-area v-model="form.description"/>
                                </form-group>
                                
                            </grid>
                        </grid-col>
                    </grid>
                    <br>
                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
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
// import TreeSelect from '@riophae/vue-treeselect';
// import { ASYNC_SEARCH } from '@riophae/vue-treeselect';

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        sale_type: item.sale_type || null,
        player_count: item.player_count || null,
        price: item.price || null,
        total_price: item.total_price || null,
        start_date: item.start_date || null,
        finish_date: item.finish_date || null,
        user_name: item.user_name || null,
        phone: item.phone || null,
        status: item.status || 1,
        paid: item.paid || false,
        code: item.code || null,
        description: item.description || null,
        percent_of_price: item.percent_of_price || 0
    }
}

const modalId = 'createModal';
const translateKey = 'crm.certificate';

export default {
    name: "CertificatesIndex",
    components: {},
    data() {
        return {
            translateKey,
            modalId,
            permission: 'certificates',
            saleTypes: [
                {id: 1, name: 'Dinamik oyun məbləği'},
                {id: 2, name: 'Sitatik oyun məbləği'},
            ],
            columns: [
                {
                    caption: 'Kod',
                    dataField: 'code',
                    show: true,
                },
                {
                    caption: 'Oyunçu sayı',
                    dataField: 'player_count',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Qiymət',
                    dataField: 'price',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Ümumi qiymət',
                    dataField: 'total_price',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: 'Başlanğıc tarixi',
                    dataField: 'start_date',
                    show: true
                },
                {
                    caption: 'Son istifadə tarixi',
                    dataField: 'finish_date',
                    show: true
                },
                {
                    caption: 'İstifadəçi adı',
                    dataField: 'user_name',
                    show: true
                },
                {
                    caption: 'Əlaqə nömrə',
                    dataField: 'phone',
                    show: true
                },
                {
                    caption: 'Status',
                    dataField: 'status',
                    slot: 'statusTemplate',
                    show: true,
                    allowFiltering: false
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('CertificatesStore', ['certificates']),
        
    },
    methods: {
        ...mapActions('CertificatesStore', ['getCertificates', 'setCertificate', 'actionCertificate', 'deleteCertificate']),
        calcPrice(player_count,price){
            return player_count*price;
        },
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
            this.alert().then(r => this.deleteCertificate(id).then(r => this.getCertificates()))
        },
        /*
        * Action
        * */
        action(item, type) {
            console.log(item);
            let action = item.status ? 0 : 1;
            this.actionCertificate({id: item.id, type, action}).then(r => this.getCertificates())
        },
        /*
         * Save
         * */
        save() {
            this.setCertificate(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCertificates();
                }
            })
        },
        
    },
    created() {

        this.getCertificates();
    },
    
}
</script>

<style scoped>

</style>
