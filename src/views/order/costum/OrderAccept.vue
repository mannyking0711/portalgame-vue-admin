<template>
    <page>
        <page-head></page-head>
        <page-body>
            <form @submit.prevent="save">
                <grid cols="12">
                    <grid-col col="9">
                        <div class="p-3 border border-gray-200">
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.OrderInfo') }}</h3>
                            </div>
                            <div class="space-y-4">
                                <div v-if="preview.department.name">
                                    <b>{{ translate('crm.Order.Label.Department') }}: </b>
                                    {{ preview.department.name }}
                                </div>
                                <div v-if="preview.department.phones && preview.department.phones.length">
                                    <b>{{ translate('crm.Order.Label.DepartmentPhone') }}: </b>
                                    <p v-for="i in preview.department.phones">{{ i }}</p>
                                </div>
                                <div v-if="preview.price">
                                    <b>{{ translate('crm.Order.Label.Price') }}: </b>
                                    {{ preview.price }} AZN
                                </div>
                                <div v-if="preview.player_count">
                                    <b>{{ translate('crm.Order.Label.PlayerCount') }}: </b>
                                    {{ preview.player_count }}
                                </div>
                                <div v-if="totalPrice">
                                    <b>{{ translate('crm.Order.Label.TotalPrice') }}: </b>
                                    {{ totalPrice }} AZN
                                </div>
                                <div>
                                    <b>{{ translate('crm.Order.Label.GameName') }}: </b>
                                    <form-group
                                        name="game_id"
                                    >
                                        <form-tree-select @select="gameSelect" :options="customGames" v-model="form.game_id"/>
                                    </form-group>
                                </div>
                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.ReceptionName') }}: </b>
                                    <form-group
                                        name="reception_id"
                                    >
                                        <form-tree-select :options="receptions" displayExpr="fullname" v-model="form.reception_id"/>
                                    </form-group>
                                </div>
                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.Operators') }}: </b>
                                    <form-group
                                        name="employees"
                                    >
                                        <form-tree-select :options="operators" :multiple="true" displayExpr="fullname" v-model="form.employees"/>
                                    </form-group>
                                </div>
                                <div v-if="form.game_id">
                                    <b>{{ translate('crm.Order.Label.Time') }}: </b>
                                    <form-group
                                        name="time"
                                    >
                                        <form-tree-select :options="gameTimes" v-model="form.time"/>
                                    </form-group>
                                </div>
                            </div>
                        </div>
                    </grid-col>

                    <grid-col col="3" class="h-full" v-if="preview.user.fullname || (preview.user.phone && preview.user.phone.length)">
                        <div class="p-3 border border-gray-200 h-full">
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.UserInfo') }}</h3>
                            </div>
                            <div class="space-y-2">
                                <div>
                                    <b>{{ translate('crm.Order.Label.Fullname') }}: </b>
                                    {{ preview.user.fullname }}
                                </div>
                                <div>
                                    <b>{{ translate('crm.Order.Label.Phone') }}: </b>
                                    <p>{{ preview.phone }}</p>
                                </div>
                            </div>
                        </div>
                    </grid-col>

                    <grid-col col="12" v-if="form.game_id">
                        <div>
                            <div>
                                <h3 class="font-medium text-lg mb-2 pb-2 border-b border-gray-200">
                                    {{ translate(translateKey + '.Label.UserInfo') }}
                                </h3>
                            </div>
                            <div class="py-4">
                                <grid cols="3">
                                    <div class="border border-gray-200 rounded p-5 relative" v-for="(i, index) in form.users">
                                        <span class="absolute -top-4 left-0 rounded-full right-0 m-auto w-7 h-7 font-bold inline-flex items-center justify-center bg-blue-500 text-white z-10">
                                            {{ (index + 1) }}
                                        </span>
                                        <span @click="removeCard(index)" v-if="index > 0" class="absolute -top-4 rounded-full -right-3 m-auto w-6 h-6 inline-flex text-xs cursor-pointer items-center justify-center bg-red-500 text-white z-10">
                                            <i class="icon-cancel1"></i>
                                        </span>
                                        <grid>
                                            <form-group
                                                class="cursor-pointer"
                                                :name="'customers.'+index+'.customer_id'"
                                                :label="translate('crm.Order.Label.CustomerSearch')"
                                            >
                                                <tree-select
                                                    :async="true"
                                                    :normalizer="normalizer"
                                                    v-model="i.user_id"
                                                    :load-options="loadOptions"
                                                />
                                            </form-group>

                                            <form-group
                                                name="discount_id"
                                                :label="translate('crm.Order.Label.Discount')"
                                            >
                                                <form-tree-select :options="discounts" v-model="i.discount_id" :placeholder="''"/>
                                            </form-group>

                                            <form-group name="price" :label="translate('crm.Order.Label.Price')">
                                                <div class="pl-3">{{ calcPrice(index) }}</div>
                                            </form-group>
                                        </grid>
                                    </div>

                                    <div class="flex flex-shrink-0 h-60 items-center justify-center border rounded border-gray-200" v-if="form.users.last.user_id">
                                        <app-button @click="newCard" type="button">
                                            {{ translate('crm.Order.Label.NewCard') }}
                                        </app-button>
                                    </div>
                                </grid>
                            </div>
                        </div>
                    </grid-col>

                </grid>

                <grid cols="12">
                    <grid-col col="12" class="py-3">
                        <hr>
                    </grid-col>
                    <grid-col col="12">
                        <app-button class="justify-center" property="success" type="submit">
                            {{ translate('button.Save') }}
                        </app-button>
                    </grid-col>
                </grid>
            </form>
        </page-body>
    </page>
</template>

<script>
/*
 * Import Components
 * */

import {mapActions, mapState} from "vuex";
import OrderUser from "./OrderUser";
import TreeSelect from '@riophae/vue-treeselect'
import { ASYNC_SEARCH } from '@riophae/vue-treeselect'

const translateKey = 'crm.Order';

const previewObject = () => {
    return {
        department: {},
        user: {},
        price: 0,
        phone: null,
        player_count: 0,
    }
}

const formObject = (item = {}) => {
    return {
        order_id: item.id,
        reception_id: null,
        game_id: item.game ? item.game.id : null,
        time: item.time || null,
        employees: [],
        users: [
            {
                user_id: null,
                discount_id: null,
                price: null,
            }
        ],
    }
}

export default {
    name: "OrderAccept",
    components: {OrderUser, TreeSelect},
    data() {
        return {
            translateKey,
            modalId: 'OrderAcceptModal',
            modelShow: false,
            preview: previewObject(),
            normalizer(i) {
                return {
                    id: i.id,
                    label: i.name + ' ' + surname + ( i.email ? ' (' + i.email + ')' : '')
                }
            },
            form: formObject()
        }
    },
    created() {
        this.preview = previewObject();
        this.resetOrder();
        this.getSelectGames();
        this.getSelectDiscounts();
        if (this.$route.params.id) {
            this.getOrder(this.$route.params.id)
            .then(r => {
                this.preview.price = this.order.price;
                this.preview.department = this.order.game.department;
                this.preview.user = this.order.user;
                this.preview.phone = this.order.phone;
                this.preview.player_count = this.order.player_count;
                this.getGameTimes({game_id: this.order.game.id});
                this.form = formObject(this.order);
                for(let i = 0; i < (this.order.player_count - 1); i++) {
                    this.form.users.push({
                        user_id: null,
                        discount_id: null,
                        price: null,
                    })
                }
            })
        }
    },
    watch: {
        'form.game_id'(val) {
            let game = this.games.find(i => i.id === val);
            if (game) {
                this.preview.price = game.price;
                this.getGameTimes({game_id: game.id});
                this.getSelectEmployees({department_id: game.department.id});
            }
            else {
                this.preview = previewObject();
                this.form = formObject();
            }
        },
    },
    computed: {
        ...mapState('OrderStore', ['order']),
        ...mapState('GameStore', ['games', 'gameTimes']),
        ...mapState('UserStore', ['users']),
        ...mapState('DiscountStore', ['discounts']),
        ...mapState('EmployeeStore', ['employees']),
        receptions() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 1)
        },
        operators() {
            return this.employees.filter(i => parseFloat(i.employee_type.id) === 2)
        },
        totalPrice() {
            return this.preview.price * this.preview.player_count
        },
        customGames() {
            if (this.user.department.id) {
                return this.games.filter(i => i.department.id === this.user.department.id);
            }
            return this.games;
        }
    },
    methods: {
        ...mapActions('SaleStore', ['setSale', 'getSales', 'getReports']),
        ...mapActions('OrderStore', ['getOrder', 'resetOrder', 'getOrders']),
        ...mapActions('GameStore', ['getSelectGames', 'getGameTimes']),
        ...mapActions('EmployeeStore', ['getSelectEmployees']),
        ...mapActions('UserStore', ['getSelectUsers']),
        ...mapActions('DiscountStore', ['getSelectDiscounts']),
        removeCard(index) {
            this.form.users.splice(index, 1);
        },
        newCard() {
            this.form.users.push({
                user_id: null,
                discount_id: null,
                price: null
            })
        },
        calcPrice(index) {
            const obj = this.form.users[index];
            let price = 0;
            if (obj) {
                const discount = this.discounts.find(i => i.id === obj.discount_id);
                if (discount && this.preview.price) {
                    price = this.preview.price - ((this.preview.price * discount.interest) / 100);
                    obj.price = price;
                    return price;
                }
                price = this.preview.price;
                obj.price = price;
                return price;
            }
            return price;
        },
        /*
         * Game Select
         * */
        gameSelect(item) {
            this.preview.price = 0;
            const game = this.games.find(i => i.id === item);
            if (game) {
                this.preview.price = game.price;
                this.preview.department = game.department;
            }
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
            this.setSale(this.form)
            .then(r => {
                if (r) {
                    if (this.form.order_id) {
                        this.$tabs.close();
                    }
                    this.form = formObject();
                    this.getOrders();
                    this.getSales();
                    this.getReports();
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
}
</script>

<style scoped>

</style>
