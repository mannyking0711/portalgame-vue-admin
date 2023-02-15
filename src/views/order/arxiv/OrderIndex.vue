<template>
    <page>
        <page-head :title="pageTitle">
            <div class="space-x-2 flex">
                <app-button @click="filter(1)" style="background: #f1f6ff; border: 1px solid #d6deed">
                    {{ translate('crm.Order.Label.Accepted') }}
                </app-button>

                <app-button @click="filter(2)" style="background: #ffecec; border: 1px solid #edd3d3">
                    {{ translate('crm.Order.Label.NotAccepted') }}
                </app-button>

                <app-button @click="filter(0)" style="background: #fff5ec; border: 1px solid #fdd9b8">
                    {{ translate('crm.Order.Label.Waiting') }}
                </app-button>

                <app-button @click="filter()" v-if="accepted !== null" property="danger">
                    {{ translate('button.Reset') }}
                </app-button>

                <app-button :route="{name: 'order-new'}" property="success" v-if="can(permission + '.create')">
                    {{ translate('crm.Order.Label.NewSale') }}
                </app-button>
            </div>
        </page-head>

        <page-body>

            <data-grid
                :data-source="orders"
                :row-prepared="rowPrepared"
                :row-alternation-enabled="false"
                :columns="columns"
                :total-columns="totalColumns"
                :action-column-width="120"
                :action-column-text="translate(translateKey + '.Label.Action')"
            >
                <div slot="actionSlot" slot-scope="list">

                    <app-button
                        v-if="can(permission + '.action') && list.row.accepted === 0"
                        :sm="true"
                        :route="{name: 'order-new', params: {id: list.row.id}}"
                        icon="icon-check"
                        property="primary"
                    />

                    <app-button
                        v-if="can(permission + '.action') && list.row.accepted === 0"
                        :sm="true"
                        @click="action(list.row, 'accepted', 1)"
                        :title="translate('button.NotAccept')"
                        icon="icon-cancel"
                        property="dark"
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
    </page>
</template>

<script>
/*
 * Import Components
 * */
import {mapActions, mapState} from 'vuex';
import OrderAccept from "./OrderAccept";
import OrderCustomer from "./OrderCustomer";

const modalId = 'createModal';
const translateKey = 'crm.Order';

export default {
    name: "OrderIndex",
    components: {OrderCustomer, OrderAccept},
    data() {
        return {
            translateKey,
            accepted: null,
            pageTitle: null,
            modalId,
            modelShow: false,
            totalColumns: [
                {
                    column: 'totalPrice',
                    customizeText: this.totalPrice
                }
            ],
            columns: [
                {
                    caption: translateKey + '.Label.GameName',
                    dataField: 'game.name',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Department',
                    dataField: 'game.department.name',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Fullname',
                    dataField: 'user.fullname',
                    show: true
                },
                {
                    caption: translateKey + '.Label.Phone',
                    dataField: 'phone',
                    show: true,
                },
                {
                    caption: translateKey + '.Label.CreatedDate',
                    dataField: 'created_at',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: translateKey + '.Label.OrderDate',
                    dataField: 'order_date',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: translateKey + '.Label.Price',
                    dataField: 'price',
                    customizeText: data => data.valueText + ' AZN',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: translateKey + '.Label.PlayerCount',
                    dataField: 'player_count',
                    show: true,
                    allowFiltering: false
                },
                {
                    caption: translateKey + '.Label.TotalPrice',
                    dataField: 'totalPrice',
                    customizeText: data => data.valueText + ' AZN',
                    show: true,
                    allowFiltering: false
                },
            ],
            form: {}
        }
    },
    computed: {
        ...mapState('OrderStore', ['orders', 'orderTotal']),
        permission() {
            return this.currentPage.permission;
        }
    },
    methods: {
        ...mapActions('OrderStore', ['getOrders', 'setOrder', 'actionOrder', 'deleteOrder']),
        /*
         * Total Price
         * */
        totalPrice(data) {
            return this.translate('crm.Order.Label.Sum') + ': ' + this.orderTotal.total_price + ' AZN'
        },
        /*
         * Row Prepared
         * */
        rowPrepared(e) {
            if (e.data?.accepted === 1) {
                e.rowElement.style.backgroundColor = '#f1f6ff';
            }
            else if (e.data?.accepted === 2) {
                e.rowElement.style.backgroundColor = '#ffecec';
            }
            else if (e.data?.accepted === 0) {
                e.rowElement.style.backgroundColor = '#fff5ec';
            }
        },
        /*
         * Create Page Title
         * */
        createPageTitle() {
            let title = this.translate('crm.Sidebar.Orders')
            if (this.accepted === 1) {
                title += ' (' + this.translate('crm.Order.Label.Accepted') + ')';
            }
            else if (this.accepted === 2) {
                title += ' (' + this.translate('crm.Order.Label.NotAccepted') + ')';
            }
            else if (this.accepted === 0) {
                title += ' (' + this.translate('crm.Order.Label.Waiting') + ')';
            }
            this.pageTitle = title;
        },
        /*
         * Form Create
         * */
        formCreate(item = {}) {
            const form = {
                id: item.id || null,
                translates: {}
            }
            this.appLanguages.filter(i => {
                form.translates[i.code] = {
                    name: item.translates && item.translates[i.code] ? item.translates[i.code].name : null,
                }
            });
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
            this.alert().then(r => this.deleteOrder(id).then(r => this.getOrders()))
        },
        /*
         * Action
         * */
        action(item, type) {
            this.actionOrder({id: item.id, type, action: 2}).then(r => this.getOrders())
        },
        /*
         * Filter
         * */
        filter(accepted = null) {
            if (accepted !== null)
                this.getOrders({accepted})
            else
                this.getOrders()
            this.accepted = accepted;
            this.createPageTitle();
        }
    },
    created() {
        this.createPageTitle();
        this.getOrders()
    }
}
</script>

<style scoped>

</style>
