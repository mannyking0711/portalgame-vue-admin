<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="codes"
                :columns="columns"
                :action-column-width="150"
                :action-column-text="translate('crm.User.Table.Action')"
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
            <modal-body>
                <form @submit.prevent="save">
                    <grid>
                                        
                        <form-group :label="'Kode'" name="code" >
                            <form-text v-model="form.code" maxlength="10"/>
                        </form-group>
                
                        <form-group :label="'Balans'" name="balance">
                            <form-text v-model="form.balance"/>
                        </form-group>
                
                        <form-group :label="'İstifadə limiti'" name="usage_limit">
                            <form-text v-model="form.usage_limit"/>
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
        code: item.code || null,
        usage_limit: item.usage_limit || null,
        balance: item.balance || null,
    }
}

const modalId = 'createModal';
const translateKey = 'crm.CoinsPromoCodes';

export default {
    name: "CoinsPromoCodeIndex",
    data() {
        return {
            translateKey,
            modalId,
            permission: 'coinsPromoCode',
            columns: [
                {
                    caption: 'Promo kod',
                    dataField: 'code',
                    show: true
                },
                {
                    caption: 'Balans',
                    dataField: 'balance',
                    show: true
                },
                {
                    caption: 'İstifadə limiti',
                    dataField: 'usage_limit',
                    show: true
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('CoinsPromoCodeStore', ['codes'])
    },
    methods: {
        ...mapActions('CoinsPromoCodeStore', ['getCodes', 'setCode', 'actionCode', 'deleteCode']),
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
            this.alert().then(r => this.deleteCode(id).then(r => this.getCodes()))
        },
        /*
        * Action
        * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionCode({id: item.id, type, action}).then(r => this.getCodes())
        },
        // makeCode(length) {
        //         var result           = '';
        //         var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //         var charactersLength = characters.length;
        //         for ( var i = 0; i < length; i++ ) {
        //         result += characters.charAt(Math.floor(Math.random() * 
        //     charactersLength));
        //     }
        //     return result;
        // },
        /*
         * Save
         * */
        save() {
            this.setCode(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCodes();
                }
            })
        },
        
    },
    created() {
        this.getCodes();
    },
    
}
</script>

<style scoped>

</style>
