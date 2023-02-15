<template>
    <page>
        <page-head>
            <app-button property="success" icon="icon-add" @click="createModal">
                {{ translate('button.Add') }}
            </app-button>
        </page-head>

        <page-body>
            <data-grid
                :data-source="coins"
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
                        <form-group  
                            class="cursor-pointer"
                            :name="'user_id'"
                            :label="translate('crm.Order.Label.CustomerSearch')"
                        >
                            <tree-select
                                :async="true"
                                :normalizer="normalizer"
                                v-model="form.user_id"
                                :load-options="loadOptions"
                            />
                        </form-group>
                        
                        <form-group :label="'Balans'" name="balance">
                            <form-text v-model="form.balance"/>
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
// import CoinsUser from "./CoinsUser";
import TreeSelect from '@riophae/vue-treeselect';
import { ASYNC_SEARCH } from '@riophae/vue-treeselect';

const formObject = (item = {}) => {
    return {
        id: item.id || null,
        user_id: item.user_id || null,
        balance: item.balance || null,
    }
}

const modalId = 'createModal';
const translateKey = 'crm.coin';

export default {
    name: "CoinsIndex",
    components: {TreeSelect},
    data() {
        return {
            translateKey,
            modalId,
            permission: 'coins',
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name+' '+i.surname + ( i.phone ? ' (' + i.phone + ')' : '')
                }
            },
            columns: [
                {
                    caption: 'crm.User.Table.FullName',
                    dataField: 'user.fullname',
                    show: true
                },
                {
                    caption: 'crm.User.Table.Email',
                    dataField: 'user.email',
                    show: true
                },
                {
                    caption: 'crm.User.Table.Tel',
                    dataField: 'user.phone_number',
                    show: true
                },
                {
                    caption: translateKey + '.Table.Coin',
                    dataField: 'balance',
                    show: true
                },
            ],
            form: formObject()
        }
    },
    computed: {
        ...mapState('CoinsStore', ['coins']),
        ...mapState('UserStore', ['users']),

    },
    methods: {
        ...mapActions('CoinsStore', ['getCoins', 'setCoin', 'actionCoin', 'deleteCoin']),
        ...mapActions('UserStore', ['getSelectUsers']),
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
            this.alert().then(r => this.deleteCoin(id).then(r => this.getCoins()))
        },
        /*
        * Action
        * */
        action(item, type) {
            let action = item.action[type] ? 0 : 1;
            this.actionCoin({id: item.id, type, action}).then(r => this.getCoins())
        },
        /*
         * Save
         * */
        save() {
            this.setCoin(this.form)
            .then(r => {
                if (r) {
                    this.modal(this.modalId);
                    this.getCoins();
                }
            })
        },
        loadOptions({action, searchQuery, callback}) {
            if (action === ASYNC_SEARCH) {
                this.getSelectUsers({search: searchQuery, limit: 40})
                .then(r => {
                    callback(null, this.users)
                })
            }
        },
    },
    created() {
        this.getSelectUsers();
        this.getCoins();
    },
    
}
</script>

<style scoped>

</style>
